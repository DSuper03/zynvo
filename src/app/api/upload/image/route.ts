import { NextRequest, NextResponse } from 'next/server';
import ImageKit from 'imagekit';
import { createErrorId } from '@/lib/safe-error';
import { resolveRequestId } from '@/lib/server/request';
import { applySecurityHeaders } from '@/lib/server/headers';

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
  const errorId = createErrorId();
  const requestId = resolveRequestId(request.headers.get('x-request-id'));

  const secureHeaders = new Headers();
  secureHeaders.set('x-request-id', requestId);
  applySecurityHeaders(secureHeaders);

  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const folder = (formData.get('folder') as string) || '/posts';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400, headers: secureHeaders }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResponse = await getImageKitClient().upload({
      file: buffer,
      fileName: file.name,
      folder,
    });

    return NextResponse.json(
      { url: uploadResponse.url, fileId: uploadResponse.fileId },
      { headers: secureHeaders }
    );
  } catch (error) {
    console.error(`[${errorId}] Upload failed:`, error);
    return NextResponse.json(
      { error: 'Upload failed. Please try again later.', errorId },
      { status: 500, headers: secureHeaders }
    );
  }
}
