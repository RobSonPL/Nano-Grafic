
import React, { useState, useCallback, useEffect } from 'react';
import ControlPanel from './components/ControlPanel';
import ImageDisplay from './components/ImageDisplay';
import Gallery from './components/Gallery';
import CollageMaker from './components/CollageMaker';
import { generateImage, enhancePrompt } from './services/geminiService';
import { AspectRatio, ImageFormat, GeneratedImage, GalleryItem } from './types';
import { loadGallery, saveGallery } from './utils/storage';
import { LanguageProvider } from './components/LanguageContext';

const AppContent: React.FC = () => {
  // State
  const [prompt, setPrompt] = useState<string>("");
  const [style, setStyle] = useState<string>("none");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.SQUARE);
  const [format, setFormat] = useState<ImageFormat>(ImageFormat.PNG);
  
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedMimeType, setUploadedMimeType] = useState<string | null>(null);
  
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Gallery State - initialized from storage
  const [gallery, setGallery] = useState<GalleryItem[]>(() => loadGallery());

  // Collage State
  const [showCollageMaker, setShowCollageMaker] = useState(false);
  const [selectedGalleryIds, setSelectedGalleryIds] = useState<string[]>([]);

  // Save gallery to storage whenever it changes
  useEffect(() => {
    saveGallery(gallery);
  }, [gallery]);

  // Helpers
  const addToGallery = (item: GalleryItem) => {
    setGallery(prev => [...prev, item]);
  };

  // Handlers
  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const result = e.target.result as string;
        setUploadedImage(result);
        setUploadedMimeType(file.type);
        setCurrentImage(null);
        
        // Optionally add uploads to gallery
        const newItem: GalleryItem = {
          id: crypto.randomUUID(),
          data: result.split(',')[1],
          mimeType: file.type,
          type: 'uploaded',
          timestamp: Date.now()
        };
        addToGallery(newItem);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClearUpload = () => {
    setUploadedImage(null);
    setUploadedMimeType(null);
  };

  const handleEnhancePrompt = async () => {
    if (!prompt) return;
    setIsEnhancing(true);
    try {
        const enhanced = await enhancePrompt(prompt);
        setPrompt(enhanced);
    } catch (e) {
        console.error("Failed to enhance prompt", e);
        // Fail silently or show toast, but don't block user
    } finally {
        setIsEnhancing(false);
    }
  };

  const handleGenerate = useCallback(async () => {
    if (!prompt) return;

    setIsGenerating(true);
    setError(null);

    try {
      const result = await generateImage({
        prompt,
        style,
        aspectRatio,
        format,
        referenceImage: uploadedImage || undefined,
        referenceMimeType: uploadedMimeType || undefined
      });
      setCurrentImage(result);

      // Add generated result to gallery
      const newItem: GalleryItem = {
        id: result.id,
        data: result.data,
        mimeType: result.mimeType,
        type: 'generated',
        prompt: result.prompt,
        timestamp: result.timestamp
      };
      addToGallery(newItem);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, style, aspectRatio, format, uploadedImage, uploadedMimeType]);

  const handleAiEditAction = async (actionType: 'remove-bg' | 'upscale') => {
    // Determine the source image (current result OR uploaded image)
    let sourceData: string | undefined = undefined;
    let sourceMime: string | undefined = undefined;

    if (currentImage) {
        sourceData = `data:${currentImage.mimeType};base64,${currentImage.data}`;
        sourceMime = currentImage.mimeType;
    } else if (uploadedImage) {
        sourceData = uploadedImage;
        sourceMime = uploadedMimeType || 'image/png';
    }

    if (!sourceData || !sourceMime) return;

    setIsGenerating(true);
    setError(null);

    let actionPrompt = "";
    if (actionType === 'remove-bg') {
        actionPrompt = "Remove the background from this image. Keep the main subject isolated on a clean white or transparent background. Do not alter the subject.";
    } else {
        actionPrompt = "Upscale this image to high resolution (4k). Enhance details, improve sharpness, reduce noise, and make it look photorealistic.";
    }

    try {
      // We pass 'none' style to strictly follow the instruction without adding artistic styles
      const result = await generateImage({
        prompt: actionPrompt,
        style: 'none', 
        aspectRatio, 
        format,
        referenceImage: sourceData,
        referenceMimeType: sourceMime
      });
      
      setCurrentImage(result);

      // Add generated result to gallery with a clear label
      const newItem: GalleryItem = {
        id: result.id,
        data: result.data,
        mimeType: result.mimeType,
        type: 'edited',
        prompt: actionType === 'remove-bg' ? 'Background Removal' : 'Upscaled Image',
        timestamp: result.timestamp
      };
      addToGallery(newItem);

    } catch (err: any) {
      console.error(err);
      setError(err.message || `Failed to ${actionType}. Please try again.`);
    } finally {
      setIsGenerating(false);
    }
  };


  const handleGallerySelect = (item: GalleryItem) => {
    const fullSrc = `data:${item.mimeType};base64,${item.data}`;
    
    setUploadedImage(fullSrc);
    setUploadedMimeType(item.mimeType);
    setCurrentImage(null); // Clear current result to show the selected image
    if (item.prompt) setPrompt(item.prompt); // Restore prompt
  };

  const handleGalleryDelete = (id: string) => {
    setGallery(prev => prev.filter(item => item.id !== id));
  };

  const handleImageUpdate = (newBase64: string) => {
    // This comes from the Image Editor
    // Update the currently viewed image (whether it's currentImage or uploadedImage)
    // And save to gallery as 'edited'
    
    // Update display
    if (currentImage) {
        setCurrentImage({
            ...currentImage,
            data: newBase64
        });
    } else if (uploadedImage) {
        // preserve mimetype of original if possible, or default to png
        const mime = uploadedMimeType || 'image/png';
        setUploadedImage(`data:${mime};base64,${newBase64}`);
    }

    // Add to gallery
    const newItem: GalleryItem = {
      id: crypto.randomUUID(),
      data: newBase64,
      mimeType: currentImage?.mimeType || uploadedMimeType || 'image/png',
      type: 'edited',
      timestamp: Date.now(),
      prompt: prompt
    };
    addToGallery(newItem);
  };

  // Collage Handlers
  const openCollageMaker = () => {
    if (selectedGalleryIds.length < 2) return;
    setShowCollageMaker(true);
  };

  const handleSaveCollage = (collageBase64: string) => {
    // Save to gallery
    const newItem: GalleryItem = {
      id: crypto.randomUUID(),
      data: collageBase64,
      mimeType: 'image/png',
      type: 'collage',
      timestamp: Date.now(),
      prompt: 'Collage'
    };
    addToGallery(newItem);
    
    // Set as current image to view it
    setUploadedImage(`data:image/png;base64,${collageBase64}`);
    setUploadedMimeType('image/png');
    setCurrentImage(null);

    // Close and reset
    setShowCollageMaker(false);
    setSelectedGalleryIds([]);
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-full bg-gray-900 text-white font-sans overflow-hidden">
      
      {/* Collage Overlay */}
      {showCollageMaker && (
        <CollageMaker 
            images={gallery.filter(item => selectedGalleryIds.includes(item.id)).map(item => item.data)}
            onSave={handleSaveCollage}
            onCancel={() => setShowCollageMaker(false)}
        />
      )}

      {/* Sidebar Controls */}
      <ControlPanel 
        prompt={prompt}
        setPrompt={setPrompt}
        style={style}
        setStyle={setStyle}
        aspectRatio={aspectRatio}
        setAspectRatio={setAspectRatio}
        format={format}
        setFormat={setFormat}
        isGenerating={isGenerating}
        onGenerate={handleGenerate}
        hasReferenceImage={!!uploadedImage}
        referenceImagePreview={uploadedImage}
        clearReferenceImage={handleClearUpload}
        onUpload={handleUpload}
        isEnhancing={isEnhancing}
        onEnhancePrompt={handleEnhancePrompt}
      />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col h-full relative">
         {error && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-500/90 text-white px-6 py-3 rounded-lg shadow-xl backdrop-blur-md flex items-center gap-2 animate-bounce">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
              <button onClick={() => setError(null)} className="ml-4 opacity-75 hover:opacity-100">✕</button>
            </div>
         )}
         
         <div className="flex-1 overflow-hidden">
            <ImageDisplay 
            currentImage={currentImage}
            uploadedImage={uploadedImage}
            onUpload={handleUpload}
            onClearUpload={handleClearUpload}
            isGenerating={isGenerating}
            selectedFormat={format}
            onUpdateImage={handleImageUpdate}
            onRemoveBackground={() => handleAiEditAction('remove-bg')}
            onUpscale={() => handleAiEditAction('upscale')}
            />
         </div>

         {/* Gallery Strip */}
         <Gallery 
            items={gallery} 
            onSelect={handleGallerySelect}
            onDelete={handleGalleryDelete}
            selectedId={currentImage?.id} 
            onMultiSelect={setSelectedGalleryIds}
            onCreateCollage={openCollageMaker}
         />
      </div>
      
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;
