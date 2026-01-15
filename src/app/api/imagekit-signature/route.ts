import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { fileName } = await request.json();

    if (!fileName) {
      return NextResponse.json({ error: 'fileName is required' }, { status: 400 });
    }

    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const expire = Date.now() + 600000; // 10 minutes from now

    if (!privateKey) {
      return NextResponse.json({ error: 'ImageKit private key not configured' }, { status: 500 });
    }

    // SECURITY: Private keys should NEVER use NEXT_PUBLIC_ prefix as they get exposed to the browser

    // Create signature for ImageKit upload - correct format
    const expire_seconds = Math.floor(expire / 1000);
    const stringToSign = `expire=${expire_seconds}`;
    const signature = crypto
      .createHmac('sha1', privateKey)
      .update(stringToSign)
      .digest('hex');

    return NextResponse.json({
      signature,
      expire: expire_seconds,
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
    });
  } catch (error) {
    console.error('Error generating ImageKit signature:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}