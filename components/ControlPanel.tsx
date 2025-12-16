
import React, { useRef } from 'react';
import { AspectRatio, ImageFormat } from '../types';
import { STYLE_PRESETS, ASPECT_RATIO_OPTIONS } from '../constants';
import { Settings, Image as ImageIcon, Sparkles, Layout, Download, Wand2, Upload, X } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface ControlPanelProps {
  prompt: string;
  setPrompt: (s: string) => void;
  style: string;
  setStyle: (s: string) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (a: AspectRatio) => void;
  format: ImageFormat;
  setFormat: (f: ImageFormat) => void;
  isGenerating: boolean;
  onGenerate: () => void;
  hasReferenceImage: boolean;
  referenceImagePreview?: string | null;
  clearReferenceImage: () => void;
  onUpload: (file: File) => void;
  isEnhancing: boolean;
  onEnhancePrompt: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  prompt,
  setPrompt,
  style,
  setStyle,
  aspectRatio,
  setAspectRatio,
  format,
  setFormat,
  isGenerating,
  onGenerate,
  hasReferenceImage,
  referenceImagePreview,
  clearReferenceImage,
  onUpload,
  isEnhancing,
  onEnhancePrompt
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t, language, setLanguage } = useLanguage();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        onUpload(e.target.files[0]);
    }
  };

  return (
    <div className="w-full md:w-80 lg:w-96 bg-gray-800 border-r border-gray-700 flex flex-col h-full overflow-y-auto">
      
      {/* Header with Language Flags */}
      <div className="p-6 border-b border-gray-700 bg-gray-900 sticky top-0 z-10">
        <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
                {t.appTitle}
            </h1>
            </div>
            {/* Language Flags */}
            <div className="flex gap-2">
                <button onClick={() => setLanguage('en')} className={`w-6 h-4 rounded overflow-hidden transition-transform hover:scale-110 ${language === 'en' ? 'ring-2 ring-yellow-500' : 'opacity-60'}`} title="English">
                   <svg viewBox="0 0 60 30"><clipPath id="s"><path d="M0,0 v30 h60 v-30 z"/></clipPath><clipPath id="t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath><g clipPath="url(#s)"><path d="M0,0 v30 h60 v-30 z" fill="#012169"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/><path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4"/><path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/><path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/></g></svg>
                </button>
                <button onClick={() => setLanguage('pl')} className={`w-6 h-4 rounded overflow-hidden transition-transform hover:scale-110 ${language === 'pl' ? 'ring-2 ring-yellow-500' : 'opacity-60'}`} title="Polski">
                   <svg viewBox="0 0 16 10"><rect width="16" height="10" fill="#fff"/><rect y="5" width="16" height="5" fill="#dc143c"/></svg>
                </button>
                <button onClick={() => setLanguage('de')} className={`w-6 h-4 rounded overflow-hidden transition-transform hover:scale-110 ${language === 'de' ? 'ring-2 ring-yellow-500' : 'opacity-60'}`} title="Deutsch">
                   <svg viewBox="0 0 5 3"><rect width="5" height="3" y="0" x="0" fill="#000"/><rect width="5" height="2" y="1" x="0" fill="#D00"/><rect width="5" height="1" y="2" x="0" fill="#FFCE00"/></svg>
                </button>
            </div>
        </div>
        <div className="flex flex-col">
            <p className="text-xs text-gray-400 font-medium tracking-wide">{t.poweredBy}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">2025</p>
        </div>
      </div>

      <div className="p-6 space-y-8 flex-1">
        
        {/* Reference Image Upload Section */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Upload className="w-4 h-4 text-gray-400" />
            <h3 className="text-sm font-medium text-gray-300">{t.referenceImage}</h3>
          </div>
          
          {!hasReferenceImage ? (
             <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-4 border-2 border-dashed border-gray-700 rounded-xl hover:border-gray-500 hover:bg-gray-800 transition-all flex flex-col items-center justify-center gap-2 group text-gray-500 hover:text-gray-300"
             >
                <Upload className="w-5 h-5" />
                <span className="text-xs font-medium">{t.uploadImage}</span>
             </button>
          ) : (
             <div className="relative rounded-xl overflow-hidden border border-gray-700 group">
                <img src={referenceImagePreview || ''} alt="Reference" className="w-full h-32 object-cover opacity-75 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                        onClick={clearReferenceImage} 
                        className="bg-red-500/80 hover:bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 backdrop-blur-sm transition-all transform hover:scale-105"
                    >
                        <X size={12} /> {t.remove}
                    </button>
                </div>
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/50 rounded text-[10px] text-white backdrop-blur-md">
                   {t.source}
                </div>
             </div>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/png, image/jpeg, image/webp"
            key={hasReferenceImage ? "loaded" : "empty"} // Force re-render/reset
          />
        </section>

        {/* Prompt Section */}
        <section>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-300">
              {t.promptLabel}
            </label>
            <div className="flex items-center gap-3">
                {/* AI Enhance Button */}
                <button
                    onClick={onEnhancePrompt}
                    disabled={isEnhancing || !prompt}
                    className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 disabled:opacity-50 transition-colors"
                    title={t.aiEnhance}
                >
                    <Wand2 size={12} className={isEnhancing ? "animate-spin" : ""} />
                    {isEnhancing ? t.enhancing : t.aiEnhance}
                </button>
            </div>
          </div>
          <div className="relative">
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={hasReferenceImage ? t.promptPlaceholderEdit : t.promptPlaceholder}
                className="w-full h-32 bg-gray-900 border border-gray-600 rounded-xl p-3 text-sm text-gray-200 placeholder-gray-500 focus:ring-2 focus:border-transparent focus:ring-yellow-500 outline-none resize-none transition-all"
            />
            {/* Visual indicator for AI Enhance */}
            {isEnhancing && (
                <div className="absolute inset-0 bg-gray-900/50 rounded-xl flex items-center justify-center backdrop-blur-[1px]">
                    <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
                </div>
            )}
          </div>
        </section>

        {/* Style Section */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <ImageIcon className="w-4 h-4 text-gray-400" />
            <h3 className="text-sm font-medium text-gray-300">{t.styleQuality}</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {STYLE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => setStyle(preset.id)}
                className={`text-xs py-2 px-3 rounded-lg border transition-all text-left truncate ${
                  style === preset.id
                    ? 'bg-yellow-500/10 border-yellow-500 text-yellow-400'
                    : 'bg-gray-700/50 border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                }`}
              >
                {t.styles[preset.id] || preset.label}
              </button>
            ))}
          </div>
        </section>

        {/* Aspect Ratio Section */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Layout className="w-4 h-4 text-gray-400" />
            <h3 className="text-sm font-medium text-gray-300">{t.formatRatio}</h3>
          </div>
          <div className="space-y-2">
            {ASPECT_RATIO_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setAspectRatio(opt.id)}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                  aspectRatio === opt.id
                    ? 'bg-yellow-500/10 border-yellow-500'
                    : 'bg-gray-700/50 border-gray-700 hover:bg-gray-700'
                }`}
              >
                <span className={`text-sm ${aspectRatio === opt.id ? 'text-yellow-400' : 'text-gray-300'}`}>
                  {t.ratios[opt.id] || opt.label}
                </span>
                <span className="text-xs text-gray-500">{opt.id}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Output Format */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Download className="w-4 h-4 text-gray-400" />
            <h3 className="text-sm font-medium text-gray-300">{t.outputFormat}</h3>
          </div>
          <div className="flex p-1 bg-gray-900 rounded-lg">
            <button
              onClick={() => setFormat(ImageFormat.PNG)}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                format === ImageFormat.PNG ? 'bg-gray-700 text-white shadow' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              PNG
            </button>
            <button
              onClick={() => setFormat(ImageFormat.JPEG)}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                format === ImageFormat.JPEG ? 'bg-gray-700 text-white shadow' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              JPG
            </button>
          </div>
        </section>

      </div>

      {/* Action Footer */}
      <div className="p-6 border-t border-gray-700 bg-gray-900 sticky bottom-0">
         {hasReferenceImage && (
            <button
              onClick={clearReferenceImage}
              className="w-full mb-3 py-2 text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              {t.clearRef}
            </button>
         )}
        <button
          onClick={onGenerate}
          disabled={isGenerating || !prompt}
          className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm shadow-lg transform transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
            isGenerating || !prompt
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white hover:shadow-orange-500/20 hover:from-yellow-400 hover:to-orange-500'
          }`}
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{t.generating}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>{hasReferenceImage ? t.editBtn : t.generateBtn}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
