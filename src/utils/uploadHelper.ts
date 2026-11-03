/**
 * Direct file upload helper for images and videos with automatic metadata detection
 * (dimensions, aspect ratio, duration, and canvas thumbnail extraction).
 */

export interface UploadResult {
  success: boolean;
  url: string;
  fileName: string;
  size: number;
  mimeType: string;
}

export interface VideoMetadata {
  durationFormatted: string;
  durationFormattedNe: string;
  durationSeconds: number;
  width: number;
  height: number;
  aspectRatio: string; // e.g. '16/9', '9/16', '1/1', '4/3', '21/9'
  aspectRatioLabel: string; // e.g. '9:16 ठाडो (Vertical Reel)', '16:9 फराकिलो (Widescreen)'
  thumbnailDataUrl?: string;
}

/**
 * Upload a local file (image or video) directly to the server
 */
export async function uploadFileToServer(file: File): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error('फाइल पढ्न असफल भयो (Failed to read file)'));
    };

    reader.onload = async () => {
      try {
        const fileData = reader.result as string;
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileName: file.name,
            fileData,
            mimeType: file.type,
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Upload failed (${response.status}): ${errText}`);
        }

        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error || 'Upload error');
        }

        resolve(data);
      } catch (err) {
        reject(err);
      }
    };

    reader.readAsDataURL(file);
  });
}

function toNepaliDigits(str: string): string {
  const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return str.replace(/[0-9]/g, (d) => nepaliDigits[parseInt(d, 10)]);
}

function formatDuration(seconds: number): { en: string; ne: string } {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const formattedEn = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  const formattedNe = toNepaliDigits(formattedEn);
  return { en: formattedEn, ne: formattedNe };
}

/**
 * Extracts width, height, aspect ratio, duration, and thumbnail from a video file
 */
export function extractVideoMetadata(file: File): Promise<VideoMetadata> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;

    const objectUrl = URL.createObjectURL(file);
    video.src = objectUrl;

    video.onloadedmetadata = () => {
      const width = video.videoWidth || 1280;
      const height = video.videoHeight || 720;
      const durationSeconds = video.duration || 0;
      const duration = formatDuration(durationSeconds);

      // Determine aspect ratio
      const rawRatio = width / height;
      let aspectRatio = `${width}/${height}`;
      let aspectRatioLabel = `${width}x${height}`;

      if (Math.abs(rawRatio - 16 / 9) < 0.08) {
        aspectRatio = '16/9';
        aspectRatioLabel = '16:9 Widescreen (फराकिलो)';
      } else if (Math.abs(rawRatio - 9 / 16) < 0.08) {
        aspectRatio = '9/16';
        aspectRatioLabel = '9:16 Vertical Reel (ठाडो)';
      } else if (Math.abs(rawRatio - 1) < 0.08) {
        aspectRatio = '1/1';
        aspectRatioLabel = '1:1 Square (चारपाटे)';
      } else if (Math.abs(rawRatio - 4 / 3) < 0.08) {
        aspectRatio = '4/3';
        aspectRatioLabel = '4:3 Standard (क्लासिक)';
      } else if (Math.abs(rawRatio - 3 / 4) < 0.08) {
        aspectRatio = '3/4';
        aspectRatioLabel = '3:4 Portrait (ठाडो)';
      } else if (rawRatio < 0.8) {
        aspectRatio = `${width}/${height}`;
        aspectRatioLabel = `ठाडो भिडियो (${width}x${height})`;
      } else {
        aspectRatio = `${width}/${height}`;
        aspectRatioLabel = `तेर्सो भिडियो (${width}x${height})`;
      }

      // Seek slightly to capture a non-black thumbnail
      video.currentTime = Math.min(1.0, durationSeconds / 2);

      video.onseeked = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = Math.min(width, 640);
          canvas.height = Math.round(canvas.width / (width / height));
          const ctx = canvas.getContext('2d');
          let thumbnailDataUrl: string | undefined = undefined;
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            thumbnailDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          }
          URL.revokeObjectURL(objectUrl);
          resolve({
            durationFormatted: duration.en,
            durationFormattedNe: duration.ne,
            durationSeconds,
            width,
            height,
            aspectRatio,
            aspectRatioLabel,
            thumbnailDataUrl,
          });
        } catch {
          URL.revokeObjectURL(objectUrl);
          resolve({
            durationFormatted: duration.en,
            durationFormattedNe: duration.ne,
            durationSeconds,
            width,
            height,
            aspectRatio,
            aspectRatioLabel,
          });
        }
      };

      // Fallback if seek doesn't trigger
      setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
        resolve({
          durationFormatted: duration.en,
          durationFormattedNe: duration.ne,
          durationSeconds,
          width,
          height,
          aspectRatio,
          aspectRatioLabel,
        });
      }, 1500);
    };

    video.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('भिडियो फाइल लोड हुन सकेन (Failed to decode video metadata)'));
    };
  });
}
