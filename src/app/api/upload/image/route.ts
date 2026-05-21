import { NextRequest, NextResponse } from 'next/server';
import ImageKit from 'imagekit';

function getImageKitClient() {
  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

  if (!publicKey || !privateKey || !urlEndpoint) {
    throw new Error('ImageKit environment variables are not configured');
  }

  // SECURITY: Private keys should NEVER use NEXT_PUBLIC_ prefix as they get exposed to the browser
  return new ImageKit({
    publicKey,
    privateKey,
    urlEndpoint,
  });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const folder = (formData.get('folder') as string) || '/posts'; // Default to posts folder
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.log('Received file:', file.name, 'Size:', file.size, 'Folder:', folder);

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to ImageKit with specified folder
    const uploadResponse = await getImageKitClient().upload({
      file: buffer,
      fileName: file.name,
      folder: folder, // Organize uploads in folders (posts, events, clubs)
    });

    console.log('ImageKit upload successful:', uploadResponse.url);

    return NextResponse.json({
      url: uploadResponse.url,
      fileId: uploadResponse.fileId,
    });
  } catch (error: any) {
    console.error('Upload failed:', error);
    return NextResponse.json(
      { error: `Upload failed: ${error.message}` },
      { status: 500 }
    );
  }
}
