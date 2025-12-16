
import React, { useState } from 'react';
import { GalleryItem } from '../types';
import { Image as ImageIcon, Sparkles, Edit, Layout, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface GalleryProps {
  items: GalleryItem[];
  onSelect: (item: GalleryItem) => void;
  onDelete: (id: string) => void;
  selectedId?: string;
  onMultiSelect?: (ids: string[]) => void;
  onCreateCollage?: () => void;
}

const Gallery: React.FC<GalleryProps> = ({ items, onSelect, onDelete, selectedId, onMultiSelect, onCreateCollage }) => {
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const { t } = useLanguage();

  if (items.length === 0) return null;

  const toggleSelectionMode = () => {
    if (isSelectionMode) {
        // Exit mode
        setIsSelectionMode(false);
        setSelectedItems(new Set());
        if (onMultiSelect) onMultiSelect([]);
    } else {
        // Enter mode
        setIsSelectionMode(true);
    }
  };

  const handleItemClick = (item: GalleryItem) => {
    if (isSelectionMode) {
        const newSet = new Set(selectedItems);
        if (newSet.has(item.id)) {
            newSet.delete(item.id);
        } else {
            newSet.add(item.id);
        }
        setSelectedItems(newSet);
        if (onMultiSelect) onMultiSelect(Array.from(newSet));
    } else {
        onSelect(item);
    }
  };

  return (
    <div className="h-40 bg-gray-900 border-t border-gray-700 flex flex-col">
      <div className="px-4 py-2 text-xs font-semibold text-gray-400 flex justify-between items-center bg-gray-800">
        <span className="flex items-center gap-2">
            {t.galleryHistory} ({items.length})
            {items.length > 1 && (
                <button 
                    onClick={toggleSelectionMode}
                    className={`ml-4 text-[10px] px-2 py-0.5 rounded border transition-colors ${isSelectionMode ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400' : 'border-gray-600 hover:border-gray-400 text-gray-300'}`}
                >
                    {isSelectionMode ? t.done : t.select}
                </button>
            )}
        </span>
        
        {isSelectionMode && selectedItems.size > 1 && onCreateCollage && (
            <button 
                onClick={onCreateCollage}
                className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold hover:bg-yellow-400 transition-colors flex items-center gap-1 animate-fade-in"
            >
                <Layout size={12} /> {t.createCollage} ({selectedItems.size})
            </button>
        )}
      </div>
      
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-3 flex gap-3 scrollbar-thin">
        {items.slice().reverse().map((item) => {
            const isSelectedInMode = selectedItems.has(item.id);
            
            return (
              <div 
                key={item.id} 
                className={`relative group flex-shrink-0 w-32 h-full rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                  isSelectionMode 
                    ? (isSelectedInMode ? 'border-yellow-500 opacity-100 scale-95' : 'border-gray-700 opacity-60 hover:opacity-100')
                    : (selectedId === item.id ? 'border-yellow-500 ring-2 ring-yellow-500/20' : 'border-gray-700 hover:border-gray-500')
                }`}
                onClick={() => handleItemClick(item)}
              >
                <img 
                  src={`data:${item.mimeType};base64,${item.data}`} 
                  alt={item.prompt || "Gallery Image"} 
                  className="w-full h-full object-cover"
                />
                
                {/* Selection Overlay */}
                {isSelectionMode && (
                    <div className={`absolute top-2 right-2 rounded-full bg-black/50 p-0.5 transition-transform ${isSelectedInMode ? 'text-yellow-500 scale-110' : 'text-gray-400'}`}>
                        {isSelectedInMode ? <CheckCircle2 className="w-5 h-5 fill-black" /> : <div className="w-5 h-5 rounded-full border-2 border-gray-400"></div>}
                    </div>
                )}

                {/* Type Indicator */}
                <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/60 rounded text-[10px] text-white backdrop-blur-sm flex items-center gap-1">
                  {item.type === 'generated' ? <Sparkles size={8} className="text-yellow-400" /> : 
                   item.type === 'edited' ? <Edit size={8} className="text-blue-400" /> :
                   item.type === 'collage' ? <Layout size={8} className="text-purple-400" /> :
                   <ImageIcon size={8} className="text-green-400" />}
                  <span className="capitalize">{item.type}</span>
                </div>

                {/* Hover Actions (Disabled in Selection Mode) */}
                {!isSelectionMode && (
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                       <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                        className="p-1.5 bg-red-500/80 hover:bg-red-600 rounded-full text-white transition-colors"
                        title={t.remove}
                       >
                         <Trash2 size={12} />
                       </button>
                    </div>
                )}
              </div>
            );
        })}
      </div>
    </div>
  );
};

export default Gallery;
