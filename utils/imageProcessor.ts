export interface ImageSettings {
  brightness: number; // -100 to 100
  contrast: number;   // -100 to 100
  rotation: number;   // degrees 0, 90, 180, 270
}

export const processImage = (
  base64Data: string,
  settings: ImageSettings,
  mimeType: string = 'image/png'
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Handle rotation dimensions
      // If 90 or 270 degrees, swap width and height
      const isVertical = settings.rotation % 180 !== 0;
      canvas.width = isVertical ? img.height : img.width;
      canvas.height = isVertical ? img.width : img.height;

      // Apply Filters
      // brightness(100%) is default. Mapping -100..100 to 0%..200%
      const b = settings.brightness + 100;
      const c = settings.contrast + 100;
      ctx.filter = `brightness(${b}%) contrast(${c}%)`;

      // Move context to center for rotation
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((settings.rotation * Math.PI) / 180);
      
      // Draw image centered
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      resolve(canvas.toDataURL(mimeType));
    };
    img.onerror = (e) => reject(e);
    
    // Ensure data URI prefix
    const src = base64Data.startsWith('data:') ? base64Data : `data:${mimeType};base64,${base64Data}`;
    img.src = src;
  });
};
