
import { CollageLayout } from "../types";

export interface CollageSettings {
  layout: CollageLayout;
  spacing: number;
  backgroundColor: string; // hex or 'transparent'
  borderRadius: number;
}

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // Handle cross-origin if needed
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error(`Failed to load image: ${e}`));
    img.src = src;
  });
};

export const createCollage = async (
  imagesBase64: string[],
  settings: CollageSettings
): Promise<string> => {
  // Validate input
  if (!imagesBase64 || imagesBase64.length === 0) throw new Error("No images selected");

  // Normalize data URIs
  const normalizedImages = imagesBase64.map(b64 => 
    b64.startsWith('data:') ? b64 : `data:image/png;base64,${b64}`
  );

  const images = await Promise.all(normalizedImages.map(loadImage));

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error("Canvas context not available");

  const { layout, spacing, backgroundColor, borderRadius } = settings;

  const BASE_SIZE = 1200; // Fixed canvas size for consistency
  const count = images.length;
  let finalWidth = BASE_SIZE;
  let finalHeight = BASE_SIZE;
  
  const placements: { img: HTMLImageElement; x: number; y: number; w: number; h: number, sx?: number, sy?: number, sw?: number, sh?: number }[] = [];

  // --- LAYOUT LOGIC ---

  if (layout === CollageLayout.HORIZONTAL) {
    // Determine heights and scale widths accordingly
    const targetHeight = 600; 
    let currentX = spacing;
    
    images.forEach(img => {
        const scale = targetHeight / img.height;
        const targetWidth = img.width * scale;
        
        placements.push({
            img,
            x: currentX,
            y: spacing,
            w: targetWidth,
            h: targetHeight
        });
        
        currentX += targetWidth + spacing;
    });
    
    finalWidth = currentX;
    finalHeight = targetHeight + (spacing * 2);

  } else if (layout === CollageLayout.VERTICAL) {
    // Fixed width, stack vertically
    const targetWidth = 800;
    let currentY = spacing;
    
    images.forEach(img => {
        const scale = targetWidth / img.width;
        const targetHeight = img.height * scale;
        
        placements.push({
            img,
            x: spacing,
            y: currentY,
            w: targetWidth,
            h: targetHeight
        });
        
        currentY += targetHeight + spacing;
    });
    
    finalWidth = targetWidth + (spacing * 2);
    finalHeight = currentY;

  } else if (layout === CollageLayout.GRID) {
    // SMART GRID LOGIC
    finalWidth = BASE_SIZE;
    finalHeight = BASE_SIZE;

    if (count === 1) {
      // 1 Image: Full fill
      addGridPlacement(placements, images[0], spacing, spacing, BASE_SIZE - 2*spacing, BASE_SIZE - 2*spacing);
    } 
    else if (count === 2) {
      // 2 Images: Split Vertically (Side by Side)
      const w = (BASE_SIZE - 3 * spacing) / 2;
      const h = BASE_SIZE - 2 * spacing;
      addGridPlacement(placements, images[0], spacing, spacing, w, h);
      addGridPlacement(placements, images[1], spacing * 2 + w, spacing, w, h);
    }
    else if (count === 3) {
      // 3 Images: 1 Left (Big), 2 Right (Small stacked)
      const col1W = (BASE_SIZE - 3 * spacing) * 0.6; // 60% width
      const col2W = (BASE_SIZE - 3 * spacing) * 0.4; // 40% width
      const col2H = (BASE_SIZE - 3 * spacing) / 2;

      // Big Left
      addGridPlacement(placements, images[0], spacing, spacing, col1W, BASE_SIZE - 2*spacing);
      
      // Top Right
      addGridPlacement(placements, images[1], spacing * 2 + col1W, spacing, col2W, col2H);
      // Bottom Right
      addGridPlacement(placements, images[2], spacing * 2 + col1W, spacing * 2 + col2H, col2W, col2H);
    }
    else {
      // 4+ Images: Standard 2x2 Grid (Limit to 4 for best results in this mode, or just crop others)
      // If user selected more than 4, we only show first 4 in grid 2x2 for now
      const w = (BASE_SIZE - 3 * spacing) / 2;
      const h = (BASE_SIZE - 3 * spacing) / 2;

      addGridPlacement(placements, images[0], spacing, spacing, w, h);
      addGridPlacement(placements, images[1], spacing * 2 + w, spacing, w, h);
      addGridPlacement(placements, images[2], spacing, spacing * 2 + h, w, h);
      addGridPlacement(placements, images[3] || images[0], spacing * 2 + w, spacing * 2 + h, w, h);
    }
  }

  // --- DRAWING ---

  canvas.width = finalWidth;
  canvas.height = finalHeight;

  if (backgroundColor === 'transparent') {
    ctx.clearRect(0, 0, finalWidth, finalHeight);
  } else {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, finalWidth, finalHeight);
  }

  placements.forEach(p => {
    ctx.save();
    
    // Border Radius Clipping
    if (borderRadius > 0) {
        ctx.beginPath();
        // Fallback for roundRect if not supported in all envs (though modern browsers have it)
        if (ctx.roundRect) {
            ctx.roundRect(p.x, p.y, p.w, p.h, borderRadius);
        } else {
             ctx.rect(p.x, p.y, p.w, p.h);
        }
        ctx.clip();
    }

    if (p.sx !== undefined) {
        ctx.drawImage(p.img, p.sx!, p.sy!, p.sw!, p.sh!, p.x, p.y, p.w, p.h);
    } else {
        ctx.drawImage(p.img, p.x, p.y, p.w, p.h);
    }
    
    ctx.restore();
  });

  return canvas.toDataURL('image/png');
};

// Helper for Center Cropping in Grid
function addGridPlacement(placements: any[], img: HTMLImageElement, x: number, y: number, targetW: number, targetH: number) {
    const imgRatio = img.width / img.height;
    const targetRatio = targetW / targetH;
    
    let sw, sh, sx, sy;
    
    if (imgRatio > targetRatio) {
        // Image is wider than slot -> Crop width
        sh = img.height;
        sw = img.height * targetRatio;
        sy = 0;
        sx = (img.width - sw) / 2;
    } else {
        // Image is taller than slot -> Crop height
        sw = img.width;
        sh = img.width / targetRatio;
        sx = 0;
        sy = (img.height - sh) / 2;
    }

    placements.push({
        img,
        x, y, w: targetW, h: targetH,
        sx, sy, sw, sh
    });
}
