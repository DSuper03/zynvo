import { track } from './analytics';

const selector = 'a[data-app-download], a[href^="https://play.google.com/store/apps/details?"][href*="id=com.zynvosocial.app"]';

function placementFor(link: Element) {
  return link.getAttribute('data-app-download') || 'unlabeled_play_store_link';
}

export function startAppDownloadAnalytics() {
  function captureClick(event: MouseEvent) {
    if (event.type === 'auxclick' && event.button !== 1) return;
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest(selector);
    if (!link) return;
    track('app_download_clicked', { placement: placementFor(link), store: 'google_play' },
      { transport: 'sendBeacon', send_instantly: true });
  }

  document.addEventListener('click', captureClick, true);
  document.addEventListener('auxclick', captureClick, true);

  if (!('IntersectionObserver' in window)) return;
  const intersection = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting || entry.intersectionRatio < 0.5) continue;
      track('app_download_cta_viewed', { placement: placementFor(entry.target), store: 'google_play' });
      intersection.unobserve(entry.target);
    }
  }, { threshold: 0.5 });

  function observeLinks(node: Node) {
    if (!(node instanceof Element)) return;
    if (node.matches(selector)) intersection.observe(node);
    node.querySelectorAll(selector).forEach((link) => intersection.observe(link));
  }

  const mutations = new MutationObserver((records) => {
    for (const record of records) {
      record.removedNodes.forEach((node) => {
        if (!(node instanceof Element)) return;
        if (node.matches(selector)) intersection.unobserve(node);
        node.querySelectorAll(selector).forEach((link) => intersection.unobserve(link));
      });
      record.addedNodes.forEach(observeLinks);
    }
  });

  mutations.observe(document.documentElement, { childList: true, subtree: true });
  observeLinks(document.documentElement);
}
