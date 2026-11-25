import { discoveryStoreUrl, type DiscoveryPlacement } from '@/lib/playstore';

export default function CampusPreviewPlayLink({ placement }: { placement: DiscoveryPlacement }) {
  return (
    <a
      data-app-download={placement}
      href={discoveryStoreUrl(placement)}
      className="inline-block rounded-full bg-yellow-400 px-4 py-2 text-sm font-semibold text-black hover:bg-yellow-300"
    >
      Get Zynvo on Google Play
    </a>
  );
}
