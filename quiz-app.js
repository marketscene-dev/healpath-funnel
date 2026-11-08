/**
 * HealPath Quiz Funnel Engine
 * Brand: HealPath (Healthcare)
 * Zero Emojis · Strict Clinical & Design System Compliance
 */

document.addEventListener('DOMContentLoaded', function () {
  
  // --- STATE MANAGEMENT ----------------------------------------------
  const state = {
    currentStep: 'intro', // 'intro' | 'quiz' | 'loading' | 'results'
    currentQuestionIndex: 0,
    answers: {},
    scores: {
      chronic: 0,
      student: 0,
      family: 0,
      corporate: 0,
      general: 0
    }
  };

  // --- 6 CLINICAL ASSESSMENT QUESTIONS --------------------------------
  const questions = [
    {
      id: 'beneficiary',
      kicker: 'QUESTION 1 OF 6',
      title: 'Who is this medical care plan for?',
      subtitle: 'Select who will be receiving care.',
      options: [
        {
          title: 'Myself (Individual)',
          desc: 'Primary care, doctor visits, and personal health.',
          weight: { general: 2, chronic: 1 }
        },
        {
          title: 'My Family',
          desc: 'Comprehensive coverage for spouse and children.',
          weight: { family: 4, general: 1 }
        },
        {
          title: 'University Student',
          desc: 'Affordable student plan with lab and scan discounts.',
          weight: { student: 5 }
        },
        {
          title: 'Company / Employees',
          desc: 'Workplace health coverage and corporate clinics.',
          weight: { corporate: 5 }
        }
      ]
    },
    {
      id: 'primary_goal',
      kicker: 'QUESTION 2 OF 6',
      title: 'What is your main health priority?',
      subtitle: 'Choose your primary care goal.',
      options: [
        {
          title: 'Chronic Care & Medication Refills',
          desc: 'Ongoing management and prescription refills.',
          weight: { chronic: 4 }
        },
        {
          title: 'Fast On-Demand Doctor Visits',
          desc: '24/7 tele-triage with appointments in under 1 hour.',
          weight: { general: 3, family: 1 }
        },
        {
          title: 'Routine Checkups & Wellness',
          desc: 'Preventative screening and lifestyle coaching.',
          weight: { general: 2, family: 2 }
        },
        {
          title: 'Student Care & Test Discounts',
          desc: 'Low-cost doctor visits, mental health, and labs.',
          weight: { student: 4 }
        }
      ]
    },
    {
      id: 'chronic_needs',
      kicker: 'QUESTION 3 OF 6',
      title: 'Do you take continuous medications?',
      subtitle: 'For conditions like blood pressure, diabetes, or thyroid.',
      options: [
        {
          title: 'Yes, Regular Refills Needed',
          desc: 'Prescription renewal with pharmacist oversight.',
          weight: { chronic: 4 }
        },
        {
          title: 'Yes, Multiple Conditions',
          desc: 'Quarterly doctor consultations and care coordination.',
          weight: { chronic: 5 }
        },
        {
          title: 'No Regular Medication',
          desc: 'General primary care and urgent visits only.',
          weight: { general: 3, family: 2 }
        },
        {
          title: 'As-Needed / Seasonal Care',
          desc: 'Occasional consultations and health advice.',
          weight: { student: 3 }
        }
      ]
    },
    {
      id: 'delivery_mode',
      kicker: 'QUESTION 4 OF 6',
      title: 'How do you want to see your doctor?',
      subtitle: 'Select your preferred consultation method.',
      options: [
        {
          title: 'Hybrid (Online + Clinic Visits)',
          desc: '24/7 tele-triage plus visits to Maadi or New Cairo.',
          weight: { general: 3, chronic: 2, family: 2 }
        },
        {
          title: '100% Online Consultations',
          desc: 'Fast video and phone calls from home.',
          weight: { general: 3, student: 2 }
        },
        {
          title: 'In-Person Clinic Visits',
          desc: 'Direct consultations at our Cairo medical clinics.',
          weight: { family: 2, chronic: 2 }
        },
        {
          title: 'Workplace Doctor on Site',
          desc: 'Dedicated on-site clinic for your organization.',
          weight: { corporate: 4 }
        }
      ]
    },
    {
      id: 'coordination',
      kicker: 'QUESTION 5 OF 6',
      title: 'Do you need care coordination?',
      subtitle: 'Connecting doctors, clinical pharmacists, and specialists.',
      options: [
        {
          title: 'Doctors + Clinical Pharmacists',
          desc: 'Coordinated chronic disease management.',
          weight: { chronic: 4 }
        },
        {
          title: 'Family Physician Oversight',
          desc: 'One dedicated doctor managing all your care.',
          weight: { family: 3, general: 2 }
        },
        {
          title: 'Student Wellness Network',
          desc: 'Doctor visits plus discounted therapy and scans.',
          weight: { student: 4 }
        },
        {
          title: 'Corporate Health Dashboard',
          desc: 'Employee health analytics and utilization reports.',
          weight: { corporate: 4 }
        }
      ]
    },
    {
      id: 'timeline',
      kicker: 'QUESTION 6 OF 6',
      title: 'When do you want your plan to start?',
      subtitle: 'Select your ideal start date.',
      options: [
        {
          title: 'Immediately',
          desc: 'Need a doctor consultation or refill this week.',
          weight: { general: 1, chronic: 1 }
        },
        {
          title: 'Within the Next Month',
          desc: 'Setting up upcoming healthcare coverage.',
          weight: { general: 1, family: 1 }
        },
        {
          title: 'Just Comparing Options',
          desc: 'Exploring healthcare plans for the future.',
          weight: { student: 1, corporate: 1 }
        }
      ]
    }
  ];

  // --- BUNDLES CATALOG (MATCHED TO HEALPATH.CARE) ----------------------
  const bundles = {
    chronic_ccm: {
      id: 'chronic_ccm',
      title: 'Chronic Care Management & Refill Program Bundle',
      tagline: 'Comprehensive disease management following CMS Medicare clinical guidelines',
      matchScore: '98% Clinical Match',
      checkoutSlug: 'ccm-refill-annual',
      inclusions: [
        'Employed Egyptian Board-Certified Family Physician oversight',
        'Quarterly comprehensive clinical physician consultations',
        'Monthly clinical pharmacist follow-up calls & medication reviews',
        'Automated chronic prescription renewals & delivery coordination',
        '24/7 tele-triage access with guidance within one hour',
        'Unified Electronic Health Record (EHR) tracking across visits'
      ],
      priceDisplay: 'Comprehensive Annual Plan',
      priceSub: 'Includes physician consultations & clinical pharmacist refill oversight',
      altReason: 'Recommended based on your chronic care and continuous prescription needs.'
    },
    healpass_student: {
      id: 'healpass_student',
      title: 'HealPass Student Healthcare Program',
      tagline: 'Affordable primary care and diagnostic savings tailored for academic life',
      matchScore: '97% Clinical Match',
      checkoutSlug: 'healpass-student-monthly',
      inclusions: [
        'Unlimited virtual consultations with Board-Certified family doctors',
        'Rapid appointment scheduling available within one hour',
        'Subsidized mental wellness and psychology counseling sessions',
        'Discounted clinical nutrition consultations',
        'Exclusive student discounts on diagnostic labs and radiology scans',
        'Prescription discounts at accredited partner pharmacy networks'
      ],
      priceDisplay: 'Affordable Student Subscription',
      priceSub: 'Monthly or semester subscription with zero hidden fees',
      altReason: 'Recommended based on student profile and priority on affordable diagnostic access.'
    },
    family_primary: {
      id: 'family_primary',
      title: 'Comprehensive Individual & Family Primary Care Plan',
      tagline: 'Continuous, proactive healthcare built on trust, transparency, and rapid access',
      matchScore: '96% Clinical Match',
      checkoutSlug: 'family-primary-plan',
      inclusions: [
        'Direct access to employed Egyptian Board-Certified family physicians',
        '24/7 tele-triage guidance for urgent and non-emergent symptoms',
        'Virtual consultations guaranteed within one hour',
        'Hybrid access: Virtual appointments or visits at Maadi / New Cairo clinics',
        'Direct coordination with certified medical specialists when indicated',
        'Secure patient portal with centralized family medical records'
      ],
      priceDisplay: 'Primary Care Membership',
      priceSub: 'Annual or quarterly membership with flexible payment options',
      altReason: 'Recommended for continuous preventative and urgent primary healthcare access.'
    },
    corporate_care: {
      id: 'corporate_care',
      title: 'Corporate On-Site & Employee Health Solution',
      tagline: 'Measurable workforce health programs delivering documented cost savings up to 45%',
      matchScore: '99% Organizational Match',
      checkoutSlug: 'corporate-demo',
      inclusions: [
        'Doctor on-site visits scheduled directly at corporate facilities',
        '24/7 workforce tele-triage reducing ER visits and absenteeism',
        'Dedicated corporate account manager and executive health reporting',
        'Real-time employer health dashboards for program utilization',
        'Quarterly employee wellness, nutrition, and ergonomic workshops',
        'Integrated chronic refill coordination for enrolled team members'
      ],
      priceDisplay: 'Custom Corporate Plan',
      priceSub: 'Tailored per workforce size with measurable ROI reporting',
      altReason: 'Recommended for workforce management, employee coverage, and corporate clinics.'
    }
  };

  // --- DOM ELEMENT REFERENCES -----------------------------------------
  const stepIntro = document.getElementById('step-intro');
  const stepQuiz = document.getElementById('step-quiz');
  const stepLoading = document.getElementById('step-loading');
  const stepResults = document.getElementById('step-results');

  const btnStartQuiz = document.getElementById('btn-start-quiz');
  const btnQuizBack = document.getElementById('btn-quiz-back');
  const btnRetakeQuiz = document.getElementById('btn-retake-quiz');

  const questionKicker = document.getElementById('question-kicker');
  const questionTitle = document.getElementById('question-title');
  const questionSubtitle = document.getElementById('question-subtitle');
  const optionsContainer = document.getElementById('options-container');

  const questionCounter = document.getElementById('quiz-question-counter');
  const percentageLabel = document.getElementById('quiz-percentage');
  const progressBarFill = document.getElementById('quiz-progress-bar-fill');

  const primaryBundleCard = document.getElementById('primary-bundle-card');
  const secondaryBundlesContainer = document.getElementById('secondary-bundles-container');

  // --- VIEW TRANSITION UTILITY ----------------------------------------
  function showView(viewId) {
    [stepIntro, stepQuiz, stepLoading, stepResults].forEach(v => {
      v.classList.remove('active');
      v.style.display = 'none';
    });

    const activeView = document.getElementById(viewId);
    if (activeView) {
      activeView.style.display = 'block';
      setTimeout(() => {
        activeView.classList.add('active');
        window.scrollTo({ top: activeView.offsetTop - 40, behavior: 'smooth' });
      }, 10);
    }
  }

  // --- QUESTION RENDERING ---------------------------------------------
  function renderQuestion(index) {
    const q = questions[index];
    if (!q) return;

    questionKicker.textContent = q.kicker;
    questionTitle.textContent = q.title;
    questionSubtitle.textContent = q.subtitle;

    // Update Progress
    const total = questions.length;
    const progressPercent = Math.round(((index + 1) / total) * 100);
    questionCounter.textContent = `Question ${index + 1} of ${total}`;
    percentageLabel.textContent = `${progressPercent}% Complete`;
    progressBarFill.style.width = `${progressPercent}%`;

    // Toggle Back Button Visibility
    if (index > 0) {
      btnQuizBack.style.visibility = 'visible';
    } else {
      btnQuizBack.style.visibility = 'hidden';
    }

    // Render Options with WAI-ARIA and Keyboard Support
    optionsContainer.innerHTML = '';
    const selectedOptionIndex = state.answers[q.id];

    q.options.forEach((opt, optIdx) => {
      const card = document.createElement('div');
      const isSelected = selectedOptionIndex === optIdx;
      card.className = 'hp-option-card' + (isSelected ? ' selected' : '');
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'radio');
      card.setAttribute('aria-checked', isSelected ? 'true' : 'false');
      card.setAttribute('aria-label', `${opt.title}: ${opt.desc}`);

      card.innerHTML = `
        <div class="hp-option-content">
          <span class="hp-option-title">${opt.title}</span>
          <span class="hp-option-desc">${opt.desc}</span>
        </div>
        <div class="hp-option-indicator" aria-hidden="true"></div>
      `;

      // Click & Keyboard (Enter / Space) listeners
      card.addEventListener('click', () => {
        selectOption(index, optIdx);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectOption(index, optIdx);
        }
      });

      optionsContainer.appendChild(card);
    });
  }

  // --- OPTION SELECTION LOGIC ----------------------------------------
  function selectOption(qIndex, optIndex) {
    const q = questions[qIndex];
    state.answers[q.id] = optIndex;

    // Apply weights to score tallies
    const selectedOpt = q.options[optIndex];
    if (selectedOpt.weight) {
      for (const [key, val] of Object.entries(selectedOpt.weight)) {
        state.scores[key] = (state.scores[key] || 0) + val;
      }
    }

    // Advance to next question or loading screen
    if (qIndex + 1 < questions.length) {
      state.currentQuestionIndex = qIndex + 1;
      renderQuestion(state.currentQuestionIndex);
    } else {
      triggerLoadingTransition();
    }
  }

  // --- LOADING INTERSTITIAL TRANSITION --------------------------------
  function triggerLoadingTransition() {
    showView('step-loading');

    const chk1 = document.getElementById('chk-1');
    const chk2 = document.getElementById('chk-2');
    const chk3 = document.getElementById('chk-3');

    chk1.classList.add('active');
    chk2.classList.remove('active');
    chk3.classList.remove('active');

    setTimeout(() => {
      chk2.classList.add('active');
    }, 600);

    setTimeout(() => {
      chk3.classList.add('active');
    }, 1200);

    setTimeout(() => {
      evaluateAndRenderResults();
      showView('step-results');
    }, 1800);
  }

  // --- RECOMMENDATION SCORING LOGIC -----------------------------------
  function evaluateAndRenderResults() {
    let primaryKey = 'family_primary';
    const s = state.scores;

    // Determination rules
    if (s.corporate >= 4) {
      primaryKey = 'corporate_care';
    } else if (s.student >= 5) {
      primaryKey = 'healpass_student';
    } else if (s.chronic >= 4) {
      primaryKey = 'chronic_ccm';
    } else if (s.family >= s.general) {
      primaryKey = 'family_primary';
    } else {
      primaryKey = 'family_primary';
    }

    const primaryBundle = bundles[primaryKey];

    // Determine 2 secondary alternatives
    const secondaryKeys = Object.keys(bundles).filter(k => k !== primaryKey).slice(0, 2);

    // Build Checkout Links
    // Base checkout url currently on their portal: http://patient.healpath.care
    const checkoutBaseUrl = 'http://patient.healpath.care';
    const primaryCheckoutUrl = `${checkoutBaseUrl}?plan=${encodeURIComponent(primaryBundle.checkoutSlug)}&ref=quiz_assessment`;

    // WhatsApp Direct Care Coordinator URL with pre-filled bundle context
    const whatsappText = encodeURIComponent(
      `Hello HealPath Care Team, I completed the Medical Plan Assessment on your website. My recommended plan is the "${primaryBundle.title}". I would like to confirm my activation details.`
    );
    const whatsappUrl = `https://wa.me/201019003440?text=${whatsappText}`;

    // Render Primary Bundle Card
    primaryBundleCard.innerHTML = `
      <div class="hp-bundle-top-tag">Top Recommended Care Plan</div>
      <div class="hp-bundle-header-row">
        <div class="hp-bundle-title-col">
          <h3>${primaryBundle.title}</h3>
          <p class="hp-bundle-tagline">${primaryBundle.tagline}</p>
        </div>
        <div class="hp-bundle-match-pill">${primaryBundle.matchScore}</div>
      </div>

      <div class="hp-bundle-inclusions">
        <span class="hp-bundle-inclusions-title">Plan Benefits &amp; Clinical Inclusions</span>
        <ul class="hp-inclusion-list">
          ${primaryBundle.inclusions.map(inc => `
            <li class="hp-inclusion-item">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>${inc}</span>
            </li>
          `).join('')}
        </ul>
      </div>

      <div class="hp-bundle-action-row">
        <div class="hp-pricing-col">
          <span class="hp-price-label">Selected Solution</span>
          <span class="hp-price-val">${primaryBundle.priceDisplay}</span>
          <span class="hp-price-sub">${primaryBundle.priceSub}</span>
        </div>
        <div class="hp-cta-group">
          <a href="${primaryCheckoutUrl}" target="_blank" rel="noopener" class="hp-btn-primary">
            PROCEED TO SECURE REGISTRATION
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </a>
          <a href="${whatsappUrl}" target="_blank" rel="noopener" class="hp-btn-whatsapp">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            CONFIRM ON WHATSAPP
          </a>
        </div>
      </div>
    `;

    // Render Secondary Bundles
    secondaryBundlesContainer.innerHTML = secondaryKeys.map(k => {
      const alt = bundles[k];
      const altCheckout = `${checkoutBaseUrl}?plan=${encodeURIComponent(alt.checkoutSlug)}&ref=quiz_alt`;
      return `
        <div class="hp-alt-card">
          <div>
            <h4>${alt.title}</h4>
            <p>${alt.tagline}</p>
          </div>
          <div class="hp-alt-action">
            <span class="hp-alt-price">${alt.priceDisplay}</span>
            <a href="${altCheckout}" target="_blank" rel="noopener" class="hp-alt-btn">
              VIEW PLAN DETAILS
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </a>
          </div>
        </div>
      `;
    }).join('');
  }

  // --- EVENT LISTENERS ------------------------------------------------
  btnStartQuiz.addEventListener('click', function () {
    state.currentQuestionIndex = 0;
    renderQuestion(0);
    showView('step-quiz');
  });

  btnQuizBack.addEventListener('click', function () {
    if (state.currentQuestionIndex > 0) {
      state.currentQuestionIndex -= 1;
      renderQuestion(state.currentQuestionIndex);
    }
  });

  btnRetakeQuiz.addEventListener('click', function () {
    state.answers = {};
    state.scores = { chronic: 0, student: 0, family: 0, corporate: 0, general: 0 };
    state.currentQuestionIndex = 0;
    showView('step-intro');
  });

});
