/**
 * Helper utility for client-side image compression, format normalization,
 * and robust file validation (works seamlessly across mobile Safari, Android, and desktop).
 */

export interface ProcessedImage {
  dataUrl: string;
  cleanBase64: string;
  mimeType: string;
  width: number;
  height: number;
  fileSizeKB: number;
}

/**
 * Checks if a file is an acceptable image (checks MIME type and file extension fallback)
 * Ultra-permissive so no mobile photo or screenshot gets rejected with "milena" errors.
 */
export function isValidImageFile(file: File): boolean {
  if (!file) return false;
  const name = (file.name || '').toLowerCase();
  const type = (file.type || '').toLowerCase();

  // Exclude explicitly non-image types
  if (type.startsWith('video/') || type.startsWith('audio/')) return false;
  if (/\.(mp4|mov|avi|mkv|webm|mp3|wav|m4a|ogg|aac|zip|rar|exe|apk|pdf|doc|docx)$/i.test(name)) {
    return false;
  }

  // Allow all standard image types
  if (type.startsWith('image/')) return true;

  // Mobile camera / screenshot / WhatsApp photos often have empty type or application/octet-stream
  if (!type || type === 'application/octet-stream') {
    return file.size > 0 && file.size < 60 * 1024 * 1024;
  }

  const ext = name.split('.').pop()?.toLowerCase();
  if (ext && ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'heic', 'heif', 'svg', 'jfif', 'tiff', 'dng', 'raw'].includes(ext)) {
    return true;
  }

  // Any non-empty reasonable file is permitted to be decoded
  return file.size > 0 && file.size < 60 * 1024 * 1024;
}

/**
 * Resizes and compresses an image client-side to ensure lightning-fast upload
 * and flawless AI Vision OCR scanning without huge payload errors.
 */
export async function optimizeImageForAnalysis(
  file: File,
  maxDimension = 1600,
  quality = 0.88
): Promise<ProcessedImage> {
  return new Promise((resolve, reject) => {
    // If it's an SVG, load as text/dataURL directly
    if (file.type === 'image/svg+xml' || file.name.endsWith('.svg')) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const commaIdx = dataUrl.indexOf(',');
        const cleanBase64 = commaIdx !== -1 ? dataUrl.slice(commaIdx + 1) : dataUrl;
        resolve({
          dataUrl,
          cleanBase64,
          mimeType: 'image/svg+xml',
          width: 800,
          height: 600,
          fileSizeKB: Math.round(file.size / 1024),
        });
      };
      reader.onerror = () => reject(new Error('SVG पढ्न सकिएन (Failed to read SVG)'));
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('तस्बिर पढ्न सकिएन (Failed to read image file)'));

    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => {
        // If Image element cannot decode (e.g. raw HEIC on unsupported browser), return raw base64 safely
        const rawUrl = (e.target?.result as string) || '';
        const commaIdx = rawUrl.indexOf(',');
        resolve({
          dataUrl: rawUrl,
          cleanBase64: commaIdx !== -1 ? rawUrl.slice(commaIdx + 1) : rawUrl,
          mimeType: file.type || 'image/jpeg',
          width: 1200,
          height: 800,
          fileSizeKB: Math.round(file.size / 1024),
        });
      };

      img.onload = () => {
        let width = img.naturalWidth || img.width || 1200;
        let height = img.naturalHeight || img.height || 800;

        // Downscale if larger than maxDimension
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          const rawUrl = (e.target?.result as string) || '';
          const commaIdx = rawUrl.indexOf(',');
          resolve({
            dataUrl: rawUrl,
            cleanBase64: commaIdx !== -1 ? rawUrl.slice(commaIdx + 1) : rawUrl,
            mimeType: 'image/jpeg',
            width,
            height,
            fileSizeKB: Math.round(file.size / 1024),
          });
          return;
        }

        // Fill white background in case of transparent PNG/WebP
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const mimeType = 'image/jpeg';
        const compressedDataUrl = canvas.toDataURL(mimeType, quality);
        const commaIdx = compressedDataUrl.indexOf(',');
        const cleanBase64 = commaIdx !== -1 ? compressedDataUrl.slice(commaIdx + 1) : compressedDataUrl;

        resolve({
          dataUrl: compressedDataUrl,
          cleanBase64,
          mimeType,
          width,
          height,
          fileSizeKB: Math.round((cleanBase64.length * 3) / 4 / 1024),
        });
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}
