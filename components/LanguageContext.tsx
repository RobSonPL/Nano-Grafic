
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'pl' | 'de';

interface Translations {
  [key: string]: any;
}

const translations: Record<Language, Translations> = {
  en: {
    appTitle: "NanoGraphix",
    poweredBy: "powered by R | H",
    uploadImage: "Upload Image",
    referenceImage: "Reference Image",
    remove: "Remove",
    source: "Source",
    promptLabel: "Prompt",
    promptPlaceholder: "Describe the image you want to generate...",
    promptPlaceholderEdit: "Describe how to change the image (e.g., 'Remove background')",
    dictate: "Dictate",
    listening: "Listening...",
    aiEnhance: "AI Enhance",
    enhancing: "Enhancing...",
    styleQuality: "Style & Quality",
    formatRatio: "Format / Aspect Ratio",
    outputFormat: "Output Format",
    clearRef: "Clear Reference Image (Exit Edit Mode)",
    generateBtn: "Generate Image",
    editBtn: "Edit Image",
    generating: "Generating...",
    // Styles
    styles: {
      none: "No Style (Raw)",
      realistic: "Realistic 4K",
      anime: "Anime / Manga",
      comic: "Comic Book",
      cyberpunk: "Cyberpunk",
      watercolor: "Watercolor",
      oil_painting: "Oil Painting",
      pixel_art: "Pixel Art",
      "3d_render": "3D Render",
    },
    // Ratios
    ratios: {
      "1:1": "Square (1:1)",
      "3:4": "A4 / Portrait (3:4)",
      "4:3": "Landscape (4:3)",
      "9:16": "Vertical (9:16)",
      "16:9": "Cinematic (16:9)",
    },
    // Image Display
    refUpload: "Reference / Upload",
    generatedResult: "Generated Result",
    emptyCanvas: "Empty Canvas",
    removeBg: "Remove BG",
    upscale: "Upscale",
    adjust: "Adjust",
    download: "Download",
    processing: "Processing with AI...",
    startCreating: "Start Creating",
    startCreatingDesc: "Enter a prompt to generate a new image, or upload an image to edit it using Gemini 2.5 Flash.",
    uploadForEdit: "Upload Image for Editing",
    supportedInputs: "Supported inputs: PNG, JPG, WEBP. Output is watermark-free.",
    // Gallery
    galleryHistory: "Gallery & History",
    select: "Select",
    done: "Done",
    createCollage: "Create Collage",
    // Collage
    collageStudio: "Collage Studio",
    cancel: "Cancel",
    save: "Save",
    layout: "Layout",
    autoGrid: "Auto Grid",
    row: "Row",
    column: "Column",
    spacing: "Spacing",
    rounding: "Rounding",
    background: "Background",
    selectedImages: "Selected Images",
    // Editor
    holdCompare: "Hold to Compare",
    brightness: "Brightness",
    contrast: "Contrast",
    rotate: "Rotate",
    reset: "Reset",
  },
  pl: {
    appTitle: "NanoGraphix",
    poweredBy: "zasilane przez R | H",
    uploadImage: "Wgraj zdjęcie",
    referenceImage: "Zdjęcie referencyjne",
    remove: "Usuń",
    source: "Źródło",
    promptLabel: "Opis (Prompt)",
    promptPlaceholder: "Opisz obraz, który chcesz wygenerować...",
    promptPlaceholderEdit: "Opisz jak zmienić zdjęcie (np. 'Usuń tło')",
    dictate: "Dyktuj",
    listening: "Słucham...",
    aiEnhance: "Ulepsz AI",
    enhancing: "Ulepszanie...",
    styleQuality: "Styl i Jakość",
    formatRatio: "Format / Proporcje",
    outputFormat: "Format wyjściowy",
    clearRef: "Wyczyść zdjęcie (Wyjdź z edycji)",
    generateBtn: "Generuj Obraz",
    editBtn: "Edytuj Obraz",
    generating: "Generowanie...",
    styles: {
      none: "Brak stylu (Surowy)",
      realistic: "Realistyczny 4K",
      anime: "Anime / Manga",
      comic: "Komiks",
      cyberpunk: "Cyberpunk",
      watercolor: "Akwarela",
      oil_painting: "Obraz olejny",
      pixel_art: "Pixel Art",
      "3d_render": "Render 3D",
    },
    ratios: {
      "1:1": "Kwadrat (1:1)",
      "3:4": "A4 / Portret (3:4)",
      "4:3": "Krajobraz (4:3)",
      "9:16": "Pionowo (9:16)",
      "16:9": "Kinowy (16:9)",
    },
    refUpload: "Referencja / Upload",
    generatedResult: "Wynik Generowania",
    emptyCanvas: "Puste płótno",
    removeBg: "Usuń tło",
    upscale: "Powiększ (Upscale)",
    adjust: "Dostosuj",
    download: "Pobierz",
    processing: "Przetwarzanie przez AI...",
    startCreating: "Zacznij Tworzyć",
    startCreatingDesc: "Wpisz opis, aby wygenerować nowy obraz, lub wgraj zdjęcie, aby je edytować za pomocą Gemini 2.5 Flash.",
    uploadForEdit: "Wgraj zdjęcie do edycji",
    supportedInputs: "Obsługiwane: PNG, JPG, WEBP. Brak znaków wodnych.",
    galleryHistory: "Galeria i Historia",
    select: "Wybierz",
    done: "Gotowe",
    createCollage: "Stwórz Kolaż",
    collageStudio: "Studio Kolażu",
    cancel: "Anuluj",
    save: "Zapisz",
    layout: "Układ",
    autoGrid: "Siatka Auto",
    row: "Wiersz",
    column: "Kolumna",
    spacing: "Odstępy",
    rounding: "Zaokrąglenie",
    background: "Tło",
    selectedImages: "Wybrane zdjęcia",
    holdCompare: "Przytrzymaj by porównać",
    brightness: "Jasność",
    contrast: "Kontrast",
    rotate: "Obrót",
    reset: "Resetuj",
  },
  de: {
    appTitle: "NanoGraphix",
    poweredBy: "angetrieben von R | H",
    uploadImage: "Bild hochladen",
    referenceImage: "Referenzbild",
    remove: "Entfernen",
    source: "Quelle",
    promptLabel: "Prompt (Eingabe)",
    promptPlaceholder: "Beschreiben Sie das Bild...",
    promptPlaceholderEdit: "Beschreiben Sie die Änderungen...",
    dictate: "Diktieren",
    listening: "Zuhören...",
    aiEnhance: "KI-Verbesserung",
    enhancing: "Verbessern...",
    styleQuality: "Stil & Qualität",
    formatRatio: "Format / Seitenverhältnis",
    outputFormat: "Ausgabeformat",
    clearRef: "Referenz entfernen",
    generateBtn: "Bild generieren",
    editBtn: "Bild bearbeiten",
    generating: "Generieren...",
    styles: {
      none: "Kein Stil (Roh)",
      realistic: "Realistisch 4K",
      anime: "Anime / Manga",
      comic: "Comic",
      cyberpunk: "Cyberpunk",
      watercolor: "Aquarell",
      oil_painting: "Ölgemälde",
      pixel_art: "Pixelkunst",
      "3d_render": "3D-Render",
    },
    ratios: {
      "1:1": "Quadrat (1:1)",
      "3:4": "A4 / Porträt (3:4)",
      "4:3": "Landschaft (4:3)",
      "9:16": "Vertikal (9:16)",
      "16:9": "Kino (16:9)",
    },
    refUpload: "Referenz / Upload",
    generatedResult: "Generiertes Ergebnis",
    emptyCanvas: "Leere Leinwand",
    removeBg: "HG entfernen",
    upscale: "Vergrößern",
    adjust: "Anpassen",
    download: "Herunterladen",
    processing: "Verarbeitung mit KI...",
    startCreating: "Anfangen",
    startCreatingDesc: "Geben Sie einen Prompt ein oder laden Sie ein Bild hoch, um es mit Gemini 2.5 Flash zu bearbeiten.",
    uploadForEdit: "Bild zur Bearbeitung hochladen",
    supportedInputs: "Inputs: PNG, JPG, WEBP. Keine Wasserzeichen.",
    galleryHistory: "Galerie & Verlauf",
    select: "Auswählen",
    done: "Fertig",
    createCollage: "Collage erstellen",
    collageStudio: "Collage-Studio",
    cancel: "Abbrechen",
    save: "Speichern",
    layout: "Layout",
    autoGrid: "Auto-Raster",
    row: "Zeile",
    column: "Spalte",
    spacing: "Abstand",
    rounding: "Rundung",
    background: "Hintergrund",
    selectedImages: "Ausgewählte Bilder",
    holdCompare: "Halten zum Vergleichen",
    brightness: "Helligkeit",
    contrast: "Kontrast",
    rotate: "Drehen",
    reset: "Zurücksetzen",
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const value = {
    language,
    setLanguage,
    t: translations[language]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
