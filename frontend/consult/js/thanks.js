/**
 * Booking confirmation page. Fires the Meta "Lead" event once per booking
 * (no health details) and shows the WhatsApp fallback link.
 */
(function () {
  'use strict';
  const L = window.HPI18n.create(window.HP_CONSULT_AR);

  let booking = null;
  try {
    booking = JSON.parse(sessionStorage.getItem('hp-booking') || 'null');
    if (sessionStorage.getItem('hp-lead') === '1') {
      window.HPTrack.track('Lead');
      sessionStorage.removeItem('hp-lead'); // a reload won't count twice
    }
  } catch (e) { /* storage blocked */ }

  const wa = document.getElementById('btn-wa');
  if (booking && booking.wa) wa.href = booking.wa;

  function render() {
    const lead = document.getElementById('thanks-lead');
    if (booking && booking.en) {
      lead.textContent = L.isAr()
        ? `استلمنا طلبك لحجز ${booking.ar} مجانية.`
        : `We received your request for a free ${booking.en.toLowerCase()}.`;
    }
    document.getElementById('btn-plans').href = `../subs-funnel/?lang=${L.lang}`;
  }

  L.init(render);
})();
