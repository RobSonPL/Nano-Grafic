
import React, { useState, useEffect } from 'react';
import { RotateCw, RotateCcw, Check, X, Undo, Sun, Contrast, History } from 'lucide-react';
import { processImage, ImageSettings } from '../utils/imageProcessor';
import { loadEditorSettings, saveEditorSettings, clearEditorSettings } from '../utils/storage';
import { useLanguage } from './LanguageContext';

interface ImageEditorProps {
  imageBase64: string;
  mimeType: string;
  onSave: (newBase64: string) => void;
  onCancel: () => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ imageBase64, mimeType, onSave, onCancel }) => {
  // Initialize from storage or default
  const [settings, setSettings] = useState<ImageSettings>(() => {
    const saved = loadEditorSettings();
    return saved || { brightness: 0, contrast: 0, rotation: 0 };
  });
  
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const { t } = useLanguage();

  // Save settings to storage whenever they change
  useEffect(() => {
    saveEditorSettings(settings);
  }, [settings]);

  // Generate preview when settings change
  useEffect(() => {
    let active = true;
    const updatePreview = async () => {
      try {
        const result = await processImage(imageBase64, settings, mimeType);
        if (active) setPreviewUrl(result);
      } catch (e) {
        console.error("Preview generation failed", e);
      }
    };
    
    const timer = setTimeout(updatePreview, 50);
    return () => {
        clearTimeout(timer);
        active = false;
    };
  }, [settings, imageBase64, mimeType]);

  const handleRotate = (deg: number) => {
    setSettings(prev => ({
      ...prev,
      rotation: (prev.rotation + deg) % 360
    }));
  };

  const handleReset = () => {
    const defaults = { brightness: 0, contrast: 0, rotation: 0 };
    setSettings(defaults);
    saveEditorSettings(defaults);
  };

  const handleSave = async () => {
    setIsProcessing(true);
    try {
      // Process at full quality
      const finalImage = await processImage(imageBase64, settings, mimeType);
      // Remove data prefix
      const rawBase64 = finalImage.split(',')[1];
      
      // Clear saved settings so next session starts fresh
      clearEditorSettings();
      
      onSave(rawBase64);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const fullOriginalSrc = imageBase64.startsWith('data:') ? imageBase64 : `data:${mimeType};base64,${imageBase64}`;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col animate-fade-in">
      
      {/* Top Bar */}
      <div className="h-16 flex items-center justify-between px-6 bg-[#0a0a0a] border-b border-gray-800 shrink-0">
        <button 
          onClick={onCancel} 
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
          <span className="text-sm font-medium">{t.cancel}</span>
        </button>
        
        <div className="flex items-center gap-3">
             <button 
                onMouseDown={() => setShowOriginal(true)}
                onMouseUp={() => setShowOriginal(false)}
                onMouseLeave={() => setShowOriginal(false)}
                onTouchStart={() => setShowOriginal(true)}
                onTouchEnd={() => setShowOriginal(false)}
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium select-none active:scale-95 transform"
             >
                <History size={14} />
                <span>{t.holdCompare}</span>
             </button>

             <button 
                onClick={handleSave} 
                disabled={isProcessing}
                className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-1.5 rounded-full font-bold shadow-lg transition-all disabled:opacity-50"
             >
                {isProcessing ? (
                   <span className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full"></span>
                ) : (
                   <Check size={18} />
                )}
                <span>{t.save}</span>
             </button>
        </div>
      </div>

      {/* Main Workspace (Image Area) - Takes remaining space */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-[#121212] p-4">
         {/* Checkerboard Background */}
         <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{ 
                backgroundImage: `linear-gradient(45deg, #333 25%, transparent 25%), linear-gradient(-45deg, #333 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #333 75%), linear-gradient(-45deg, transparent 75%, #333 75%)`,
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px' 
            }}
         ></div>

         <div className="relative z-10 w-full h-full flex items-center justify-center">
            {showOriginal ? (
                 <img 
                    src={fullOriginalSrc} 
                    alt="Original" 
                    className="max-w-full max-h-full object-contain shadow-2xl rounded-sm ring-2 ring-blue-500/50" 
                 />
            ) : (
                previewUrl ? (
                    <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="max-w-full max-h-full object-contain shadow-2xl rounded-sm" 
                    />
                ) : (
                    <div className="w-12 h-12 border-4 border-gray-600 border-t-yellow-500 rounded-full animate-spin"></div>
                )
            )}
            
            {showOriginal && (
                <div className="absolute top-4 left-4 bg-blue-500 text-white text-xs px-2 py-1 rounded shadow-lg font-bold uppercase tracking-wider">
                    {t.source}
                </div>
            )}
         </div>
      </div>

      {/* Controls Panel - Fixed at bottom */}
      <div className="bg-[#0a0a0a] border-t border-gray-800 shrink-0 p-6 pb-8">
         <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-center justify-center">
            
            {/* Adjustment Sliders */}
            <div className="flex-1 w-full space-y-6">
                
                {/* Brightness */}
                <div className="space-y-2 group">
                    <div className="flex justify-between items-center text-sm">
                        <label className="flex items-center gap-2 text-gray-300 font-medium group-hover:text-yellow-400 transition-colors">
                            <Sun size={16} /> {t.brightness}
                        </label>
                        <span className="font-mono text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded w-10 text-center">{settings.brightness > 0 ? '+' : ''}{settings.brightness}</span>
                    </div>
                    <input 
                        type="range" 
                        min="-100" 
                        max="100" 
                        value={settings.brightness} 
                        onChange={(e) => setSettings({...settings, brightness: Number(e.target.value)})}
                        className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500 hover:accent-yellow-400 focus:outline-none"
                    />
                </div>

                {/* Contrast */}
                <div className="space-y-2 group">
                    <div className="flex justify-between items-center text-sm">
                        <label className="flex items-center gap-2 text-gray-300 font-medium group-hover:text-blue-400 transition-colors">
                            <Contrast size={16} /> {t.contrast}
                        </label>
                        <span className="font-mono text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded w-10 text-center">{settings.contrast > 0 ? '+' : ''}{settings.contrast}</span>
                    </div>
                    <input 
                        type="range" 
                        min="-100" 
                        max="100" 
                        value={settings.contrast} 
                        onChange={(e) => setSettings({...settings, contrast: Number(e.target.value)})}
                        className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 focus:outline-none"
                    />
                </div>
            </div>

            {/* Rotation Controls */}
            <div className="flex items-center gap-4 border-l border-gray-800 pl-8">
                <div className="flex flex-col items-center gap-2">
                    <span className="text-[10px] text-gray-500 font-bold uppercase">{t.rotate}</span>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => handleRotate(-90)}
                            className="p-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-300 transition-colors"
                            title="Rotate Left"
                        >
                            <RotateCcw size={20} />
                        </button>
                        <button 
                            onClick={() => handleRotate(90)}
                            className="p-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-300 transition-colors"
                            title="Rotate Right"
                        >
                            <RotateCw size={20} />
                        </button>
                    </div>
                </div>
                
                <div className="h-12 w-px bg-gray-800 mx-2"></div>
                
                <button 
                    onClick={handleReset}
                    className="flex flex-col items-center gap-1 text-gray-500 hover:text-red-400 p-2 rounded-lg hover:bg-gray-800 transition-colors"
                    title="Reset All"
                >
                    <Undo size={18} />
                    <span className="text-[10px]">{t.reset}</span>
                </button>
            </div>

         </div>
      </div>
    </div>
  );
};

export default ImageEditor;
