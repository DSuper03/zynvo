import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createErrorId } from '@/lib/safe-error';

export async function POST(request: NextRequest) {
  const errorId = createErrorId();
  try {
    const { fileName } = await request.json();

    if (!fileName) {
      return NextResponse.json({ error: 'fileName is required' }, { status: 400 });
    }

    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const expire = Date.now() + 600000; // 10 minutes from now

    if (!privateKey) {
      console.error(`[${errorId}] ImageKit private key not configured`);
      return NextResponse.json(
        { error: 'Unable to generate upload signature right now.', errorId },
        { status: 500 }
      );
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
    console.error(`[${errorId}] Error generating ImageKit signature:`, error);
    return NextResponse.json(
      { error: 'Unable to generate upload signature right now.', errorId },
      { status: 500 }
    );
  }
}
