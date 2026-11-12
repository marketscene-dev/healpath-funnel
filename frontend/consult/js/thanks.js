/**
 * Booking held → create a HealPath account to confirm it (new accounts only).
 * - Shows what was booked and how long the slot is held.
 * - Fires the Meta "Lead" event once per booking (no health details).
 * - "Create my account" opens the platform sign-up with the booking id, so once the
 *   account is created the platform confirms the booking with the main booking system (backend/BOOKING_API.md).
 */
(function () {
  'use strict';
  // The free consultation is for NEW accounts only, so we send people to sign-up, not sign-in.
  const SIGNUP_URL = 'https://patient.healpath.care/register';

  const L = window.HPI18n.create(window.HP_CONSULT_AR);
  const t = L.t;
  const $ = (id) => document.getElementById(id);

  let booking = null;
  try {
    booking = JSON.parse(sessionStorage.getItem('hp-booking') || 'null');
    if (sessionStorage.getItem('hp-lead') === '1') {
      window.HPTrack.track('Lead');
      sessionStorage.removeItem('hp-lead'); // a reload won't count twice
    }
  } catch (e) { /* storage blocked */ }

  // Only a random booking id and tags go in the URL: never name, phone or specialty
  // (URLs end up in analytics and ad pixels). The platform looks the rest up.
  function signUpUrl() {
    const u = new URL(SIGNUP_URL);
    u.searchParams.set('ref', 'free-consult');
    u.searchParams.set('utm_source', 'healpath-funnel');
    u.searchParams.set('utm_medium', 'consult-funnel');
    u.searchParams.set('utm_campaign', 'free-consultation');
    u.searchParams.set('lang', L.lang);
    if (booking && booking.bookingId) u.searchParams.set('booking', booking.bookingId);
    return u.toString();
  }

  function holdText() {
    if (!booking || !booking.holdExpiresAt) return '';
    const left = new Date(booking.holdExpiresAt).getTime() - Date.now();
    if (left <= 0) return t('Your hold has ended. Create your account now: if the time is still free we confirm it, otherwise you can pick a new one.');
    const m = Math.floor(left / 60000);
    const sec = String(Math.floor((left % 60000) / 1000)).padStart(2, '0');
    return L.isAr()
      ? `نحجز لك هذا الموعد لمدة ${m}:${sec} دقيقة. أنشئ حسابك لتأكيده.`
      : `We're holding this time for ${m}:${sec} more minutes. Create your account to confirm it.`;
  }

  function render() {
    $('btn-signin').href = signUpUrl();
    $('btn-plans').href = `../subs-funnel/?lang=${L.lang}`;
    if (!booking || !booking.start) return;
    $('booking-summary').hidden = false;
    $('sum-type').textContent = L.isAr() ? booking.ar : booking.en;
    $('sum-day').textContent = HPTime.longDay(booking.start, L.lang);
    $('sum-time').textContent = HPTime.time(booking.start, L.lang);
    $('demo-note').hidden = !booking.demo;
    const note = $('hold-note');
    note.hidden = !booking.holdExpiresAt;
    note.textContent = holdText();
  }

  L.init(render);
  setInterval(() => { if (booking && booking.holdExpiresAt) $('hold-note').textContent = holdText(); }, 1000);
})();
