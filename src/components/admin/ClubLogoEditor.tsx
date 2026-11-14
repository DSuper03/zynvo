'use client';

import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Upload } from 'lucide-react';
import ClubLogo from '@/components/ClubLogo';
import { compressImageToUnder2MB, toBase64, uploadImageToImageKit } from '@/lib/imgkit';

const MAX_BYTES = 2 * 1024 * 1024;

interface Props {
  clubId: string;
  clubName: string;
  token: string;
  currentLogo: string | null | undefined;
  /** Called with the new URL after a successful save. */
  onUpdated?: (url: string) => void;
}

/**
 * "Club Logo" on the admin page. Uploads to ImageKit (same flow as club
 * creation), then saves via PUT /api/v2/admin/updateClubLogo/:clubId, which
 * the server allows for the club head and core members.
 */
export default function ClubLogoEditor({ clubId, clubName, token, currentLogo, onUpdated }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const pick = (f: File | undefined) => {
    if (!f) return;
    if (!f.type.startsWith('image/')) {
      toast.error('Please choose an image file');
      return;
    }
    setFile(f);
  };

  const reset = () => {
    setFile(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const save = async () => {
    if (!file) return;
    setSaving(true);
    try {
      let toUpload = file;
      if (toUpload.size > MAX_BYTES) {
        toUpload = await compressImageToUnder2MB(toUpload);
        if (toUpload.size > MAX_BYTES) {
          toast.error('Could not compress the image under 2 MB. Try a smaller image.');
          return;
        }
      }
      const url = await uploadImageToImageKit(await toBase64(toUpload), toUpload.name, '/clubs');
      await axios.put(
        `/api/v2/admin/updateClubLogo/${clubId}`,
        { logo: url },
        { headers: { authorization: `Bearer ${token}` } }
      );
      toast.success('Club logo updated');
      onUpdated?.(url);
      reset();
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 403) toast.error('Only the club head and core members can change the logo');
      else if (status === 404) toast.error('Logo editing is not available yet');
      else toast.error(err?.response?.data?.msg ?? 'Could not update the logo');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-yellow-400/30 bg-black shrink-0">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="New logo preview" className="w-full h-full object-cover" />
        ) : (
          <ClubLogo src={currentLogo} name={clubName} fill className="object-cover" />
        )}
      </div>
      <div className="space-y-2 min-w-0">
        <input
          ref={inputRef}
          id="club-logo-input"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => pick(e.target.files?.[0])}
        />
        {!file ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 border border-yellow-400/60 text-yellow-300 px-4 py-2 rounded-lg hover:bg-yellow-400/10 font-semibold"
          >
            <Upload className="w-4 h-4" />
            Change logo
          </button>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-300 font-semibold disabled:opacity-50"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? 'Saving…' : 'Save logo'}
            </button>
            <button
              type="button"
              onClick={reset}
              disabled={saving}
              className="text-sm text-yellow-400/70 hover:text-yellow-300 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        )}
        <p className="text-xs text-yellow-400/60">
          Square images look best. Larger than 2 MB will be compressed.
        </p>
      </div>
    </div>
  );
}
