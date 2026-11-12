/**
 * Meta Pixel for HealPath funnels.
 * Set PIXEL_ID to turn tracking on. While it is empty nothing loads.
 * Only send events with NO health details (no specialty, symptoms or answers):
 * see docs/PRIVACY_POLICY_META_TRACKING.md.
 */
window.HPTrack = (function () {
  'use strict';
  const PIXEL_ID = ''; // TODO: paste the HealPath Meta Pixel ID here

  if (PIXEL_ID) {
    /* eslint-disable */
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    window.fbq('init', PIXEL_ID);
    window.fbq('track', 'PageView');
  }

  // Fire a standard event with no parameters (e.g. 'Lead', 'Purchase').
  function track(eventName) {
    if (window.fbq) window.fbq('track', eventName);
  }

  return { track, enabled: !!PIXEL_ID };
})();
