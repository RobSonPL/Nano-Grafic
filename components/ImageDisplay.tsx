
import React, { useRef, useState } from 'react';
import { GeneratedImage, ImageFormat } from '../types';
import { Upload, Download, RefreshCcw, Image as ImageIcon, X, Sparkles, Sliders, Eraser, ChevronsUp } from 'lucide-react';
import ImageEditor from './ImageEditor';
import { useLanguage } from './LanguageContext';

interface ImageDisplayProps {
  currentImage: GeneratedImage | null;
  uploadedImage: string | null;
  onUpload: (file: File) => void;
  onClearUpload: () => void;
  isGenerating: boolean;
  selectedFormat: ImageFormat;
  onUpdateImage: (newBase64: string) => void;
  onRemoveBackground: () => void;
  onUpscale: () => void;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({
  currentImage,
  uploadedImage,
  onUpload,
  onClearUpload,
  isGenerating,
  selectedFormat,
  onUpdateImage,
  onRemoveBackground,
  onUpscale
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { t } = useLanguage();

  // Determine what is currently being displayed
  const displayImageBase64 = currentImage ? currentImage.data : (uploadedImage ? uploadedImage.split(',')[1] : null);
  const displayMimeType = currentImage ? currentImage.mimeType : (uploadedImage ? (uploadedImage.match(/data:(.*);base64/)?.[1] || 'image/png') : 'image/png');
  const fullDisplaySrc = displayImageBase64 ? `data:${displayMimeType};base64,${displayImageBase64}` : null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  const handleDownload = () => {
    if (!fullDisplaySrc) return;

    const link = document.createElement('a');
    
    // Simple download logic
    link.href = fullDisplaySrc;
    link.download = `nanographix-${Date.now()}.${selectedFormat === ImageFormat.JPEG ? 'jpg' : 'png'}`;
    link.click();
  };

  const handleSaveEdit = (newBase64: string) => {
    onUpdateImage(newBase64);
    setIsEditing(false);
  };

  return (
    <div className="flex-1 h-full bg-gray-950 relative flex flex-col items-center justify-center p-8 overflow-hidden">
      
      {/* Internal Editor Overlay */}
      {isEditing && fullDisplaySrc && (
        <ImageEditor 
          imageBase64={fullDisplaySrc} 
          mimeType={displayMimeType}
          onSave={handleSaveEdit}
          onCancel={() => setIsEditing(false)}
        />
      )}

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10" 
           style={{ backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>

      <div className="relative z-10 w-full max-w-5xl h-full flex flex-col">
        
        {/* Top Bar - Upload Info & Actions */}
        <div className="h-16 flex items-center justify-between mb-4">
             {uploadedImage && !currentImage ? (
                 <div className="flex items-center gap-3 bg-gray-900/80 border border-gray-700 px-4 py-2 rounded-full backdrop-blur-sm">
                    <img src={uploadedImage} alt="Reference" className="w-8 h-8 rounded object-cover border border-gray-600" />
                    <span className="text-xs text-gray-300">{t.refUpload}</span>
                    <button onClick={onClearUpload} className="p-1 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                 </div>
             ) : (
                 currentImage ? (
                   <div className="flex items-center gap-2 text-xs text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
                     <Sparkles className="w-3 h-3" /> {t.generatedResult}
                   </div>
                 ) : (
                   <div className="text-gray-500 text-sm flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-700"></div>
                      {t.emptyCanvas}
                   </div>
                 )
             )}
             
             {/* Action Buttons Group */}
             <div className="flex gap-2">
               {fullDisplaySrc && !isGenerating && (
                 <>
                    <button 
                        onClick={onRemoveBackground}
                        disabled={isGenerating}
                        className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-200 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                        title={t.removeBg}
                    >
                        <Eraser className="w-4 h-4 text-pink-400" />
                        <span className="hidden sm:inline">{t.removeBg}</span>
                    </button>

                    <button 
                        onClick={onUpscale}
                        disabled={isGenerating}
                        className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-200 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                        title={t.upscale}
                    >
                        <ChevronsUp className="w-4 h-4 text-green-400" />
                        <span className="hidden sm:inline">{t.upscale}</span>
                    </button>

                    <div className="w-px h-8 bg-gray-700 mx-1"></div>

                    <button 
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        <Sliders className="w-4 h-4" />
                        {t.adjust}
                    </button>

                    <button 
                        onClick={handleDownload}
                        className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        {t.download}
                    </button>
                 </>
               )}
             </div>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 bg-gray-900/50 border-2 border-dashed border-gray-700 rounded-2xl flex items-center justify-center relative group overflow-hidden shadow-2xl backdrop-blur-sm">
            
            {isGenerating && (
                <div className="absolute inset-0 z-50 bg-gray-900/80 backdrop-blur flex flex-col items-center justify-center">
                    <div className="relative w-24 h-24 mb-4">
                         <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
                         <div className="absolute inset-0 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                         <Sparkles className="absolute inset-0 m-auto text-yellow-500 animate-pulse w-8 h-8" />
                    </div>
                    <p className="text-yellow-400 font-mono animate-pulse">{t.processing}</p>
                </div>
            )}

            {!fullDisplaySrc && (
                <div className="text-center p-8">
                    <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Upload className="w-10 h-10 text-gray-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-300 mb-2">{t.startCreating}</h3>
                    <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
                        {t.startCreatingDesc}
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors border border-gray-600 flex items-center gap-2"
                        >
                            <ImageIcon className="w-4 h-4" />
                            {t.uploadForEdit}
                        </button>
                    </div>
                </div>
            )}

            {fullDisplaySrc && (
                 <div className="relative w-full h-full p-4 flex items-center justify-center animate-fade-in">
                    <img 
                        src={fullDisplaySrc} 
                        alt="Canvas" 
                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" 
                    />
                 </div>
            )}

            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/png, image/jpeg, image/webp"
            />
        </div>

        {/* Info Footer */}
        <div className="h-12 flex items-center justify-center text-xs text-gray-600 mt-2">
            {t.supportedInputs}
        </div>

      </div>
    </div>
  );
};

export default ImageDisplay;
