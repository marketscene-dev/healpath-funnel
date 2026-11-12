/**
 * HealPath Free Consultation Funnel
 * 5 questions → we suggest a General or a Specialty consultation → the visitor
 * picks a date and time → slot held → thanks.html → creates a NEW HealPath
 * account to confirm it (the free consultation is for new accounts only, one each).
 * Answers never leave the page except the chosen consultation type, which is
 * included in the booking message. Nothing health-related is sent to Meta.
 */
(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // SETTINGS — change these before going live
  // ---------------------------------------------------------------------------
  // Main booking system (see backend/BOOKING_API.md). While these are empty the funnel
  // runs on DEMO slots and demo booking ids, and shows a "Demo times" notice.
  const API_BASE = '';                         // e.g. 'https://booking.healpath.care/api'
  const AVAILABILITY_URL = API_BASE && `${API_BASE}/availability`;
  const HOLD_URL = API_BASE && `${API_BASE}/bookings/hold`;
  const LEAD_URL = API_BASE && `${API_BASE}/leads`; // optional: saves name + phone as soon as they're entered
  const DAYS_AHEAD = 14;
  const HOLD_MINUTES = 15;                     // demo only; the real hold time comes from the API

  // TODO: confirm with HealPath which specialties are offered free.
  // ar = Arabic name used after "استشارة" (e.g. "استشارة جلدية").
  const SPECIALTIES = {
    internal:    { name: 'Internal medicine', ar: 'باطنة',        desc: 'For long-term conditions like blood pressure, diabetes or thyroid, and problems that keep coming back.' },
    dermatology: { name: 'Dermatology',       ar: 'جلدية',        desc: 'For skin, hair and nail problems such as acne, rashes, eczema or hair loss.' },
    gynecology:  { name: 'Gynecology',        ar: 'نساء وتوليد',  desc: 'For periods, pregnancy questions, hormones and other women\'s health concerns.' },
    pediatrics:  { name: 'Pediatrics',        ar: 'أطفال',        desc: 'A children\'s doctor for illness, growth, feeding and vaccines.' },
    psychology:  { name: 'Mental health',     ar: 'نفسية',        desc: 'Talk to a specialist about stress, anxiety, low mood or sleep problems.' },
    nutrition:   { name: 'Nutrition',         ar: 'تغذية',        desc: 'A personal plan for weight, diet and healthy eating.' }
  };

  const L = window.HPI18n.create(window.HP_CONSULT_AR);
  const t = L.t;
  const isAr = L.isAr;

  // ---------------------------------------------------------------------------
  // ICONS
  // ---------------------------------------------------------------------------
  const svg = (d, fill) => `<svg viewBox="0 0 24 24" ${fill ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"'}>${d}</svg>`;
  const icon = {
    me: svg('<circle cx="12" cy="8" r="4.2"/><path d="M4 20.5c0-4.1 3.6-6.8 8-6.8s8 2.7 8 6.8c0 .5-.4.9-.9.9H4.9a.9.9 0 0 1-.9-.9z"/>', true),
    child: svg('<circle cx="12" cy="6" r="3"/><path d="M8 21v-5l-2-4 3-2h6l3 2-2 4v5M10 21v-4h4v4"/>'),
    parent: svg('<circle cx="10" cy="7" r="3.5"/><path d="M3.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M19 8v10M19 18l-2 2.5M19 18l2 2.5"/>'),
    other: svg('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18.5 14.4c1.8.8 3 2.9 3 5.6"/>'),
    sick: svg('<path d="M14 4v10.5a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0z"/><path d="M12 13v4"/>'),
    chronic: svg('<path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7zM8.5 8.5l7 7"/>'),
    skin: svg('<path d="M12 3c-3 4-6 7-6 11a6 6 0 0 0 12 0c0-4-3-7-6-11z"/><path d="M10 14h.01M14 16h.01M12 11h.01"/>'),
    women: svg('<circle cx="12" cy="9" r="5"/><path d="M12 14v7M9 18h6"/>'),
    kid: svg('<circle cx="12" cy="12" r="9"/><path d="M9 10h.01M15 10h.01M9 15c1.5 1.5 4.5 1.5 6 0"/>'),
    mind: svg('<path d="M12 21s-7-4.4-9.2-9A5.3 5.3 0 0 1 12 6a5.3 5.3 0 0 1 9.2 6c-2.2 4.6-9.2 9-9.2 9z"/>'),
    diet: svg('<path d="M12 7c-2-3-7-2-7 3 0 6 4 11 7 11s7-5 7-11c0-5-5-6-7-3z"/><path d="M12 7c0-2 1-4 3-5"/>'),
    checkup: svg('<path d="M5 3v5a5 5 0 0 0 10 0V3"/><path d="M10 13v2a5 5 0 0 0 10 0v-2"/><circle cx="20" cy="11" r="2"/>'),
    days: svg('<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>'),
    weeks: svg('<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M8 15h.01M12 15h.01M16 15h.01"/>'),
    months: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
    years: svg('<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>'),
    mild: svg('<circle cx="12" cy="12" r="9"/><path d="M8 14c1 1.3 2.4 2 4 2s3-.7 4-2M9 9h.01M15 9h.01"/>'),
    annoying: svg('<circle cx="12" cy="12" r="9"/><path d="M8 15h8M9 9h.01M15 9h.01"/>'),
    stops: svg('<circle cx="12" cy="12" r="9"/><path d="M8 16c1-1.3 2.4-2 4-2s3 .7 4 2M9 9h.01M15 9h.01"/>'),
    alert: svg('<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01"/>'),
    no: svg('<circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/>'),
    retry: svg('<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>'),
    followup: svg('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 15l2 2 4-4"/>'),
    check: svg('<path d="M20 6 9 17l-5-5"/>'),
    doctor: svg('<circle cx="12" cy="7" r="4"/><path d="M5 21c0-3.9 3.1-7 7-7s7 3.1 7 7"/><path d="M12 14v4M10 16h4"/>'),
    specialist: svg('<path d="M12 21s-7-4.4-9.2-9A5.3 5.3 0 0 1 12 6a5.3 5.3 0 0 1 9.2 6c-2.2 4.6-9.2 9-9.2 9z"/><path d="M8 12h2l1.5-2.5 2 5L15 12h1.5"/>')
  };

  // ---------------------------------------------------------------------------
  // QUESTIONS
  // points: g = general consultation, s = specialty consultation
  // spec:   the specialty this answer points to (question 2 only)
  // why:    reason shown on the result when the answer supports the winner
  // ---------------------------------------------------------------------------
  const QUESTIONS = [
    {
      id: 'who',
      title: 'Who is the consultation for?',
      subtitle: 'Pick one.',
      options: [
        { value: 'me', icon: icon.me, title: 'For me', desc: 'I\'m the patient', points: {} },
        { value: 'child', icon: icon.child, title: 'For my child', desc: 'Under 16 years old', points: {} },
        { value: 'parent', icon: icon.parent, title: 'For a parent', desc: 'Mother or father', points: {} },
        { value: 'other', icon: icon.other, title: 'For someone else', desc: 'Partner, relative or friend', points: {} }
      ]
    },
    {
      id: 'concern',
      title: 'What would you like help with?',
      subtitle: 'Pick the main concern.',
      options: [
        { value: 'sick', icon: icon.sick, title: 'Feeling sick', desc: 'Cold, fever, stomach, pain', points: { g: 3 },
          why: 'A general doctor is the right first step for everyday illness.' },
        { value: 'chronic', icon: icon.chronic, title: 'A long-term condition', desc: 'Blood pressure, diabetes, thyroid', points: { s: 2, g: 1 }, spec: 'internal',
          why: 'An internal medicine doctor follows long-term conditions.' },
        { value: 'skin', icon: icon.skin, title: 'Skin, hair or nails', desc: 'Acne, rash, hair loss', points: { s: 3 }, spec: 'dermatology',
          why: 'Skin, hair and nail concerns are best seen by a dermatologist.' },
        { value: 'women', icon: icon.women, title: 'Women\'s health', desc: 'Periods, pregnancy, hormones', points: { s: 3 }, spec: 'gynecology',
          why: 'A gynecologist focuses on women\'s health.' },
        { value: 'kid', icon: icon.kid, title: 'My child\'s health', desc: 'Illness, growth, feeding', points: { s: 3 }, spec: 'pediatrics',
          why: 'A pediatrician specialises in children\'s health.' },
        { value: 'mind', icon: icon.mind, title: 'Stress, sleep or mood', desc: 'Anxiety, low mood, burnout', points: { s: 3 }, spec: 'psychology',
          why: 'A mental health specialist can help with stress, sleep and mood.' },
        { value: 'diet', icon: icon.diet, title: 'Diet or weight', desc: 'Lose weight, eat healthier', points: { s: 3 }, spec: 'nutrition',
          why: 'A nutrition specialist can build a plan around you.' },
        { value: 'checkup', icon: icon.checkup, title: 'A general check-up', desc: 'Advice, no specific problem', points: { g: 3 },
          why: 'A general doctor is ideal for a check-up and health advice.' }
      ]
    },
    {
      id: 'duration',
      title: 'How long has this been going on?',
      subtitle: 'A rough guess is fine.',
      options: [
        { value: 'days', icon: icon.days, title: 'A few days', desc: 'It just started', points: { g: 2 },
          why: 'It started recently, so a general doctor can see you first.' },
        { value: 'weeks', icon: icon.weeks, title: 'A few weeks', desc: 'Less than 2 months', points: { g: 1, s: 1 } },
        { value: 'months', icon: icon.months, title: 'Several months', desc: '2 months or more', points: { s: 2 },
          why: 'It has lasted for months, so a specialist can look deeper.' },
        { value: 'years', icon: icon.years, title: 'On and off for years', desc: 'It keeps coming back', points: { s: 2 },
          why: 'It keeps coming back, so a specialist can look at the cause.' }
      ]
    },
    {
      id: 'impact',
      title: 'How much does it affect daily life?',
      subtitle: 'Be honest. This helps us suggest the right doctor.',
      options: [
        { value: 'mild', icon: icon.mild, title: 'A little', desc: 'I just want advice', points: { g: 1 },
          why: 'You mainly want advice, which a general doctor gives.' },
        { value: 'annoying', icon: icon.annoying, title: 'It\'s annoying', desc: 'It bothers me often', points: {} },
        { value: 'stops', icon: icon.stops, title: 'It stops me from doing things', desc: 'Work, school or sleep', points: { s: 1 } },
        { value: 'emergency', icon: icon.alert, title: 'Danger signs', desc: 'Chest pain, can\'t breathe, fainting', points: {}, emergency: true }
      ]
    },
    {
      id: 'before',
      title: 'Have you seen a doctor about this before?',
      subtitle: 'In the last 6 months.',
      options: [
        { value: 'no', icon: icon.no, title: 'No, this is the first time', desc: 'I haven\'t seen anyone yet', points: { g: 1 },
          why: 'This is your first visit for it, so starting with a general doctor makes sense.' },
        { value: 'nohelp', icon: icon.retry, title: 'Yes, but it didn\'t help', desc: 'I still have the problem', points: { s: 2 },
          why: 'Earlier treatment didn\'t help, so a specialist is the next step.' },
        { value: 'followup', icon: icon.followup, title: 'Yes, I need a follow-up', desc: 'Results, medicine or a plan', points: { s: 2 },
          why: 'A specialist can follow up on your results and treatment.' },
        { value: 'unsure', icon: icon.no, title: 'Not sure', desc: 'I don\'t remember', points: {} }
      ]
    }
  ];

  // ---------------------------------------------------------------------------
  // STATE & DOM
  // ---------------------------------------------------------------------------
  const state = { index: 0, answers: {}, choice: null, spec: null, result: null, person: null, slot: null, day: null };
  const $ = (id) => document.getElementById(id);
  const views = ['step-intro', 'step-details', 'step-quiz', 'step-emergency', 'step-loading', 'step-result'].map($);

  function show(id) {
    views.forEach((v) => v.classList.toggle('is-active', v.id === id));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const opt = (id) => {
    const q = QUESTIONS.find((x) => x.id === id);
    return state.answers[id] === undefined ? null : q.options[state.answers[id]];
  };

  // Names in the current language
  const specName = (key) => (isAr() ? SPECIALTIES[key].ar : SPECIALTIES[key].name);
  const specTitle = (key) => (isAr() ? `استشارة ${SPECIALTIES[key].ar}` : `${SPECIALTIES[key].name} consultation`);
  const choiceTitle = () => (state.choice === 'general' ? t('General consultation') : specTitle(state.spec));
  // English mid-sentence form: "a dermatology consultation", "an internal medicine consultation"
  const withArticle = (title) => { const s = title.toLowerCase(); return (/^[aeiou]/.test(s) ? 'an ' : 'a ') + s; };

  // ---------------------------------------------------------------------------
  // QUIZ
  // ---------------------------------------------------------------------------
  function renderQuestion(animate = true) {
    const q = QUESTIONS[state.index];
    const total = QUESTIONS.length;
    const pct = Math.round(((state.index + 1) / total) * 100);

    $('q-counter').textContent = isAr() ? `السؤال ${state.index + 1} من ${total}` : `Question ${state.index + 1} of ${total}`;
    $('q-percent').textContent = `${pct}%`;
    $('q-bar').style.width = `${pct}%`;
    $('q-title').textContent = t(q.title);
    $('q-subtitle').textContent = t(q.subtitle);
    $('btn-back').hidden = false; // on question 1 it goes back to the details step

    const wrap = $('q-options');
    wrap.innerHTML = '';
    q.options.forEach((o, i) => {
      const selected = state.answers[q.id] === i;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'hp-option' + (selected ? ' is-selected' : '') + (o.emergency ? ' hp-option--danger' : '');
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', String(selected));
      btn.innerHTML = `
        <span class="hp-option__icon" aria-hidden="true">${o.icon}</span>
        <span class="hp-option__text">
          <span class="hp-option__title">${t(o.title)}</span>
          <span class="hp-option__desc">${t(o.desc)}</span>
        </span>
        <span class="hp-option__radio" aria-hidden="true"></span>`;
      btn.addEventListener('click', () => choose(i, btn));
      wrap.appendChild(btn);
    });

    if (animate) {
      wrap.classList.remove('is-entering');
      void wrap.offsetWidth;
      wrap.classList.add('is-entering');
    }
  }

  let locked = false;
  function choose(i, btn) {
    if (locked) return;
    locked = true;
    const q = QUESTIONS[state.index];
    state.answers[q.id] = i;

    document.querySelectorAll('.hp-option').forEach((el) => {
      el.classList.remove('is-selected');
      el.setAttribute('aria-checked', 'false');
    });
    btn.classList.add('is-selected');
    btn.setAttribute('aria-checked', 'true');

    setTimeout(() => {
      locked = false;
      if (q.options[i].emergency) { show('step-emergency'); return; }
      if (state.index < QUESTIONS.length - 1) {
        state.index += 1;
        renderQuestion();
      } else {
        finish();
      }
    }, 280);
  }

  // ---------------------------------------------------------------------------
  // SCORING
  // ---------------------------------------------------------------------------
  function score() {
    const picks = QUESTIONS.map((q) => opt(q.id)).filter(Boolean);
    const total = { g: 0, s: 0 };
    picks.forEach((o) => { total.g += o.points.g || 0; total.s += o.points.s || 0; });

    // Which specialty to offer: from the concern, or a sensible default.
    const who = opt('who').value;
    let spec = opt('concern').spec;
    if (!spec) spec = who === 'child' ? 'pediatrics' : 'internal';
    if (who === 'child' && spec === 'internal') spec = 'pediatrics';
    if (who === 'child' && spec === 'pediatrics') total.s += 1; // children are best seen by a pediatrician

    // Ties go to general: a family doctor can always refer on.
    const best = total.s > total.g ? 'specialty' : 'general';
    const side = best === 'specialty' ? 's' : 'g';
    const other = side === 's' ? 'g' : 's';

    const reasons = [];
    if (who === 'child' && spec === 'pediatrics' && best === 'specialty' && opt('concern').value !== 'kid') {
      reasons.push(t('A pediatrician specialises in children\'s health.'));
    }
    picks.forEach((o) => {
      if (o.why && (o.points[side] || 0) > (o.points[other] || 0)) reasons.push(t(o.why));
    });

    return { best, spec, total, reasons: [...new Set(reasons)] };
  }

  // ---------------------------------------------------------------------------
  // RESULT
  // ---------------------------------------------------------------------------
  function renderWhy(result) {
    const items = result.reasons.slice(0, 4);
    if (!items.length) return '';
    return `
      <div class="hp-why__inner">
        <div class="hp-why__score">
          <strong class="hp-why__label">${t('Why')}</strong>
          <small>${t('we suggest this')}</small>
        </div>
        <ul class="hp-why__list">${items.map((r) => `<li>${icon.check}<span>${r}</span></li>`).join('')}</ul>
      </div>`;
  }

  function specOptions(selected) {
    return Object.keys(SPECIALTIES)
      .map((k) => `<option value="${k}"${k === selected ? ' selected' : ''}>${specName(k)}</option>`)
      .join('');
  }

  function renderChoices() {
    const r = state.result;
    const card = (key, title, desc, iconSvg, extra = '') => `
      <label class="hp-choice${state.choice === key ? ' is-selected' : ''}">
        <input type="radio" name="consult" value="${key}"${state.choice === key ? ' checked' : ''}>
        ${r.best === key ? `<span class="hp-choice__tag">${t('Recommended for you')}</span>` : ''}
        <span class="hp-choice__top">
          <span class="hp-choice__icon" aria-hidden="true">${iconSvg}</span>
          <span class="hp-choice__free">${t('Free')}</span>
        </span>
        <strong class="hp-choice__title">${title}</strong>
        <span class="hp-choice__desc">${desc}</span>
        ${extra}
        <span class="hp-choice__radio" aria-hidden="true"></span>
      </label>`;

    const specSelect = `
      <span class="hp-choice__select">
        <span>${t('Specialty')}</span>
        <select id="spec-select" aria-label="${t('Specialty')}">${specOptions(state.spec)}</select>
      </span>`;

    $('choice-cards').innerHTML =
      card('general', t('General consultation'),
        t('A family doctor for everyday health concerns, check-ups and advice. They can refer you to a specialist if needed.'),
        icon.doctor) +
      card('specialty', specTitle(state.spec), t(SPECIALTIES[state.spec].desc), icon.specialist, specSelect);

    document.querySelectorAll('input[name="consult"]').forEach((input) => {
      input.addEventListener('change', () => { state.choice = input.value; renderChoices(); });
    });
    $('spec-select').addEventListener('change', (e) => {
      state.spec = e.target.value;
      state.choice = 'specialty';
      renderChoices();
      $('spec-select').focus();
    });
    loadSlots();
    renderConfirm();
  }

  function renderResult() {
    const r = state.result;
    if (r.best === 'general') {
      $('result-title').textContent = t('A general consultation fits you best');
      $('result-lead').textContent = t('A family doctor can look at your concern, give advice and refer you to a specialist if needed.');
    } else {
      $('result-title').textContent = isAr() ? `${specTitle(r.spec)} هي الأنسب لك` : `${withArticle(specTitle(r.spec)).replace(/^a/, 'A')} fits you best`;
      $('result-lead').textContent = t('A specialist can focus on your concern from the first visit. You can still pick a general consultation below.');
    }
    $('result-why').innerHTML = renderWhy(r);
    renderChoices();
  }

  function finish() {
    show('step-loading');
    state.result = score();
    state.choice = state.result.best;
    state.spec = state.result.spec;
    setTimeout(() => {
      renderResult();
      show('step-result');
    }, 1400);
  }

  // ---------------------------------------------------------------------------
  // DETAILS (first step): name + phone, asked once
  // ---------------------------------------------------------------------------
  // Egyptian mobile: 01x xxxx xxxx, with or without +20 / 0020.
  function normalisePhone(raw) {
    let d = String(raw).replace(/[^\d+]/g, '').replace(/^\+/, '').replace(/^00/, '');
    if (d.startsWith('20')) d = d.slice(2);
    if (!d.startsWith('0')) d = '0' + d;
    return /^01[0125]\d{8}$/.test(d) ? d : null;
  }

  function setError(name, msg) {
    const el = document.querySelector(`.hp-field__error[data-for="${name}"]`);
    el.textContent = msg || '';
    el.closest('.hp-field').classList.toggle('has-error', !!msg);
  }

  let returnToResult = false;
  function submitDetails(e) {
    e.preventDefault();
    const form = e.target;
    const field = (n) => form.elements.namedItem(n);
    const name = field('name').value.trim();
    const phone = normalisePhone(field('phone').value);
    setError('name', name.length < 2 ? t('Please enter your name.') : '');
    setError('phone', phone ? '' : t('Please enter a valid Egyptian mobile number, e.g. 010 1234 5678.'));
    if (name.length < 2 || !phone) { form.querySelector('.has-error input').focus(); return; }

    state.person = { name, phone, marketingConsent: field('marketing').checked };
    // Save the lead straight away, so a visitor who stops mid-quiz can still be followed up.
    if (LEAD_URL) {
      fetch(LEAD_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.assign({ source: 'free-consult-funnel', lang: L.lang }, state.person)), keepalive: true })
        .catch((err) => console.warn('[consult] lead not saved', err));
    }

    if (returnToResult) { returnToResult = false; renderConfirm(); show('step-result'); return; }
    state.index = 0;
    renderQuestion();
    show('step-quiz');
  }

  // ---------------------------------------------------------------------------
  // AVAILABILITY — free slots from the main booking dashboard
  // ---------------------------------------------------------------------------
  const slots = { key: '', days: [], loading: false, error: false, demo: !AVAILABILITY_URL };
  const slotKey = () => `${state.choice}:${state.choice === 'specialty' ? state.spec : ''}`;

  async function fetchAvailability() {
    const q = new URLSearchParams({ consultation: state.choice, from: HPTime.dayKey(Date.now()), days: String(DAYS_AHEAD) });
    if (state.choice === 'specialty') q.set('specialty', state.spec);
    const res = await fetch(`${AVAILABILITY_URL}?${q}`, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error('Availability failed: ' + res.status);
    const data = await res.json();
    return data.slots || [];
  }

  // DEMO: stable fake slots (same answer every load) so the page can be tried without the API.
  function demoAvailability() {
    const out = [];
    const today = HPTime.dayKey(Date.now());
    const soonest = Date.now() + 60 * 60000;
    let seed = 0;
    for (const ch of slotKey()) seed = (seed * 31 + ch.charCodeAt(0)) % 9973;
    for (let d = 0; d < DAYS_AHEAD; d++) {
      const day = HPTime.addDays(today, d);
      if (new Date(day + 'T12:00:00Z').getUTCDay() === 5) continue; // Friday off
      for (let h = 10; h < 21; h++) {
        for (const m of [0, 30]) {
          const r = (seed + d * 53 + h * 17 + m) % 10;
          const start = HPTime.cairoDate(day, h, m);
          if (r < 5 && start.getTime() > soonest) out.push({ id: `demo_${day}_${h}${m}`, start: start.toISOString(), durationMin: 20 });
        }
      }
    }
    return out;
  }

  async function loadSlots(force) {
    const key = slotKey();
    if (!force && slots.key === key && (slots.loading || slots.days.length)) { renderSlots(); return; }
    slots.key = key; slots.loading = true; slots.error = false;
    state.slot = null;
    renderSlots();
    let list = [];
    try {
      list = AVAILABILITY_URL ? await fetchAvailability() : demoAvailability();
    } catch (err) {
      console.error(err);
      if (slots.key === key) { slots.loading = false; slots.error = true; slots.days = []; renderSlots(); }
      return;
    }
    if (slots.key !== key) return; // the visitor changed consultation meanwhile
    const byDay = new Map();
    list.sort((a, b) => new Date(a.start) - new Date(b.start)).forEach((sl) => {
      const k = HPTime.dayKey(sl.start);
      if (!byDay.has(k)) byDay.set(k, []);
      byDay.get(k).push(sl);
    });
    slots.days = [...byDay.entries()].map(([day, items]) => ({ day, items }));
    slots.loading = false;
    if (!slots.days.find((d) => d.day === state.day)) state.day = slots.days.length ? slots.days[0].day : null;
    renderSlots();
  }

  function renderSlots() {
    $('slots-demo').hidden = !slots.demo;
    const daysEl = $('slot-days');
    const timesEl = $('slot-times');
    const status = $('slots-status');
    $('slot-error').textContent = '';

    if (slots.loading) { daysEl.innerHTML = ''; timesEl.innerHTML = ''; status.textContent = t('Loading open times…'); renderConfirm(); return; }
    if (slots.error) {
      daysEl.innerHTML = ''; timesEl.innerHTML = '';
      status.innerHTML = `${t('We couldn\'t load the open times.')} <button type="button" class="hp-btn-link hp-slots__retry">${t('Try again')}</button>`;
      status.querySelector('button').addEventListener('click', () => loadSlots(true));
      renderConfirm();
      return;
    }
    if (!slots.days.length) { daysEl.innerHTML = ''; timesEl.innerHTML = ''; status.textContent = t('No open times in the next 2 weeks for this consultation. Try the other option above.'); renderConfirm(); return; }
    status.textContent = '';

    daysEl.innerHTML = slots.days.map(({ day, items }) => {
      const on = day === state.day;
      const ref = items[0].start;
      return `<button type="button" role="radio" aria-checked="${on}" class="hp-day${on ? ' is-selected' : ''}" data-day="${day}">
          <span class="hp-day__wd">${HPTime.weekday(ref, L.lang)}</span>
          <strong class="hp-day__num">${HPTime.dayNum(ref, L.lang)}</strong>
          <span class="hp-day__mon">${HPTime.month(ref, L.lang)}</span>
        </button>`;
    }).join('');
    daysEl.querySelectorAll('.hp-day').forEach((b) => b.addEventListener('click', () => {
      state.day = b.dataset.day; state.slot = null; renderSlots();
    }));

    const today = slots.days.find((d) => d.day === state.day);
    timesEl.innerHTML = (today ? today.items : []).map((sl) => {
      const on = state.slot && state.slot.id === sl.id;
      return `<button type="button" role="radio" aria-checked="${!!on}" class="hp-time${on ? ' is-selected' : ''}" data-id="${sl.id}"${isAr() ? '' : ' dir="ltr"'}>${HPTime.time(sl.start, L.lang)}</button>`;
    }).join('');
    timesEl.querySelectorAll('.hp-time').forEach((b) => b.addEventListener('click', () => {
      state.slot = today.items.find((x) => x.id === b.dataset.id);
      renderSlots();
    }));
    renderConfirm();
  }

  // Summary above the Book button
  function renderConfirm() {
    const btn = $('btn-book');
    btn.querySelector('span').textContent = isAr() ? `احجز ${choiceTitle()} مجانًا` : `Book my free ${choiceTitle().toLowerCase()}`;
    $('book-summary').innerHTML = state.slot
      ? `<strong>${choiceTitle()}</strong><span>${HPTime.longDay(state.slot.start, L.lang)} · <bdi>${HPTime.time(state.slot.start, L.lang)}</bdi></span>`
      : `<span>${t('Pick a time above to continue.')}</span>`;
    const p = state.person;
    $('book-who').innerHTML = p
      ? `${t('Booking for')} <strong><bdi>${p.name.replace(/[<>&"]/g, '')}</bdi></strong> · <bdi dir="ltr">${p.phone}</bdi> <button type="button" class="hp-btn-link" id="btn-edit-details">${t('Change')}</button>`
      : '';
    const edit = $('btn-edit-details');
    if (edit) edit.addEventListener('click', () => { returnToResult = true; show('step-details'); });
  }

  // ---------------------------------------------------------------------------
  // BOOK — hold the slot in the main booking system, then thanks.html → create account
  // ---------------------------------------------------------------------------
  async function book() {
    if (!state.slot) {
      $('slot-error').textContent = t('Please pick a date and time.');
      $('slot-picker').scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    const request = Object.assign({
      slotId: state.slot.id,
      source: 'free-consult-funnel',
      consultation: state.choice,                                   // 'general' | 'specialty'
      specialty: state.choice === 'specialty' ? state.spec : null,
      for: opt('who').value,
      lang: L.lang
    }, state.person);                                               // name, phone, marketingConsent

    const btn = $('btn-book');
    btn.disabled = true;
    let held;
    try {
      if (HOLD_URL) {
        const res = await fetch(HOLD_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(request) });
        const data = await res.json().catch(() => ({}));
        if (res.status === 409) {
          btn.disabled = false;
          if (data.error === 'already_used') { $('slot-error').textContent = t('This number has already used its free consultation.'); return; }
          if (data.error === 'existing_account') { $('slot-error').textContent = t('This number already has a HealPath account. The free consultation is for new accounts only.'); return; }
          $('slot-error').textContent = t('That time was just taken. Please pick another.');
          loadSlots(true);
          return;
        }
        if (!res.ok || !data.bookingId) throw new Error('Hold failed: ' + res.status);
        held = data;
      } else {
        console.warn('[consult] DEMO booking: API_BASE is empty, so nothing was held in the booking system.', request);
        held = { bookingId: 'demo_' + Math.random().toString(36).slice(2, 10), start: state.slot.start,
          holdExpiresAt: new Date(Date.now() + HOLD_MINUTES * 60000).toISOString(), demo: true };
      }
    } catch (err) {
      console.error(err);
      btn.disabled = false;
      $('slot-error').textContent = t('Something went wrong. Please try again, or message us on WhatsApp.');
      return;
    }

    // thanks.html fires the Meta "Lead" event once (no health details), shows the
    // booking and sends the visitor to sign-up to confirm it.
    try {
      sessionStorage.setItem('hp-lead', '1');
      const en = state.choice === 'general' ? 'General consultation' : `${SPECIALTIES[state.spec].name} consultation`;
      const ar = state.choice === 'general' ? window.HP_CONSULT_AR['General consultation'] : `استشارة ${SPECIALTIES[state.spec].ar}`;
      sessionStorage.setItem('hp-booking', JSON.stringify({
        en, ar, bookingId: held.bookingId, start: held.start || state.slot.start, holdExpiresAt: held.holdExpiresAt || null, demo: !!held.demo
      }));
    } catch (err) { /* storage blocked */ }
    location.href = `thanks.html?lang=${L.lang}`;
  }

  // ---------------------------------------------------------------------------
  // EVENTS
  // ---------------------------------------------------------------------------
  function restart() {
    state.index = 0; state.answers = {}; state.result = null; state.slot = null;
    show('step-intro');
  }

  // Start: ask for details once; if we already have them, go straight to the quiz.
  $('btn-start').addEventListener('click', () => {
    if (state.person) { state.index = 0; renderQuestion(); show('step-quiz'); } else { show('step-details'); }
  });
  $('details-form').addEventListener('submit', submitDetails);
  ['name', 'phone'].forEach((n) => $('details-form').elements.namedItem(n).addEventListener('input', () => setError(n, '')));
  $('btn-back').addEventListener('click', () => {
    if (state.index > 0) { state.index -= 1; renderQuestion(); } else { show('step-details'); }
  });
  $('btn-emergency-back').addEventListener('click', () => { delete state.answers.impact; renderQuestion(); show('step-quiz'); });
  $('btn-retake').addEventListener('click', restart);
  $('logo-home').addEventListener('click', (e) => { e.preventDefault(); restart(); });
  $('btn-book').addEventListener('click', book);

  // Language: re-render the open step in place when it changes.
  L.init(() => {
    if ($('step-quiz').classList.contains('is-active')) renderQuestion(false);
    if ($('step-result').classList.contains('is-active')) { renderResult(); renderSlots(); }
  });
})();
