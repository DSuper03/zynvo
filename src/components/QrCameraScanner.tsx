'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { CameraOff, Loader2 } from 'lucide-react';

interface QrCameraScannerProps {
  /** Called with the decoded text, possibly many times for one code held up. */
  onScan: (text: string) => void;
  /** Stop decoding (the camera keeps running). */
  paused?: boolean;
}

/** Decode at most this often and at most this wide: plenty for a phone screen QR. */
const SCAN_INTERVAL_MS = 120;
const MAX_FRAME_WIDTH = 720;

function cameraErrorMessage(err: unknown): string {
  const name = (err as { name?: string })?.name;
  if (name === 'NotAllowedError' || name === 'SecurityError') {
    return 'Camera access is blocked. Allow the camera for this site in your browser’s address bar, then press Try again.';
  }
  if (name === 'NotFoundError' || name === 'OverconstrainedError') {
    return 'No camera was found on this device.';
  }
  if (name === 'NotReadableError') {
    return 'The camera is being used by another app. Close it and press Try again.';
  }
  return 'Could not start the camera.';
}

/**
 * Laptop/desktop QR scanner using the webcam. Decoding is done in the browser
 * (jsQR), so it works in every modern browser and no image leaves the device.
 */
export default function QrCameraScanner({ onScan, paused = false }: QrCameraScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const onScanRef = useRef(onScan);
  const pausedRef = useRef(paused);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [deviceId, setDeviceId] = useState<string>('');
  const [starting, setStarting] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  // Start (or switch) the camera.
  useEffect(() => {
    let cancelled = false;

    async function start() {
      setStarting(true);
      setError(null);
      stopStream();

      if (!navigator.mediaDevices?.getUserMedia) {
        setError(
          'This browser can’t use the camera here. Open the page over https in an up-to-date browser.'
        );
        setStarting(false);
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: deviceId
            ? { deviceId: { exact: deviceId }, width: { ideal: 1280 } }
            : { facingMode: 'environment', width: { ideal: 1280 } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          await video.play().catch(() => undefined);
        }
        // Labels are only available after permission was granted.
        const all = await navigator.mediaDevices.enumerateDevices();
        if (cancelled) return;
        setDevices(all.filter((d) => d.kind === 'videoinput'));
        const active = stream.getVideoTracks()[0]?.getSettings().deviceId;
        if (active && !deviceId) setDeviceId(active);
      } catch (err) {
        if (!cancelled) setError(cameraErrorMessage(err));
      } finally {
        if (!cancelled) setStarting(false);
      }
    }

    start();
    return () => {
      cancelled = true;
      stopStream();
    };
    // `attempt` re-runs this after "Try again"; deviceId switches camera.
  }, [deviceId, attempt, stopStream]);

  // Decode frames while the camera is running.
  useEffect(() => {
    if (error) return;
    let raf = 0;
    let last = 0;

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (pausedRef.current || now - last < SCAN_INTERVAL_MS) return;
      last = now;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState < video.HAVE_ENOUGH_DATA) return;
      const vw = video.videoWidth;
      const vh = video.videoHeight;
      if (!vw || !vh) return;

      const scale = Math.min(1, MAX_FRAME_WIDTH / vw);
      const w = Math.round(vw * scale);
      const h = Math.round(vh * scale);
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(video, 0, 0, w, h);
      const frame = ctx.getImageData(0, 0, w, h);
      const code = jsQR(frame.data, w, h, { inversionAttempts: 'dontInvert' });
      if (code?.data) onScanRef.current(code.data);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [error]);

  return (
    <div className="space-y-3">
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-gray-800 bg-black">
        <video
          ref={videoRef}
          muted
          playsInline
          aria-label="Camera preview"
          className="h-full w-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" aria-hidden />

        {!error && !starting && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <div
              className={`h-1/2 aspect-square rounded-2xl border-2 ${paused ? 'border-gray-500' : 'border-yellow-400'} shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]`}
            />
          </div>
        )}

        {starting && !error && (
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/70 text-sm text-yellow-200">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Starting camera…
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/90 p-6 text-center"
          >
            <CameraOff className="h-8 w-8 text-red-400" aria-hidden />
            <p className="max-w-sm text-sm text-gray-200">{error}</p>
            <button
              type="button"
              onClick={() => setAttempt((n) => n + 1)}
              className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-black hover:bg-yellow-500"
            >
              Try again
            </button>
          </div>
        )}
      </div>

      {devices.length > 1 && (
        <label className="flex items-center gap-2 text-xs text-gray-400">
          Camera
          <select
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            className="min-w-0 flex-1 rounded-md border border-gray-700 bg-gray-900 px-2 py-1.5 text-sm text-white focus:border-yellow-500 focus:outline-none"
          >
            {devices.map((d, i) => (
              <option key={d.deviceId || i} value={d.deviceId}>
                {d.label || `Camera ${i + 1}`}
              </option>
            ))}
          </select>
        </label>
      )}
    </div>
  );
}
