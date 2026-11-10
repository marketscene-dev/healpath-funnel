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

  // Extra icons used by the branching questions
  Object.assign(icon, {
    two: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="8" cy="8" r="3.2"/><circle cx="16" cy="8" r="3.2"/><path d="M2 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5M14.5 14.6c.5-.1 1-.1 1.5-.1 3.3 0 6 2.2 6 5.5"/></svg>',
    three: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="7" r="3"/><circle cx="5" cy="10" r="2.3"/><circle cx="19" cy="10" r="2.3"/><path d="M6.5 20c0-3.2 2.5-5.5 5.5-5.5s5.5 2.3 5.5 5.5M1.5 19c0-2.2 1.4-3.8 3.5-3.8M22.5 19c0-2.2-1.4-3.8-3.5-3.8"/></svg>',
    idcard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="11" r="2"/><path d="M5 16c.6-1.5 1.7-2.2 3-2.2s2.4.7 3 2.2M14 10h5M14 13.5h3"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    both: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5z"/><path d="m8.5 12 2.5 2.5 4.5-5"/></svg>',
    none: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>',
    mind: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 21s-7-4.4-9.2-9A5.3 5.3 0 0 1 12 6a5.3 5.3 0 0 1 9.2 6c-2.2 4.6-9.2 9-9.2 9z"/></svg>',
    rare: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    coin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M15 9.5c-.5-1-1.6-1.5-3-1.5-1.7 0-3 .8-3 2s1.3 1.7 3 2 3 .8 3 2-1.3 2-3 2c-1.4 0-2.5-.5-3-1.5M12 6v2M12 16v2"/></svg>',
    balance: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 3v18M7 21h10M5 7h14M5 7l-3 6a3 3 0 0 0 6 0zM19 7l-3 6a3 3 0 0 0 6 0z"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5z"/></svg>'
  });

  // What each SME option covers — used to enforce must-have answers.
  const FEATURES = {
    smeA: [],
    smeB: ['chronic'],
    smeC: ['chronic', 'specialty', 'dental']
  };

  // Which bundles a person can buy, based on question 1. Order = tie-break.
  const ELIGIBLE = {
    me: ['individual', 'family'],
    family: ['family', 'individual'],
    company: ['smeC', 'smeB', 'smeA'],
    student: ['student', 'individual']
  };

  const MONTHLY_PRICE = { individual: 250, family: 750, student: 200 };

  // ---------------------------------------------------------------------------
  // QUESTIONS — Q1 picks the path, then 4 path-specific questions.
  // Every answer gives points. Optional:
  //   requires: [feature]  → only plans with that feature can win (SME)
  //   exclude:  [bundle]   → that bundle can't win (e.g. unverified student)
  //   why: string | fn(bestKey) → reason shown on the result
  // ---------------------------------------------------------------------------
  const Q_WHO = {
    id: 'who',
    title: 'Who is the plan for?',
    subtitle: 'Pick the one that fits best.',
    options: [
      { value: 'me', path: 'direct', icon: icon.user, title: 'Just me', desc: 'One person, one subscription',
        points: { individual: 2 }, why: 'You are mainly looking for cover for yourself.' },
      { value: 'family', path: 'direct', icon: icon.family, title: 'My family', desc: 'Up to 4 family members',
        points: { family: 2 }, why: 'You want one plan for your family.' },
      { value: 'company', path: 'company', icon: icon.building, title: 'My company', desc: 'Care for our employees',
        points: { smeA: 3, smeB: 3, smeC: 3 }, why: 'You are covering employees, so SME Access applies.' },
      { value: 'student', path: 'student', icon: icon.student, title: 'I\'m a university student', desc: 'Active university student',
        points: { student: 3 }, why: 'You are an active university student.' }
    ]
  };

  // Shared question: how often care is needed (value framing vs pay-per-use 525 EGP)
  const valueWhy = (best) => {
    const p = MONTHLY_PRICE[best];
    return p ? `One pay-per-use consultation costs 525 EGP. ${BUNDLES[best].name} is ${fmt(p)} EGP a month with unlimited urgent / primary care.` : '';
  };
  const Q_FREQ = {
    id: 'freq',
    title: 'How often do you usually need a doctor?',
    subtitle: 'A rough guess is fine.',
    options: [
      { value: 'rare', icon: icon.rare, title: 'Rarely', desc: '1 or 2 times a year',
        points: { individual: 1, family: 1, student: 1 }, why: 'You want cover ready for when you do get sick.' },
      { value: 'few', icon: icon.cal3, title: 'Every few months', desc: 'A few visits a year',
        points: { individual: 2, family: 2, student: 2 }, why: valueWhy },
      { value: 'monthly', icon: icon.cal1, title: 'About once a month', desc: 'Regular check-ins',
        points: { individual: 3, family: 3, student: 3 }, why: valueWhy },
      { value: 'often', icon: icon.steth, title: 'More than once a month', desc: 'Frequent visits',
        points: { individual: 3, family: 3, student: 3 }, why: 'Unlimited Urgent / Primary Care means frequent visits cost nothing extra.' }
    ]
  };

  const PATHS = {
    // Individual & Family
    direct: [
      {
        id: 'size',
        title: 'Including you, how many people need care?',
        subtitle: 'Family Access covers up to 4 registered members.',
        options: [
          { value: '1', icon: icon.one, title: 'Just me', desc: '1 person',
            points: { individual: 6 }, why: 'Only one person needs care.' },
          { value: '2', icon: icon.two, title: '2 people', desc: 'Me and one more',
            points: { family: 5, individual: 2 }, why: 'Family Access covers both of you, with room for 2 more members.' },
          { value: '3', icon: icon.three, title: '3 people', desc: 'Me and two more',
            points: { family: 6 }, why: 'Three people are covered under one Family subscription.' },
          { value: '4', icon: icon.family, title: '4 people', desc: 'The full family plan',
            points: { family: 6 }, why: 'All four members are covered for the price of three Individual plans.' }
        ]
      },
      Q_FREQ,
      {
        id: 'extra',
        title: 'Do you also need any of these?',
        subtitle: 'We\'ll tell you upfront what is and isn\'t included.',
        options: [
          { value: 'none', icon: icon.check, title: 'No, just a doctor', desc: 'Urgent and primary care',
            points: { individual: 2, family: 2 }, why: 'Unlimited Urgent / Primary Care covers what you need.' },
          { value: 'meds', icon: icon.pill, title: 'Monthly medicine refills', desc: 'Blood pressure, diabetes…',
            points: { individual: 1, family: 1 } },
          { value: 'specialist', icon: icon.specialist, title: 'Specialist doctors', desc: 'Consults with specialists',
            points: { individual: 1, family: 1 } },
          { value: 'dental', icon: icon.tooth, title: 'Dental care', desc: 'Routine dental visits',
            points: { individual: 1, family: 1 } }
        ]
      },
      {
        id: 'pay',
        title: 'How would you like to pay?',
        subtitle: 'Longer billing periods cost less per month.',
        options: [
          { value: 'monthly', icon: icon.cal1, title: 'Monthly', desc: 'Most flexible',
            points: { individual: 1, family: 1 }, why: 'Monthly billing keeps it flexible.' },
          { value: 'quarterly', icon: icon.cal3, title: 'Every 3 months', desc: 'Save about 17%',
            points: { individual: 2, family: 2 }, why: 'Quarterly billing saves you about 17%.' },
          { value: 'annual', icon: icon.cal12, title: 'Once a year', desc: 'Best price, 2 months free',
            points: { individual: 2, family: 2 }, why: 'Annual billing gives you 2 months free.' },
          { value: 'unsure', icon: icon.question, title: 'Not sure yet', desc: 'Show me all options',
            points: { individual: 1, family: 1 } }
        ]
      }
    ],

    // SME Access A / B / C
    company: [
      {
        id: 'c_meds',
        title: 'Do employees need monthly medicine refills?',
        subtitle: 'For example blood pressure, diabetes, or thyroid medicine.',
        options: [
          { value: 'none', icon: icon.check, title: 'No', desc: 'Nobody needs regular refills',
            points: { smeA: 3 }, why: 'No regular medicine refills are needed.' },
          { value: 'few', icon: icon.pill, title: 'Yes, a few employees', desc: 'Some regular refills',
            points: { smeB: 3, smeC: 1 }, requires: ['chronic'], why: 'Some employees need Chronic Refill, which is included.' },
          { value: 'many', icon: icon.pills, title: 'Yes, many employees', desc: 'Refills are needed often',
            points: { smeB: 4, smeC: 2 }, requires: ['chronic'], why: 'Many employees need Chronic Refill, which is included.' },
          { value: 'unsure', icon: icon.question, title: 'Not sure', desc: 'We haven\'t checked yet',
            points: { smeA: 1, smeB: 2 }, why: 'Chronic Refill is included, so you are covered either way.' }
        ]
      },
      {
        id: 'c_spec',
        title: 'Do employees need specialist doctors?',
        subtitle: 'Consultations beyond urgent and primary care.',
        options: [
          { value: 'no', icon: icon.steth, title: 'No, primary care is enough', desc: 'Urgent and primary care only',
            points: { smeA: 2, smeB: 2 }, why: 'Primary care covers your team\'s needs.' },
          { value: 'sometimes', icon: icon.specialist, title: 'Sometimes', desc: 'Now and then',
            points: { smeB: 1, smeC: 2 }, why: 'Specialty Care is included for when it\'s needed.' },
          { value: 'often', icon: icon.specialist, title: 'Yes, it\'s a must', desc: 'Specialists are essential',
            points: { smeC: 4 }, requires: ['specialty'], why: 'Specialty Care is a must for you, and only Option C includes it.' },
          { value: 'unsure', icon: icon.question, title: 'Not sure', desc: 'Help me decide',
            points: { smeB: 1, smeC: 1 } }
        ]
      },
      {
        id: 'c_dental',
        title: 'Should the plan include dental care?',
        subtitle: 'Routine dental visits for employees.',
        options: [
          { value: 'no', icon: icon.none, title: 'No', desc: 'Dental isn\'t needed',
            points: { smeA: 1, smeB: 1 }, why: 'You don\'t pay for dental you won\'t use.' },
          { value: 'nice', icon: icon.tooth, title: 'Nice to have', desc: 'A good extra benefit',
            points: { smeC: 2 }, why: 'Routine Dental is included as an extra benefit.' },
          { value: 'must', icon: icon.tooth, title: 'Yes, it\'s a must', desc: 'Dental is essential',
            points: { smeC: 4 }, requires: ['dental'], why: 'Routine Dental is a must for you, and only Option C includes it.' },
          { value: 'unsure', icon: icon.question, title: 'Not sure', desc: 'Help me decide',
            points: { smeB: 1 } }
        ]
      },
      {
        id: 'c_priority',
        title: 'What matters most for your company?',
        subtitle: 'Must-haves from earlier always come first.',
        options: [
          { value: 'cost', icon: icon.coin, title: 'Lowest cost per employee', desc: 'Keep the budget tight',
            points: { smeA: 4 }, why: 'It\'s the lowest price per employee that covers your needs.' },
          { value: 'balance', icon: icon.balance, title: 'Good balance', desc: 'Price and coverage',
            points: { smeB: 3 }, why: 'It balances price and coverage.' },
          { value: 'max', icon: icon.shield, title: 'Widest coverage', desc: 'The best employee benefit',
            points: { smeC: 4 }, why: 'It gives your employees the widest coverage.' },
          { value: 'unsure', icon: icon.question, title: 'Recommend for me', desc: 'Based on my answers',
            points: { smeB: 2 } }
        ]
      }
    ],

    // HealPass Student
    student: [
      {
        id: 's_verify',
        title: 'How can you verify you\'re a student?',
        subtitle: 'HealPass needs verification before activation.',
        options: [
          { value: 'id', icon: icon.idcard, title: 'Student ID card', desc: 'A valid university ID',
            points: { student: 3 }, why: 'You can verify with your student ID.' },
          { value: 'email', icon: icon.mail, title: 'University email', desc: 'An active uni email address',
            points: { student: 3 }, why: 'You can verify with your university email.' },
          { value: 'both', icon: icon.both, title: 'Both', desc: 'Student ID and uni email',
            points: { student: 4 }, why: 'You can verify with your student ID or university email.' },
          { value: 'neither', icon: icon.none, title: 'Neither right now', desc: 'I don\'t have them yet',
            points: { individual: 5 }, exclude: ['student'], why: 'Individual Access needs no student verification.' }
        ]
      },
      {
        id: 's_use',
        title: 'What would you use most?',
        subtitle: 'Pick your top need.',
        options: [
          { value: 'doctor', icon: icon.steth, title: 'A doctor when I\'m sick', desc: 'Urgent and primary care',
            points: { student: 2, individual: 2 }, why: 'Unlimited Urgent / Primary Care Consultations are included.' },
          { value: 'specialist', icon: icon.specialist, title: 'Specialist doctors', desc: 'Consults with specialists',
            points: { student: 3 }, why: 'Two specialty teleconsultations per month are included.' },
          { value: 'mental', icon: icon.mind, title: 'Mental health support', desc: 'Psychology or counselling',
            points: { student: 1, individual: 1 } },
          { value: 'discounts', icon: icon.lab, title: 'Lab, scan & medicine discounts', desc: 'Save on tests and medicine',
            points: { student: 3 }, why: 'You get discount access for labs, scans, nutrition and medication.' }
        ]
      },
      Q_FREQ,
      {
        id: 's_meds',
        title: 'Do you take medicine every month?',
        subtitle: 'For example asthma, thyroid, or diabetes medicine.',
        options: [
          { value: 'no', icon: icon.check, title: 'No', desc: 'No regular medicine',
            points: { student: 2, individual: 2 }, why: 'You don\'t need regular medicine refills.' },
          { value: 'yes', icon: icon.pill, title: 'Yes, every month', desc: 'Regular refills',
            points: { student: 1, individual: 1 } },
          { value: 'sometimes', icon: icon.pills, title: 'Sometimes', desc: 'Now and then',
            points: { student: 1, individual: 1 } },
          { value: 'unsure', icon: icon.question, title: 'Not sure', desc: 'I\'ll check later',
            points: { student: 1, individual: 1 } }
        ]
      }
    ]
  };

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

  function fmt(n) { return n.toLocaleString('en-US'); }

  // The question flow for the current Q1 answer (always 5 questions).
  function flow() {
    const who = state.answers.who;
    const path = who === undefined ? 'direct' : Q_WHO.options[who].path;
    return [Q_WHO, ...PATHS[path]];
  }

  // ---------------------------------------------------------------------------
  // QUIZ
  // ---------------------------------------------------------------------------
  function renderQuestion() {
    const questions = flow();
    const q = questions[state.index];
    const total = questions.length;
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

    wrap.classList.remove('is-entering');
    void wrap.offsetWidth;
    wrap.classList.add('is-entering');
  }

  let locked = false;
  function choose(i, btn) {
    if (locked) return;
    locked = true;
    const q = flow()[state.index];
    const changedPath = q.id === 'who' && state.answers.who !== undefined &&
      Q_WHO.options[state.answers.who].path !== Q_WHO.options[i].path;
    if (changedPath) state.answers = {}; // a new path starts fresh
    state.answers[q.id] = i;

    document.querySelectorAll('.hp-option').forEach((el) => {
      el.classList.remove('is-selected');
      el.setAttribute('aria-checked', 'false');
    });
    btn.classList.add('is-selected');
    btn.setAttribute('aria-checked', 'true');

    setTimeout(() => {
      locked = false;
      if (state.index < flow().length - 1) {
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
  function chosen() {
    return flow().map((q) => q.options[state.answers[q.id]]);
  }

  // Value of an answer by question id, or null when not on this path.
  function ans(id) {
    const q = flow().find((x) => x.id === id);
    return q && state.answers[id] !== undefined ? q.options[state.answers[id]].value : null;
  }
  function answerOf(id) { return { value: ans(id) }; }

  function score() {
    const picks = chosen();
    const totals = Object.fromEntries(BUNDLE_KEYS.map((k) => [k, 0]));
    const requires = new Set();
    const excluded = new Set();

    picks.forEach((opt) => {
      Object.entries(opt.points).forEach(([k, v]) => { totals[k] += v; });
      (opt.requires || []).forEach((f) => requires.add(f));
      (opt.exclude || []).forEach((k) => excluded.add(k));
    });

    const base = ELIGIBLE[ans('who')];
    let eligible = base.filter((k) => !excluded.has(k));
    // Must-haves: keep only plans that include every required feature
    const meetsNeeds = eligible.filter((k) => !FEATURES[k] || [...requires].every((f) => FEATURES[k].includes(f)));
    if (meetsNeeds.length) eligible = meetsNeeds;

    const ranked = [...eligible].sort((a, b) => totals[b] - totals[a] || base.indexOf(a) - base.indexOf(b));
    const best = ranked[0];

    // Answers that pointed to the winner (gave it the top points among eligible plans)
    let matches = 0;
    const reasons = [];
    picks.forEach((opt) => {
      const mine = opt.points[best] || 0;
      const top = Math.max(...eligible.map((k) => opt.points[k] || 0));
      if (mine > 0 && mine === top) {
        matches += 1;
        const why = typeof opt.why === 'function' ? opt.why(best) : opt.why;
        if (why) reasons.push(why);
      }
    });

    return { totals, best, ranked, matches, reasons, total: picks.length };
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
    const notes = [];
    const extra = ans('extra');

    if (key === 'individual' || key === 'family') {
      if (extra === 'meds') notes.push('Chronic Refill isn\'t part of this plan. It\'s available pay-per-use at 525 EGP per consultation.');
      if (extra === 'specialist') notes.push('Specialty Care is available pay-per-use at 525 EGP per consultation.');
      if (extra === 'dental') notes.push('Routine Dental isn\'t included in Individual or Family Access.');
    }
    if (key === 'family' && ans('size') === '2') {
      notes.push('For 2 people, two separate Individual Access plans would cost 500 EGP a month. Family Access lets you add up to 2 more members at no extra cost.');
    }
    if (key === 'individual' && ans('s_verify') === 'neither') {
      notes.push('HealPass needs a student ID or university email. Once you have one, you can switch to HealPass for 200 EGP a month.');
    }
    if (key === 'individual' && ans('s_use') === 'mental') {
      notes.push('Mental health sessions are pay-per-use: psychiatry 750 EGP, psychology 600 EGP per session.');
    }
    if (key === 'student') {
      if (ans('s_use') === 'mental') notes.push('Mental health sessions are pay-per-use: psychiatry 750 EGP, psychology 600 EGP per session.');
      if (ans('s_meds') === 'yes' || ans('s_meds') === 'sometimes') notes.push('Chronic Refill is available pay-per-use at 525 EGP per consultation.');
    }
    const mustHave = ans('c_meds') === 'few' || ans('c_meds') === 'many' || ans('c_spec') === 'often' || ans('c_dental') === 'must';
    if (key !== 'smeA' && ans('c_priority') === 'cost' && mustHave) {
      notes.push(`You chose lowest cost, but Option A doesn't cover your must-haves. Option ${BUNDLES[key].option} is the lowest-priced option that does.`);
    }
    if (key === 'smeA' && ans('c_meds') === 'unsure') notes.push('If employees need refills later, Option B adds Chronic Refill for 15 EGP more per employee.');
    if ((key === 'smeA' || key === 'smeB') && (ans('c_spec') === 'sometimes' || ans('c_dental') === 'nice')) {
      notes.push(`Option C adds Specialty Care and Routine Dental for ${120 - BUNDLES[key].price} EGP more per employee.`);
    }
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
    // Show the score only when it's convincing; a must-have can decide the plan on its own.
    const scoreBlock = result.matches >= 3 ? `
        <div class="hp-why__score">
          <strong>${result.matches}<span>/${result.total}</span></strong>
          <small>answers point to this plan</small>
        </div>` : `
        <div class="hp-why__score">
          <strong class="hp-why__label">Why</strong>
          <small>this plan fits you</small>
        </div>`;
    return `
      <div class="hp-why__inner">
        ${scoreBlock}
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
