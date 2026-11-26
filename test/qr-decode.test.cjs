const { test } = require('node:test');
const assert = require('node:assert/strict');
const QRCode = require('qrcode');
const { PNG } = require('pngjs');
const jsQR = require('jsqr');

/** Same options the ticket uses (EventTicketPanel / dashboard). */
async function ticketQr(passId) {
  const value = `https://zynvo.test/verify-pass/${encodeURIComponent(passId)}`;
  const dataUrl = await QRCode.toDataURL(value, { margin: 1, width: 160 });
  const png = PNG.sync.read(Buffer.from(dataUrl.split(',')[1], 'base64'));
  return { value, png };
}

/** Paste the QR into a bigger "camera frame" (grey background), optionally scaled. */
function frameWith(png, { scale = 1, width = 640, height = 480, x = 200, y = 150 } = {}) {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = data[i + 1] = data[i + 2] = 90;
    data[i + 3] = 255;
  }
  for (let py = 0; py < png.height * scale; py++) {
    for (let px = 0; px < png.width * scale; px++) {
      const sx = Math.floor(px / scale);
      const sy = Math.floor(py / scale);
      const src = (sy * png.width + sx) * 4;
      const dst = ((y + py) * width + (x + px)) * 4;
      for (let k = 0; k < 4; k++) data[dst + k] = png.data[src + k];
    }
  }
  return { data, width, height };
}

const decode = ({ data, width, height }) =>
  jsQR(data, width, height, { inversionAttempts: 'dontInvert' });

test('decodes the ticket QR as-is', async () => {
  const { value, png } = await ticketQr('a1b2c3d4-0000-4000-8000-1234567890ab');
  const code = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
  assert.equal(code?.data, value);
});

test('decodes it inside a larger camera-style frame', async () => {
  const { value, png } = await ticketQr('PASS-42');
  assert.equal(decode(frameWith(png))?.data, value);
});

test('decodes it when shown larger (phone/laptop screen closer to the camera)', async () => {
  const { value, png } = await ticketQr('abc-123');
  assert.equal(decode(frameWith(png, { scale: 2, x: 100, y: 60 }))?.data, value);
});

test('returns nothing for a frame without a code (no false positives)', () => {
  const width = 320;
  const height = 240;
  const data = new Uint8ClampedArray(width * height * 4).fill(128);
  assert.equal(decode({ data, width, height }), null);
});
