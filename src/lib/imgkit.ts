import ImageKit from "imagekit";
import fs from "fs";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT as string,
});

export function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
}


export async function uploadImageToImageKit(file: string, fileName: string): Promise<string> {
  try {
    const uploadResponse = await imagekit.upload({
      file, 
      fileName,
    });

    return uploadResponse.url; 
  } catch (error: any) {
    console.error("ImageKit upload failed:", error.message);
    throw new Error("Failed to upload image");
  }
}
