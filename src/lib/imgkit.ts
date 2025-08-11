import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT as string,
});

/**
 * Uploads an image to ImageKit and returns the uploaded file URL.
 * @param file Base64 string OR file URL
 * @param fileName Name for the uploaded file
 */
export async function uploadImageToImageKit(file: string, fileName: string): Promise<string> {
  try {
    const uploadResponse = await imagekit.upload({
      file, // base64 string or image URL
      fileName,
    });

    return uploadResponse.url; // Direct URL to the uploaded image
  } catch (error: any) {
    console.error("ImageKit upload failed:", error.message);
    throw new Error("Failed to upload image");
  }
}
