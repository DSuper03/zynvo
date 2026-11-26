import { Download } from 'lucide-react';
import { PLAY_STORE_URL } from '@/lib/playstore';

export default function DownloadAndroidButton({
  className = '',
}: {
  className?: string;
}) {
  return (
    <a
      href={PLAY_STORE_URL}
      data-app-download="discover_header_desktop"
      className={`inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-black px-5 py-3 font-medium text-yellow-400 transition-colors duration-200 hover:text-yellow-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow-400 ${className}`}
    >
      <Download aria-hidden className="h-5 w-5" />
      <span className="tracking-tight">Download Android</span>
    </a>
  );
}
