/**
 * HealPath Plan Finder
 * 5 questions × 4 answers. Every answer gives points to one or more bundles;
 * the eligible bundle with the most points is recommended.
 * Bundles, prices and CTAs mirror https://healpath.the-marketscene.com/pricing/
 */
(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // LINKS (taken from the CTAs on the pricing page)
  // ---------------------------------------------------------------------------
  const PLATFORM_URL = 'https://patient.healpath.care/';
  const PRICING_URL = 'https://healpath.the-marketscene.com/pricing/';

  // ---------------------------------------------------------------------------
  // ICONS
  // ---------------------------------------------------------------------------
  const icon = {
    user: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="8" r="4.2"/><path d="M4 20.5c0-4.1 3.6-6.8 8-6.8s8 2.7 8 6.8c0 .5-.4.9-.9.9H4.9a.9.9 0 0 1-.9-.9z"/></svg>',
    family: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5 2.6 9.3a.9.9 0 0 0 1 1.5L12 4.7l8.4 6.1a.9.9 0 1 0 1-1.5z"/><circle cx="8" cy="11.6" r="2.1"/><circle cx="16" cy="11.6" r="2.1"/><circle cx="12" cy="14.2" r="1.6"/><path d="M4.5 20.5c0-2.7 1.6-4.6 3.5-4.6 1 0 1.9.5 2.5 1.3-.6.9-1 2-1 3.3zM19.5 20.5c0-2.7-1.6-4.6-3.5-4.6-1 0-1.9.5-2.5 1.3.6.9 1 2 1 3.3zM9.8 20.5c0-1.9 1-3.3 2.2-3.3s2.2 1.4 2.2 3.3z"/></svg>',
    building: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 2h11a1 1 0 0 1 1 1v18h-4v-3.5h-5V21H4V3a1 1 0 0 1 1-1zm2 3v2h2V5zm4 0v2h2V5zM7 9v2h2V9zm4 0v2h2V9zm-4 4v2h2v-2zm4 0v2h2v-2zm7-4h2a1 1 0 0 1 1 1v11h-3z"/></svg>',
    student: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3 1 8.5 12 14l9-4.5V16h2V8.5z"/><path d="M5.5 12.2V16c0 1.9 2.9 3.5 6.5 3.5s6.5-1.6 6.5-3.5v-3.8L12 15.5z"/></svg>',
    people: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18.5 14.4c1.8.8 3 2.9 3 5.6"/></svg>',
    one: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="3.5"/><path d="M5.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/></svg>',
    team: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/></svg>',
    bigteam: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 21h18M5 21V7l7-4 7 4v14"/><path d="M9 10h.01M15 10h.01M9 14h.01M15 14h.01M10 21v-3h4v3"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M20 6 9 17l-5-5"/></svg>',
    pill: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7zM8.5 8.5l7 7"/></svg>',
    pills: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="8" height="18" rx="4"/><path d="M3 12h8"/><circle cx="17.5" cy="15.5" r="4"/><path d="m14.7 18.3 5.6-5.6"/></svg>',
    question: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01"/></svg>',
    steth: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 3v5a5 5 0 0 0 10 0V3"/><path d="M10 13v2a5 5 0 0 0 10 0v-2"/><circle cx="20" cy="11" r="2"/></svg>',
    specialist: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 21s-7-4.4-9.2-9A5.3 5.3 0 0 1 12 6a5.3 5.3 0 0 1 9.2 6c-2.2 4.6-9.2 9-9.2 9z"/><path d="M8 12h2l1.5-2.5 2 5L15 12h1.5"/></svg>',
    tooth: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M7.5 3C4.4 3 3 5.4 3 8c0 3 1.5 4.5 2 7.5.4 2.5 1 5.5 2.5 5.5 1.8 0 1.6-5 4.5-5s2.7 5 4.5 5c1.5 0 2.1-3 2.5-5.5.5-3 2-4.5 2-7.5 0-2.6-1.4-5-4.5-5-2 0-3 1-4.5 1S9.5 3 7.5 3z"/></svg>',
    lab: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 3h6M10 3v6L4.5 18.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3"/><path d="M7.5 15h9"/></svg>',
    cal1: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
    cal3: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M8 15h.01M12 15h.01M16 15h.01"/></svg>',
    cal12: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="m9 15.5 2 2 4-4"/></svg>',
    invoice: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 11v6M12 7h.01"/></svg>',
    cross: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M17 7 7 17M7 7l10 10"/></svg>',
    brief: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 3h6a2 2 0 0 1 2 2v1h3a2 2 0 0 1 2 2v3H2V8a2 2 0 0 1 2-2h3V5a2 2 0 0 1 2-2zm0 3h6V5H9zM2 13h8v1.5a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V13h8v5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z"/></svg>',
    cap: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3 1 8.5 12 14l9-4.5V16h2V8.5z"/><path d="M5.5 12.2V16c0 1.9 2.9 3.5 6.5 3.5s6.5-1.6 6.5-3.5v-3.8L12 15.5z"/></svg>'
  };

  // ---------------------------------------------------------------------------
  // BUNDLES (copy & prices from the pricing page)
  // ---------------------------------------------------------------------------
  const BUNDLES = {
    individual: {
      layout: 'direct',
      name: 'Individual Access',
      audience: 'One named subscriber',
      icon: icon.user,
      anchor: '#individual-family',
      fromPrice: '250 EGP / month',
      desc: 'Individual Access is linked to one registered subscriber. Dependents and family members cannot use the same subscription.',
      prices: { monthly: 250, quarterly: 625, annual: 2500 },
      details: [
        ['ok', 'Unlimited Urgent / Primary Care Consultations for the registered subscriber.'],
        ['info', 'Specialty Care is available on a pay-per-use basis.'],
        ['info', 'Chronic Refill is not included unless an upgraded plan is selected.'],
        ['no', 'Routine Dental is not included.']
      ],
      cta: 'Continue to Patient Platform'
    },
    family: {
      layout: 'direct',
      name: 'Family Access',
      audience: '4 registered members in total',
      icon: icon.family,
      anchor: '#individual-family',
      fromPrice: '750 EGP / month',
      desc: 'Covers up to four registered family members in total, including the main subscriber. Every member must be registered by name before using the service.',
      prices: { monthly: 750, quarterly: 1875, annual: 7500 },
      details: [
        ['ok', 'Unlimited Urgent / Primary Care Consultations for registered members.'],
        ['info', 'Specialty Care is available on a pay-per-use basis.'],
        ['info', 'Chronic Refill is not included unless an upgraded plan is selected.'],
        ['no', 'Routine Dental is not included.']
      ],
      cta: 'Continue to Patient Platform'
    },
    smeA: {
      layout: 'sme', option: 'A', price: 90,
      name: 'Essential Primary Care',
      fullName: 'SME Access · Option A',
      anchor: '#sme-access',
      fromPrice: '90 EGP / employee / month',
      features: ['Urgent / Primary Care Consultations.', 'Company setup required.', 'Eligible employee list required.']
    },
    smeB: {
      layout: 'sme', option: 'B', price: 105,
      name: 'Primary Care + Chronic Refill',
      fullName: 'SME Access · Option B',
      anchor: '#sme-access',
      fromPrice: '105 EGP / employee / month',
      features: ['All services included in Option A.', 'Chronic Refill.', 'Company setup and employee eligibility confirmation required.']
    },
    smeC: {
      layout: 'sme', option: 'C', price: 120,
      name: 'Expanded Employee Access',
      fullName: 'SME Access · Option C',
      anchor: '#sme-access',
      fromPrice: '120 EGP / employee / month',
      features: ['All services included in Option B.', 'Specialty Care.', 'Routine Dental.', 'Company setup and employee eligibility confirmation required.']
    },
    student: {
      layout: 'student',
      name: 'HealPass Student Program',
      anchor: '#healpass',
      fromPrice: '200 EGP / month',
      desc: 'A monthly care-access program for verified active university students. Verification can be completed using a student ID or university email.',
      price: 200,
      details: [
        ['ok', 'Unlimited Urgent / Primary Care Consultations.'],
        ['ok', 'Two specialty teleconsultations per month.'],
        ['info', 'Mental health, psychiatry, psychology, and counselling are pay-per-use unless separately stated.'],
        ['info', 'Discount access for nutrition, labs, scans, and medication discounts where available.'],
        ['info', 'Student verification is required before activation.']
      ],
      cta: 'Verify Student Access'
    }
  };

  const BUNDLE_KEYS = Object.keys(BUNDLES);

  // Which bundles a person can actually buy, based on question 1.
  const ELIGIBLE = {
    me: ['individual', 'family'],
    family: ['family', 'individual'],
    company: ['smeC', 'smeB', 'smeA'],   // order = tie-break (more coverage wins a tie)
    student: ['student', 'individual']
  };

  // ---------------------------------------------------------------------------
  // QUESTIONS — 5 questions, 4 answers each, every answer scores bundles
  // ---------------------------------------------------------------------------
  const QUESTIONS = [
    {
      id: 'who',
      title: 'Who is the plan for?',
      subtitle: 'Pick the one that fits best.',
      options: [
        { value: 'me', icon: icon.user, title: 'Just me', desc: 'One person, one subscription',
          points: { individual: 5 },
          why: 'You need cover for yourself only.' },
        { value: 'family', icon: icon.family, title: 'My family', desc: 'Up to 4 family members',
          points: { family: 5 },
          why: 'You want one plan for the whole family.' },
        { value: 'company', icon: icon.building, title: 'My company', desc: 'Care for our employees',
          points: { smeA: 4, smeB: 4, smeC: 4 },
          why: 'You are covering employees, so SME Access applies.' },
        { value: 'student', icon: icon.student, title: 'I\'m a university student', desc: 'With a student ID or uni email',
          points: { student: 5 },
          why: 'As a verified student you get HealPass student pricing.' }
      ]
    },
    {
      id: 'size',
      title: 'How many people need care?',
      subtitle: 'Count everyone who will use the plan.',
      options: [
        { value: '1', icon: icon.one, title: 'Only 1 person', desc: 'A single subscriber',
          points: { individual: 3, student: 3 },
          why: 'Only one person needs care.' },
        { value: '2-4', icon: icon.people, title: '2 to 4 people', desc: 'Me plus family members',
          points: { family: 4 },
          why: 'Up to four people are covered under one subscription.' },
        { value: '5-20', icon: icon.team, title: '5 to 20 employees', desc: 'A small team',
          points: { smeA: 2, smeB: 2, smeC: 1 },
          why: 'A small team gets the best value per employee.' },
        { value: '20+', icon: icon.bigteam, title: 'More than 20 employees', desc: 'A growing company',
          points: { smeA: 1, smeB: 2, smeC: 2 },
          why: 'Larger teams get the most from wider employee coverage.' }
      ]
    },
    {
      id: 'meds',
      title: 'Does anyone take medicine every month?',
      subtitle: 'For example blood pressure, diabetes, or thyroid medicine.',
      options: [
        { value: 'no', icon: icon.check, title: 'No', desc: 'Nobody needs monthly refills',
          points: { individual: 2, family: 2, student: 2, smeA: 3 },
          why: 'No monthly medicine refills are needed.' },
        { value: 'some', icon: icon.pill, title: 'Yes, 1 or 2 people', desc: 'A few regular refills',
          points: { smeB: 3, smeC: 1 },
          why: 'Some people need regular Chronic Refill.' },
        { value: 'many', icon: icon.pills, title: 'Yes, several people', desc: 'Refills are needed often',
          points: { smeB: 4, smeC: 2 },
          why: 'Several people need regular Chronic Refill.' },
        { value: 'unsure', icon: icon.question, title: 'Not sure yet', desc: 'I\'ll decide later',
          points: { individual: 1, family: 1, student: 1, smeA: 1, smeB: 1 },
          why: 'You can upgrade later if refills become necessary.' }
      ]
    },
    {
      id: 'extra',
      title: 'What else matters most to you?',
      subtitle: 'Choose the one you would use most.',
      options: [
        { value: 'gp', icon: icon.steth, title: 'Just a doctor when needed', desc: 'Urgent and primary care',
          points: { individual: 2, family: 2, smeA: 3 },
          why: 'Unlimited Urgent / Primary Care covers what you need.' },
        { value: 'specialist', icon: icon.specialist, title: 'Specialist doctors', desc: 'Consults with specialists',
          points: { student: 3, smeC: 4 },
          why: 'Specialty Care is part of this plan.' },
        { value: 'dental', icon: icon.tooth, title: 'Dental care', desc: 'Routine dental visits',
          points: { smeC: 5 },
          why: 'Routine Dental is included.' },
        { value: 'discounts', icon: icon.lab, title: 'Lab, scan & medicine discounts', desc: 'Save on tests and medicine',
          points: { student: 4 },
          why: 'You get discount access for labs, scans, nutrition and medication.' }
      ]
    },
    {
      id: 'pay',
      title: 'How would you like to pay?',
      subtitle: 'Longer billing periods cost less per month.',
      options: [
        { value: 'monthly', icon: icon.cal1, title: 'Monthly', desc: 'Flexible, cancel anytime',
          points: { individual: 1, family: 1, student: 3 },
          why: 'Monthly billing keeps it flexible.' },
        { value: 'quarterly', icon: icon.cal3, title: 'Every 3 months', desc: 'Save about 17%',
          points: { individual: 2, family: 2 },
          why: 'Quarterly billing saves you money.' },
        { value: 'annual', icon: icon.cal12, title: 'Once a year', desc: 'Best price, 2 months free',
          points: { individual: 2, family: 2 },
          why: 'Annual billing gives you the lowest price.' },
        { value: 'company', icon: icon.invoice, title: 'My company pays', desc: 'Per employee, per month',
          points: { smeA: 2, smeB: 2, smeC: 2 },
          why: 'Your company pays a fixed price per employee each month.' }
      ]
    }
  ];

  // ---------------------------------------------------------------------------
  // STATE & DOM
  // ---------------------------------------------------------------------------
  const state = { index: 0, answers: {} }; // answers[questionId] = option index

  const $ = (id) => document.getElementById(id);
  const views = ['step-intro', 'step-quiz', 'step-loading', 'step-result'].map($);

  function show(id) {
    views.forEach((v) => v.classList.toggle('is-active', v.id === id));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const fmt = (n) => n.toLocaleString('en-US');

  // ---------------------------------------------------------------------------
  // QUIZ
  // ---------------------------------------------------------------------------
  function renderQuestion() {
    const q = QUESTIONS[state.index];
    const total = QUESTIONS.length;
    const pct = Math.round(((state.index + 1) / total) * 100);

    $('q-counter').textContent = `Question ${state.index + 1} of ${total}`;
    $('q-percent').textContent = `${pct}%`;
    $('q-bar').style.width = `${pct}%`;
    $('q-title').textContent = q.title;
    $('q-subtitle').textContent = q.subtitle;
    $('btn-back').hidden = state.index === 0;

    const wrap = $('q-options');
    wrap.innerHTML = '';
    q.options.forEach((opt, i) => {
      const selected = state.answers[q.id] === i;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'hp-option' + (selected ? ' is-selected' : '');
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', String(selected));
      btn.innerHTML = `
        <span class="hp-option__icon" aria-hidden="true">${opt.icon}</span>
        <span class="hp-option__text">
          <span class="hp-option__title">${opt.title}</span>
          <span class="hp-option__desc">${opt.desc}</span>
        </span>
        <span class="hp-option__radio" aria-hidden="true"></span>`;
      btn.addEventListener('click', () => choose(i, btn));
      wrap.appendChild(btn);
    });

    // restart entry animation
    wrap.classList.remove('is-entering');
    void wrap.offsetWidth;
    wrap.classList.add('is-entering');
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
  function answerOf(id) {
    const q = QUESTIONS.find((x) => x.id === id);
    return q.options[state.answers[id]];
  }

  function score() {
    const totals = Object.fromEntries(BUNDLE_KEYS.map((k) => [k, 0]));
    QUESTIONS.forEach((q) => {
      const opt = q.options[state.answers[q.id]];
      Object.entries(opt.points).forEach(([k, v]) => { totals[k] += v; });
    });

    const eligible = ELIGIBLE[answerOf('who').value];
    // highest score wins; ties resolved by order in ELIGIBLE
    const ranked = [...eligible].sort((a, b) => totals[b] - totals[a] || eligible.indexOf(a) - eligible.indexOf(b));
    const best = ranked[0];

    // How many answers pointed to the winner (gave it the top points among eligible plans)
    let matches = 0;
    const reasons = [];
    QUESTIONS.forEach((q) => {
      const opt = q.options[state.answers[q.id]];
      const mine = opt.points[best] || 0;
      const top = Math.max(...eligible.map((k) => opt.points[k] || 0));
      if (mine > 0 && mine === top) {
        matches += 1;
        reasons.push(opt.why);
      }
    });

    return { totals, best, ranked, matches, reasons };
  }

  // ---------------------------------------------------------------------------
  // RESULT RENDERING
  // ---------------------------------------------------------------------------
  function detailIcon(type) {
    return `<span class="hp-dot hp-dot--${type}" aria-hidden="true">${type === 'ok' ? icon.check : type === 'no' ? icon.cross : icon.info}</span>`;
  }

  function detailList(items) {
    return `<ul class="hp-details">${items.map(([t, txt]) => `<li>${detailIcon(t)}<span>${txt}</span></li>`).join('')}</ul>`;
  }

  // Honest "good to know" notes when an answer asks for something the plan doesn't include.
  function gapNotes(key) {
    const meds = answerOf('meds').value;
    const extra = answerOf('extra').value;
    const notes = [];
    const needsMeds = meds === 'some' || meds === 'many';

    if (key === 'individual' || key === 'family') {
      if (needsMeds) notes.push('Chronic Refill isn\'t part of this plan. It\'s available pay-per-use at 525 EGP per consultation.');
      if (extra === 'specialist') notes.push('Specialty Care is available pay-per-use at 525 EGP per consultation.');
      if (extra === 'dental') notes.push('Routine Dental isn\'t included in Individual or Family Access.');
      if (extra === 'discounts') notes.push('Lab, scan and medication discounts are part of the HealPass Student Program for verified students.');
    }
    if (key === 'student') {
      if (needsMeds) notes.push('Chronic Refill is available pay-per-use at 525 EGP per consultation.');
      if (extra === 'dental') notes.push('Routine Dental isn\'t included in HealPass.');
    }
    if (key === 'smeA' && needsMeds) notes.push('Need refills? Option B adds Chronic Refill for 15 EGP more per employee.');
    if (key === 'smeB' && (extra === 'specialist' || extra === 'dental')) notes.push('Option C adds Specialty Care and Routine Dental for 15 EGP more per employee.');
    return notes;
  }

  function primaryBtn(label, extraClass = '') {
    return `<a href="${PLATFORM_URL}" target="_blank" rel="noopener" class="hp-btn hp-btn--primary ${extraClass}">${label}${icon.arrow}</a>`;
  }

  function renderDirect(key) {
    const b = BUNDLES[key];
    const pay = answerOf('pay').value;
    const pick = ['monthly', 'quarterly', 'annual'].includes(pay) ? pay : 'monthly';
    const m = b.prices.monthly;
    const rows = [
      { id: 'monthly', label: 'Monthly', sub: 'Billed monthly', price: b.prices.monthly, save: 0 },
      { id: 'quarterly', label: 'Quarterly', sub: 'One quarter', price: b.prices.quarterly, save: m * 3 - b.prices.quarterly },
      { id: 'annual', label: 'Annual', sub: 'One year', price: b.prices.annual, save: m * 12 - b.prices.annual }
    ];

    const options = rows.map((r) => `
      <label class="hp-price-option${r.id === pick ? ' is-selected' : ''}">
        <input type="radio" name="billing" value="${r.id}" ${r.id === pick ? 'checked' : ''}>
        <span class="hp-price-option__radio" aria-hidden="true"></span>
        <span class="hp-price-option__label">
          <strong>${r.label}</strong>
          <span>${r.sub}</span>
        </span>
        <span class="hp-price-option__amount">
          ${r.save ? `<em class="hp-save">Save ${fmt(r.save)} EGP</em>` : ''}
          <strong>${fmt(r.price)}</strong><span>EGP</span>
        </span>
        ${r.id === pick ? '<span class="hp-price-option__tag">Recommended</span>' : ''}
      </label>`).join('');

    return `
      <article class="hp-plan-card">
        <div class="hp-plan-card__main">
          <div class="hp-plan-card__top">
            <span class="hp-plan-card__icon" aria-hidden="true">${b.icon}</span>
            <div>
              <span class="hp-plan-card__audience">${b.audience}</span>
              <h3>${b.name}</h3>
            </div>
          </div>
          <p class="hp-plan-card__desc">${b.desc}</p>
          <fieldset class="hp-price-options">
            <legend class="sr-only">Choose billing period</legend>
            ${options}
          </fieldset>
        </div>
        <div class="hp-plan-card__side">
          <h4>Plan details</h4>
          ${detailList(b.details)}
          ${notesBlock(key)}
          ${primaryBtn(b.cta, 'hp-btn--block')}
          <a class="hp-plan-card__more" href="${PRICING_URL}${b.anchor}" target="_blank" rel="noopener">Compare on the pricing page</a>
        </div>
      </article>`;
  }

  function renderSme(key) {
    const cards = ['smeA', 'smeB', 'smeC'].map((k) => {
      const b = BUNDLES[k];
      const best = k === key;
      return `
        <article class="hp-sme-card${best ? ' is-best' : ''}">
          ${best ? '<span class="hp-sme-card__ribbon">Best match for you</span>' : ''}
          <div class="hp-sme-card__header">
            <span class="hp-sme-card__option">Option ${b.option}</span>
            <div class="hp-sme-card__price"><strong>${b.price}</strong><span>EGP</span></div>
            <small>per employee / month</small>
          </div>
          <div class="hp-sme-card__body">
            <h3>${b.name}</h3>
            <ul class="hp-sme-list">${b.features.map((f) => `<li>${icon.check}<span>${f}</span></li>`).join('')}</ul>
            <a href="${PLATFORM_URL}" target="_blank" rel="noopener" class="hp-btn ${best ? 'hp-btn--primary' : 'hp-btn--outline'} hp-btn--block">Start Company Setup${icon.arrow}</a>
          </div>
        </article>`;
    }).join('');

    return `
      <div class="hp-sme">
        <div class="hp-notice hp-notice--card">
          ${icon.brief}
          <p>SME Access is designed for smaller employer groups and is different from large employer self-funded schemes. Company setup and an eligible employee list are required before activation.</p>
        </div>
        ${notesBlock(key)}
        <div class="hp-sme__grid">${cards}</div>
      </div>`;
  }

  function renderStudent(key) {
    const b = BUNDLES.student;
    return `
      <article class="hp-student">
        <div class="hp-student__content">
          <span class="hp-pill">${icon.cap}Student-only program</span>
          <h3>${b.name}</h3>
          <p>${b.desc}</p>
          <div class="hp-student__price">
            <strong>${b.price}</strong>
            <span><b>EGP</b>per student / month</span>
          </div>
          ${primaryBtn(b.cta)}
        </div>
        <div class="hp-student__details">
          <h4>What the program includes</h4>
          ${detailList(b.details)}
          ${notesBlock(key)}
          <a class="hp-plan-card__more" href="${PRICING_URL}${b.anchor}" target="_blank" rel="noopener">See HealPass on the pricing page</a>
        </div>
      </article>`;
  }

  function notesBlock(key) {
    const notes = gapNotes(key);
    if (!notes.length) return '';
    return `<div class="hp-good-to-know"><strong>Good to know</strong>${notes.map((n) => `<p>${n}</p>`).join('')}</div>`;
  }

  function renderWhy(result) {
    const items = result.reasons.slice(0, 4);
    if (!items.length) return '';
    return `
      <div class="hp-why__inner">
        <div class="hp-why__score">
          <strong>${result.matches}<span>/${QUESTIONS.length}</span></strong>
          <small>answers point to this plan</small>
        </div>
        <ul class="hp-why__list">${items.map((r) => `<li>${icon.check}<span>${r}</span></li>`).join('')}</ul>
      </div>`;
  }

  function renderAlt(result) {
    if (BUNDLES[result.best].layout === 'sme') return ''; // all SME options are already shown
    const alt = result.ranked[1];
    if (!alt) return '';
    const b = BUNDLES[alt];
    return `
      <div class="hp-alt">
        <div>
          <span class="hp-alt__label">Also worth a look</span>
          <h4>${b.name}</h4>
          <span class="hp-alt__price">From ${b.fromPrice}</span>
        </div>
        <a href="${PRICING_URL}${b.anchor}" target="_blank" rel="noopener" class="hp-btn hp-btn--outline">View plan${icon.arrow}</a>
      </div>`;
  }

  const HEADLINES = {
    individual: ['Individual Access is your best fit', 'Unlimited urgent and primary care for one registered subscriber.'],
    family: ['Family Access is your best fit', 'One subscription for up to four registered family members.'],
    smeA: ['SME Access · Option A fits your team', 'Essential primary care for your employees at the lowest price per employee.'],
    smeB: ['SME Access · Option B fits your team', 'Primary care plus Chronic Refill for employees who need regular medicine.'],
    smeC: ['SME Access · Option C fits your team', 'The widest employee cover, with Specialty Care and Routine Dental.'],
    student: ['HealPass Student is your best fit', 'Affordable monthly care built for verified university students.']
  };

  function finish() {
    show('step-loading');
    const result = score();

    setTimeout(() => {
      const key = result.best;
      const layout = BUNDLES[key].layout;
      $('result-title').textContent = HEADLINES[key][0];
      $('result-lead').textContent = HEADLINES[key][1];
      $('result-plan').innerHTML = layout === 'direct' ? renderDirect(key) : layout === 'sme' ? renderSme(key) : renderStudent(key);
      $('result-why').innerHTML = renderWhy(result);
      $('result-alt').innerHTML = renderAlt(result);

      // billing selector highlight
      document.querySelectorAll('.hp-price-option input').forEach((input) => {
        input.addEventListener('change', () => {
          document.querySelectorAll('.hp-price-option').forEach((el) => el.classList.toggle('is-selected', el.contains(input) && input.checked));
        });
      });

      show('step-result');
    }, 1600);
  }

  // ---------------------------------------------------------------------------
  // EVENTS
  // ---------------------------------------------------------------------------
  $('btn-start').addEventListener('click', () => {
    state.index = 0;
    renderQuestion();
    show('step-quiz');
  });

  $('btn-back').addEventListener('click', () => {
    if (state.index > 0) {
      state.index -= 1;
      renderQuestion();
    }
  });

  $('btn-retake').addEventListener('click', () => {
    state.index = 0;
    state.answers = {};
    show('step-intro');
  });
})();
