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
        
        const uploadResponse = await fetch(url, {
          method: 'POST',
          body: formData,
        });

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
        
        const uploadResponse = await fetch(url, {
          method: 'POST',
          body: formData,
        });

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
