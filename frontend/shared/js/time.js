/**
 * Date and time helpers for HealPath bookings. Everything is shown in clinic
 * time (Africa/Cairo) whatever the visitor's device is set to.
 */
window.HPTime = (function () {
  'use strict';
  const TZ = 'Africa/Cairo';
  const locale = (lang) => (lang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-GB'); // Western digits in Arabic too

  const fmt = (lang, opts) => new Intl.DateTimeFormat(locale(lang), Object.assign({ timeZone: TZ }, opts));

  // 'YYYY-MM-DD' of a moment, in Cairo
  function dayKey(date) {
    return new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(date));
  }

  // Cairo's UTC offset in minutes at a moment (+120 in winter, +180 in summer)
  function offsetMin(date) {
    try {
      const name = new Intl.DateTimeFormat('en-US', { timeZone: TZ, timeZoneName: 'shortOffset' })
        .formatToParts(new Date(date)).find((p) => p.type === 'timeZoneName').value; // "GMT+2"
      const m = name.match(/GMT([+-]\d+)(?::(\d+))?/);
      return m ? Number(m[1]) * 60 + Math.sign(Number(m[1])) * Number(m[2] || 0) : 120;
    } catch (e) { return 120; }
  }

  // A Date for a Cairo wall-clock time on a Cairo day ('YYYY-MM-DD', hour, minute)
  function cairoDate(day, h, min) {
    const [y, m, d] = day.split('-').map(Number);
    const guess = Date.UTC(y, m - 1, d, h, min) - 120 * 60000;
    return new Date(Date.UTC(y, m - 1, d, h, min) - offsetMin(guess) * 60000);
  }

  // Add n days to a 'YYYY-MM-DD'
  function addDays(day, n) {
    const [y, m, d] = day.split('-').map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d + n, 12));
    return dt.toISOString().slice(0, 10);
  }

  return {
    TZ, dayKey, cairoDate, addDays,
    weekday: (date, lang) => fmt(lang, { weekday: 'short' }).format(new Date(date)),
    dayNum: (date, lang) => fmt(lang, { day: 'numeric' }).format(new Date(date)),
    month: (date, lang) => fmt(lang, { month: 'short' }).format(new Date(date)),
    longDay: (date, lang) => fmt(lang, { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(date)),
    time: (date, lang) => fmt(lang, { hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(date))
  };
})();
