import { GalleryItem } from "../types";
import { ImageSettings } from "./imageProcessor";

const GALLERY_KEY = "nanoGraphix_gallery";
const EDITOR_SETTINGS_KEY = "nanoGraphix_editorSettings";

// Gallery Storage
export const saveGallery = (items: GalleryItem[]) => {
  try {
    localStorage.setItem(GALLERY_KEY, JSON.stringify(items));
  } catch (e) {
    if (e instanceof DOMException && e.name === "QuotaExceededError") {
      console.warn("Storage quota exceeded. Trimming gallery history to last 5 items.");
      // Keep only the last 5 items to save space
      const trimmed = items.slice(-5); 
      try {
        localStorage.setItem(GALLERY_KEY, JSON.stringify(trimmed));
      } catch (retryError) {
        console.error("Could not save gallery even after trimming.", retryError);
      }
    } else {
      console.error("Failed to save gallery", e);
    }
  }
};

export const loadGallery = (): GalleryItem[] => {
  try {
    const stored = localStorage.getItem(GALLERY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to load gallery", e);
    return [];
  }
};

// Editor Settings Storage
export const saveEditorSettings = (settings: ImageSettings) => {
  try {
    localStorage.setItem(EDITOR_SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error("Failed to save editor settings", e);
  }
};

export const loadEditorSettings = (): ImageSettings | null => {
  try {
    const stored = localStorage.getItem(EDITOR_SETTINGS_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const clearEditorSettings = () => {
  try {
    localStorage.removeItem(EDITOR_SETTINGS_KEY);
  } catch (e) {
    console.error(e);
  }
};
