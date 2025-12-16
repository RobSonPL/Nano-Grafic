
import React, { useState, useEffect } from 'react';
import { CollageLayout } from '../types';
import { createCollage, CollageSettings } from '../utils/collageProcessor';
import { X, Check, Layout, Grip, AlignVerticalJustifyCenter, AlignHorizontalJustifyCenter } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface CollageMakerProps {
  images: string[]; // Base64 strings
  onSave: (collageBase64: string) => void;
  onCancel: () => void;
}

const CollageMaker: React.FC<CollageMakerProps> = ({ images, onSave, onCancel }) => {
  const [settings, setSettings] = useState<CollageSettings>({
    layout: CollageLayout.GRID,
    spacing: 20,
    backgroundColor: '#ffffff',
    borderRadius: 0,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  // Debounced preview generation
  useEffect(() => {
    let active = true;
    
    const generate = async () => {
      if (!images || images.length === 0) {
          setError("No images selected for collage.");
          return;
      }

      try {
        setIsProcessing(true);
        setError(null);
        const result = await createCollage(images, settings);
        if (active) {
            setPreviewUrl(result);
            setIsProcessing(false);
        }
      } catch (e: any) {
        console.error("Collage generation failed", e);
        if (active) {
            setError(e.message || "Failed to generate collage");
            setIsProcessing(false);
        }
      }
    };

    // Immediate execution on mount, debounce on updates
    const timeout = setTimeout(generate, 100);
    return () => {
        active = false;
        clearTimeout(timeout);
    };
  }, [images, settings]);

  const handleSave = () => {
      if (previewUrl) {
          const raw = previewUrl.split(',')[1];
          onSave(raw);
      }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/95 flex flex-col animate-fade-in">
      
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 bg-gray-900 border-b border-gray-800 shrink-0">
        <button onClick={onCancel} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <X size={20} /> <span className="text-sm font-medium">{t.cancel}</span>
        </button>
        <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <Layout className="text-yellow-500" /> {t.collageStudio}
        </h2>
        <button 
            onClick={handleSave} 
            disabled={!previewUrl || isProcessing}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-1.5 rounded-full font-bold shadow-lg transition-all disabled:opacity-50"
        >
            <Check size={18} /> {t.save}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Preview Area */}
        <div className="flex-1 p-8 flex items-center justify-center bg-[#121212] relative overflow-hidden">
            <div 
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}
            ></div>

            {error ? (
                 <div className="text-red-400 flex flex-col items-center gap-2">
                    <X size={32} />
                    <span className="font-medium">{error}</span>
                 </div>
            ) : previewUrl ? (
                <img 
                    src={previewUrl} 
                    alt="Collage Preview" 
                    className="max-w-full max-h-full object-contain shadow-2xl rounded-lg ring-1 ring-gray-700"
                />
            ) : (
                <div className="flex flex-col items-center gap-3 text-gray-500">
                    <div className="w-10 h-10 border-4 border-gray-700 border-t-yellow-500 rounded-full animate-spin"></div>
                    <span className="text-sm">{t.generating}...</span>
                </div>
            )}
        </div>

        {/* Sidebar Controls */}
        <div className="w-80 bg-gray-900 border-l border-gray-800 p-6 flex flex-col gap-8 overflow-y-auto shrink-0">
            
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                 <h4 className="text-xs text-gray-400 uppercase font-bold mb-1">{t.selectedImages}</h4>
                 <p className="text-xl text-white font-mono">{images.length}</p>
                 <p className="text-[10px] text-gray-500 mt-1">
                     {images.length === 2 && "Using Split Layout"}
                     {images.length === 3 && "Using Mix Layout"}
                     {images.length >= 4 && "Using 2x2 Grid Layout"}
                 </p>
            </div>

            {/* Layout Selection */}
            <section>
                <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">{t.layout}</h3>
                <div className="grid grid-cols-3 gap-2">
                    <button 
                        onClick={() => setSettings(s => ({...s, layout: CollageLayout.GRID}))}
                        className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${settings.layout === CollageLayout.GRID ? 'bg-yellow-500/10 border-yellow-500 text-yellow-400' : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-750'}`}
                    >
                        <Grip size={20} />
                        <span className="text-[10px] font-bold">{t.autoGrid}</span>
                    </button>
                    <button 
                        onClick={() => setSettings(s => ({...s, layout: CollageLayout.HORIZONTAL}))}
                        className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${settings.layout === CollageLayout.HORIZONTAL ? 'bg-yellow-500/10 border-yellow-500 text-yellow-400' : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-750'}`}
                    >
                        <AlignHorizontalJustifyCenter size={20} />
                        <span className="text-[10px] font-bold">{t.row}</span>
                    </button>
                    <button 
                        onClick={() => setSettings(s => ({...s, layout: CollageLayout.VERTICAL}))}
                        className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${settings.layout === CollageLayout.VERTICAL ? 'bg-yellow-500/10 border-yellow-500 text-yellow-400' : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-750'}`}
                    >
                        <AlignVerticalJustifyCenter size={20} />
                        <span className="text-[10px] font-bold">{t.column}</span>
                    </button>
                </div>
            </section>

            {/* Spacing */}
            <section className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-300">{t.spacing}</span>
                    <span className="text-gray-500 font-mono text-xs">{settings.spacing}px</span>
                </div>
                <input 
                    type="range" min="0" max="100" value={settings.spacing}
                    onChange={(e) => setSettings(s => ({...s, spacing: Number(e.target.value)}))}
                    className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                />
            </section>

            {/* Border Radius */}
            <section className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-300">{t.rounding}</span>
                    <span className="text-gray-500 font-mono text-xs">{settings.borderRadius}px</span>
                </div>
                <input 
                    type="range" min="0" max="100" value={settings.borderRadius}
                    onChange={(e) => setSettings(s => ({...s, borderRadius: Number(e.target.value)}))}
                    className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                />
            </section>

            {/* Background Color */}
            <section>
                <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">{t.background}</h3>
                <div className="flex gap-3">
                    {['#ffffff', '#000000', 'transparent'].map(color => (
                        <button
                            key={color}
                            onClick={() => setSettings(s => ({...s, backgroundColor: color}))}
                            className={`w-10 h-10 rounded-full border-2 transition-all ${settings.backgroundColor === color ? 'border-yellow-500 scale-110' : 'border-gray-600 hover:border-gray-400'}`}
                            style={{ background: color === 'transparent' ? 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzhhYWGMYAEYB8RmROaABADeOQ8CXl/xfgAAAABJRU5ErkJggg==)' : color }}
                            title={color}
                        />
                    ))}
                    {/* Color Picker */}
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-gray-600">
                        <input 
                            type="color" 
                            value={settings.backgroundColor === 'transparent' ? '#ffffff' : settings.backgroundColor}
                            onChange={(e) => setSettings(s => ({...s, backgroundColor: e.target.value}))}
                            className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] cursor-pointer p-0 border-0"
                        />
                    </div>
                </div>
            </section>

        </div>
      </div>
    </div>
  );
};

export default CollageMaker;
