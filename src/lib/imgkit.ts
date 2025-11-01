export function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
}

// Convert base64 data URL to blob without using fetch
function base64ToBlob(base64: string): Blob {
  const parts = base64.split(',');
  const contentType = parts[0].match(/:(.*?);/)?.[1] || 'image/png';
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
}

export async function uploadImageToImageKit(
  file: string,
  fileName: string
): Promise<string> {
  try {
    console.log('Starting image upload process...');
    
    // Convert base64 to blob without using fetch (CSP-friendly)
    const blob = base64ToBlob(file);
    console.log('Converted to blob, size:', blob.size);
    
    // Create form data for upload
    const formData = new FormData();
    formData.append('image', blob, fileName);
    
    // Try backend first, then fallback to local API
    const uploadUrls = [
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/upload/image`,
      '/api/upload/image'
    ];
    
    for (const url of uploadUrls) {
      try {
        console.log(`Trying upload to: ${url}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
        
        const uploadResponse = await fetch(url, {
          method: 'POST',
          body: formData,
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);

        console.log(`Upload response status for ${url}:`, uploadResponse.status);

        if (uploadResponse.ok) {
          const result = await uploadResponse.json();
          console.log('Upload successful:', result);
          
          const imageUrl = result.url || result.imageUrl;
          if (imageUrl) {
            return imageUrl;
          }
        } else {
          const errorText = await uploadResponse.text();
          console.error(`Upload failed for ${url}:`, errorText);
        }
      } catch (error) {
        console.error(`Error with ${url}:`, error);
        // Continue to next URL
      }
    }
    
    throw new Error('All upload methods failed');
  } catch (error: any) {
    console.error('Image upload failed:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
}

// Direct file upload without base64 conversion
export async function uploadImageDirectly(file: File): Promise<string> {
  try {
    console.log('Starting direct image upload for:', file.name, 'Size:', file.size);
    
    // Create form data directly from file
    const formData = new FormData();
    formData.append('image', file, file.name);
    
    // Try backend first, then fallback to local API
    const uploadUrls = [
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/upload/image`,
      '/api/upload/image'
    ];
    
    for (const url of uploadUrls) {
      try {
        console.log(`Trying upload to: ${url}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
        
        const uploadResponse = await fetch(url, {
          method: 'POST',
          body: formData,
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);

        console.log(`Upload response status for ${url}:`, uploadResponse.status);

        if (uploadResponse.ok) {
          const result = await uploadResponse.json();
          console.log('Upload successful:', result);
          
          const imageUrl = result.url || result.imageUrl;
          if (imageUrl) {
            return imageUrl;
          }
        } else {
          const errorText = await uploadResponse.text();
          console.error(`Upload failed for ${url}:`, errorText);
        }
      } catch (error) {
        console.error(`Error with ${url}:`, error);
        // Continue to next URL
      }
    }
    
    throw new Error('All upload methods failed');
  } catch (error: any) {
    console.error('Direct image upload failed:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
}

// Client-side compressor to keep images under 2 MB
export async function compressImageToUnder2MB(originalFile: File): Promise<File> {
  const MAX_BYTES = 2 * 1024 * 1024; // 2 MB
  const MAX_DIMENSION = 1920;

  try {
    const dataUrl = await toBase64(originalFile);

    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const imageEl = new Image();
      imageEl.onload = () => resolve(imageEl);
      imageEl.onerror = reject as any;
      imageEl.src = dataUrl;
    });

    let targetWidth = img.width;
    let targetHeight = img.height;
    if (Math.max(img.width, img.height) > MAX_DIMENSION) {
      if (img.width >= img.height) {
        targetWidth = MAX_DIMENSION;
        targetHeight = Math.round((img.height / img.width) * targetWidth);
      } else {
        targetHeight = MAX_DIMENSION;
        targetWidth = Math.round((img.width / img.height) * targetHeight);
      }
    }

    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, targetWidth);
    canvas.height = Math.max(1, targetHeight);
    const ctx = canvas.getContext('2d');
    if (!ctx) return originalFile;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    let quality = 0.9;
    let blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
    while (blob && blob.size > MAX_BYTES && quality > 0.4) {
      quality -= 0.1;
      blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
    }

    if (!blob) return originalFile;

    if (blob.size > MAX_BYTES) {
      const scale = Math.min(1280 / canvas.width, 1280 / canvas.height, 1);
      if (scale < 1) {
        const tmp = document.createElement('canvas');
        tmp.width = Math.max(1, Math.round(canvas.width * scale));
        tmp.height = Math.max(1, Math.round(canvas.height * scale));
        const tctx = tmp.getContext('2d');
        if (tctx) {
          tctx.drawImage(canvas, 0, 0, tmp.width, tmp.height);
          quality = Math.max(quality, 0.6);
          blob = await new Promise((resolve) => tmp.toBlob(resolve, 'image/jpeg', quality));
        }
      }
    }

    if (!blob || blob.size > MAX_BYTES) {
      return originalFile;
    }

    return new File([blob], originalFile.name.replace(/\.[^.]+$/, '.jpg'), {
      type: 'image/jpeg',
      lastModified: Date.now(),
    });
  } catch {
    return originalFile;
  }
}