
export enum AspectRatio {
  SQUARE = "1:1",
  PORTRAIT = "3:4",
  LANDSCAPE = "4:3",
  MOBILE_VERTICAL = "9:16",
  CINEMATIC = "16:9",
}

export enum ImageFormat {
  PNG = "image/png",
  JPEG = "image/jpeg",
}

export enum CollageLayout {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical',
  GRID = 'grid'
}

export interface GenerationConfig {
  prompt: string;
  style: string;
  aspectRatio: AspectRatio;
  format: ImageFormat;
  referenceImage?: string; // Base64
  referenceMimeType?: string;
}

export interface GeneratedImage {
  id: string;
  data: string; // Base64
  mimeType: string;
  prompt: string;
  timestamp: number;
}

export interface GalleryItem {
  id: string;
  data: string;
  mimeType: string;
  type: 'generated' | 'uploaded' | 'edited' | 'collage';
  timestamp: number;
  prompt?: string;
}

export interface VideoStyle {
  id: string;
  title: string;
  description: string;
  modifier: string;
  iconColor: string;
}
