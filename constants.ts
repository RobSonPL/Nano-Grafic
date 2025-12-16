
import { AspectRatio, VideoStyle } from "./types";

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

export const VIDEO_STYLE_PRESETS: VideoStyle[] = [
  {
    id: "cinematic_slow_motion",
    title: "Cinematic Slow-Motion",
    description: "Dramatic, slowed-down movement with high motion blur.",
    modifier: "cinematic slow-motion, high frame rate, motion blur, dramatic lighting",
    iconColor: "text-blue-400"
  },
  {
    id: "action_replay",
    title: "Action Replay",
    description: "High-intensity action focused with dynamic camera angles.",
    modifier: "action replay style, dynamic camera, intense movement, freeze frame effect",
    iconColor: "text-red-500"
  },
  {
    id: "dreamy_timelapse",
    title: "Dreamy Timelapse",
    description: "Fast-forwarded time with soft, ethereal transitions.",
    modifier: "dreamy timelapse, long exposure, ethereal lighting, soft transitions, flowing movement",
    iconColor: "text-purple-400"
  },
  {
    id: "lo_fi_glitch",
    title: "Lo-fi Glitch",
    description: "Retro aesthetic with digital artifacts and distortion.",
    modifier: "lo-fi glitch art, vhs static, digital distortion, retro aesthetic, chromatic aberration",
    iconColor: "text-yellow-400"
  },
  {
    id: "vfx_showcase",
    title: "VFX Showcase",
    description: "High-end visual effects with particle systems and magical elements.",
    modifier: "vfx showcase, particle systems, magical effects, glowing elements, cgi render, 8k",
    iconColor: "text-emerald-400"
  }
];

export const ASPECT_RATIO_OPTIONS = [
  { id: AspectRatio.SQUARE, label: "Square (1:1)", desc: "Instagram Post" },
  { id: AspectRatio.PORTRAIT, label: "A4 / Portrait (3:4)", desc: "Posters, Prints" },
  { id: AspectRatio.LANDSCAPE, label: "Landscape (4:3)", desc: "Facebook Post" },
  { id: AspectRatio.MOBILE_VERTICAL, label: "Vertical (9:16)", desc: "TikTok, Reels, Stories" },
  { id: AspectRatio.CINEMATIC, label: "Cinematic (16:9)", desc: "Youtube, Desktop" },
];

export const PLACEHOLDER_IMAGE = "https://picsum.photos/800/600";
