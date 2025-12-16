import { AspectRatio } from "./types";

export const STYLE_PRESETS = [
  { id: "none", label: "No Style (Raw)" },
  { id: "realistic", label: "Realistic 4K" },
  { id: "anime", label: "Anime / Manga" },
  { id: "comic", label: "Comic Book" },
  { id: "cyberpunk", label: "Cyberpunk" },
  { id: "watercolor", label: "Watercolor" },
  { id: "oil_painting", label: "Oil Painting" },
  { id: "pixel_art", label: "Pixel Art" },
  { id: "3d_render", label: "3D Render" },
];

export const ASPECT_RATIO_OPTIONS = [
  { id: AspectRatio.SQUARE, label: "Square (1:1)", desc: "Instagram Post" },
  { id: AspectRatio.PORTRAIT, label: "A4 / Portrait (3:4)", desc: "Posters, Prints" },
  { id: AspectRatio.LANDSCAPE, label: "Landscape (4:3)", desc: "Facebook Post" },
  { id: AspectRatio.MOBILE_VERTICAL, label: "Vertical (9:16)", desc: "TikTok, Reels, Stories" },
  { id: AspectRatio.CINEMATIC, label: "Cinematic (16:9)", desc: "Youtube, Desktop" },
];

export const PLACEHOLDER_IMAGE = "https://picsum.photos/800/600";
