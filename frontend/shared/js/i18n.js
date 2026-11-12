/**
 * Shared English / Arabic switch for HealPath funnels.
 *   const L = HPI18n.create(window.MY_AR_DICT);
 *   L.t('English text')  → Arabic when Arabic is on, else the same text
 *   L.set('ar', true)    → switch language (true = remember the choice)
 * Static HTML: add data-i18n (key = the element's English text) or
 * data-i18n="some.key"; data-i18n-aria translates aria-label.
 * Language order: ?lang= in the URL → saved choice → browser language.
 */
window.HPI18n = (function () {
  'use strict';
  const KEY = 'hp-lang';

  function create(AR) {
    AR = AR || {};
    let lang = 'en';
    const listeners = [];
    const metaDesc = document.querySelector('meta[name="description"]');
    const PAGE_EN = { title: document.title, desc: metaDesc ? metaDesc.content : '' };

    const isAr = () => lang === 'ar';

    function t(s) {
      if (!isAr() || !s) return s;
      if (AR[s] === undefined) { console.warn('[i18n] missing Arabic for:', s); return s; }
      return AR[s];
    }

    function initial() {
      const fromUrl = new URLSearchParams(location.search).get('lang');
      if (fromUrl === 'ar' || fromUrl === 'en') return fromUrl;
      try { const saved = localStorage.getItem(KEY); if (saved === 'ar' || saved === 'en') return saved; } catch (e) { /* storage blocked */ }
      return (navigator.language || '').toLowerCase().startsWith('ar') ? 'ar' : 'en';
    }

    function applyStatic() {
      document.querySelectorAll('[data-i18n]').forEach((el) => {
        if (el.dataset.en === undefined) el.dataset.en = el.innerHTML;
        const key = el.dataset.i18n || el.dataset.en.replace(/\s+/g, ' ').trim();
        el.innerHTML = isAr() && AR[key] !== undefined ? AR[key] : el.dataset.en;
      });
      document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
        if (el.dataset.enAria === undefined) el.dataset.enAria = el.getAttribute('aria-label');
        el.setAttribute('aria-label', t(el.dataset.enAria));
      });
    }

    function set(next, save) {
      lang = next === 'ar' ? 'ar' : 'en';
      const root = document.documentElement;
      root.lang = lang;
      root.dir = isAr() ? 'rtl' : 'ltr';
      const arTitle = AR[PAGE_EN.title] || AR['page.title']; // a page can translate its own <title> by its English text
      document.title = isAr() && arTitle ? arTitle : PAGE_EN.title;
      if (metaDesc) metaDesc.content = isAr() && AR['page.desc'] ? AR['page.desc'] : PAGE_EN.desc;
      applyStatic();

      document.querySelectorAll('.hp-lang__btn').forEach((b) => {
        const on = b.dataset.lang === lang;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', String(on));
      });
      const toggle = document.getElementById('btn-lang');
      if (toggle) { toggle.textContent = isAr() ? 'English' : 'العربية'; toggle.lang = isAr() ? 'en' : 'ar'; }

      if (save) { try { localStorage.setItem(KEY, lang); } catch (e) { /* storage blocked */ } }
      listeners.forEach((fn) => fn(lang));
    }

    // Wire the intro picker and header toggle, then apply the starting language.
    function init(onChange) {
      if (onChange) listeners.push(onChange);
      document.querySelectorAll('.hp-lang__btn').forEach((b) => b.addEventListener('click', () => set(b.dataset.lang, true)));
      const toggle = document.getElementById('btn-lang');
      if (toggle) toggle.addEventListener('click', () => set(isAr() ? 'en' : 'ar', true));
      set(initial(), false);
    }

    return { t, isAr, set, init, get lang() { return lang; } };
  }

  return { create };
})();
