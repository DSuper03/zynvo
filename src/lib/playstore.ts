export const PLAY_STORE_PACKAGE = 'com.zynvosocial.app';

export const PLAY_STORE_URL = `https://play.google.com/store/apps/details?id=${PLAY_STORE_PACKAGE}&pcampaignid=web_share`;

export type DiscoveryPlacement =
  | 'club_search'
  | 'zyncers'
  | 'event_recap'
  | 'club_recruitment'
  | 'discover_today'
  | 'discover_drop_sample';

export function discoveryStoreUrl(source: DiscoveryPlacement) {
  const url = new URL(PLAY_STORE_URL);
  url.searchParams.set('referrer', new URLSearchParams({
    utm_source: 'zynvo_web',
    utm_medium: source,
    utm_campaign: 'campus_discovery',
  }).toString());
  return url.toString();
}

export const APP_DOWNLOAD_PATH = '/application';

export const PLAY_STORE_PROMO = {
  wide: '/promo/playstore-wide-1.png',
  wideAlt: '/promo/playstore-wide-2.png',
  landscape: '/promo/playstore-landscape.png',
  portrait: '/promo/playstore-portrait.png',
} as const;
