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
      kicker: 'STEP 1: BENEFICIARY PROFILE',
      title: 'Who is this medical care plan primarily for?',
      subtitle: 'Select the option that reflects the primary person or group seeking care.',
      options: [
        {
          title: 'Myself (Individual)',
          desc: 'Personal primary care, tele-triage, and continuous medical oversight.',
          weight: { general: 2, chronic: 1 }
        },
        {
          title: 'My Family (Spouse & Children)',
          desc: 'Unified household coverage with pediatric and family doctor access.',
          weight: { family: 4, general: 1 }
        },
        {
          title: 'University or College Student',
          desc: 'Affordable academic health coverage with labs, scans, and therapy access.',
          weight: { student: 5 }
        },
        {
          title: 'Business or Employee Workforce',
          desc: 'Corporate wellness programs, on-site doctors, and health dashboards.',
          weight: { corporate: 5 }
        }
      ]
    },
    {
      id: 'primary_goal',
      kicker: 'STEP 2: CLINICAL OBJECTIVES',
      title: 'What is your primary healthcare objective?',
      subtitle: 'Identify the main clinical outcome you wish to achieve.',
      options: [
        {
          title: 'Managing Chronic Conditions & Routine Refills',
          desc: 'Ongoing management for conditions like diabetes, hypertension, or thyroid.',
          weight: { chronic: 4 }
        },
        {
          title: 'Immediate On-Demand Doctor Consultations (< 1 Hour)',
          desc: 'Fast 24/7 tele-triage and virtual visits for acute symptoms.',
          weight: { general: 3, family: 1 }
        },
        {
          title: 'Preventative Wellness & Lifestyle Oversight',
          desc: 'Routine screening, nutrition planning, and holistic coaching.',
          weight: { general: 2, family: 2 }
        },
        {
          title: 'Affordable Student Care with Diagnostic Discounts',
          desc: 'Unlimited primary care access with discounts on labs, scans, and medications.',
          weight: { student: 4 }
        }
      ]
    },
    {
      id: 'chronic_needs',
      kicker: 'STEP 3: MEDICATION & CONDITION MANAGEMENT',
      title: 'Do you manage recurring conditions requiring continuous medication?',
      subtitle: 'HealPath connects clinical pharmacists and physicians for refill safety.',
      options: [
        {
          title: 'Yes, Requires Regular Medication Refills',
          desc: 'Need continuous prescription renewal, home delivery, and pharmacist reviews.',
          weight: { chronic: 4 }
        },
        {
          title: 'Yes, Active Chronic Conditions Requiring Care Coordination',
          desc: 'Quarterly doctor consultations and monthly clinical pharmacist monitoring.',
          weight: { chronic: 5 }
        },
        {
          title: 'No Chronic Conditions',
          desc: 'Focused on urgent symptom evaluation and seasonal preventative care.',
          weight: { general: 3, family: 2 }
        },
        {
          title: 'Student Basic Wellness Inquiries',
          desc: 'General health guidance, academic stress support, and routine checks.',
          weight: { student: 3 }
        }
      ]
    },
    {
      id: 'delivery_mode',
      kicker: 'STEP 4: CARE DELIVERY PREFERENCE',
      title: 'How do you prefer to receive medical consultations?',
      subtitle: 'Choose your desired combination of virtual and on-site clinical care.',
      options: [
        {
          title: 'Hybrid Care: Virtual Tele-Triage with Clinic Visits',
          desc: 'Fast digital access plus in-person consultations at Maadi or New Cairo.',
          weight: { general: 3, chronic: 2, family: 2 }
        },
        {
          title: 'Digital-First: Fast 24/7 Teleconsultations',
          desc: 'Immediate video and tele-triage appointments from the comfort of home.',
          weight: { general: 3, student: 2 }
        },
        {
          title: 'Physical Clinic Focus: Direct In-Person Care',
          desc: 'Prefer visits to our main clinics at 43 Al Gazaer Square, Maadi or New Cairo.',
          weight: { family: 2, chronic: 2 }
        },
        {
          title: 'Workplace Clinic: On-Site Corporate Medical Staff',
          desc: 'Doctor on-site visits directly at corporate offices.',
          weight: { corporate: 4 }
        }
      ]
    },
    {
      id: 'coordination',
      kicker: 'STEP 5: MULTIDISCIPLINARY CARE COORDINATION',
      title: 'Do you require coordination between doctors and specialists?',
      subtitle: 'Our proprietary EHR unifies family doctors, consultants, and pharmacists.',
      options: [
        {
          title: 'Full Multidisciplinary Coordination (Physicians + Pharmacists)',
          desc: 'Structured chronic care plan following CMS clinical guidelines.',
          weight: { chronic: 4 }
        },
        {
          title: 'Family Physician Care with Specialty Referrals on Demand',
          desc: 'Family doctor serves as personal coordinator for all medical needs.',
          weight: { family: 3, general: 2 }
        },
        {
          title: 'Student Health Network with Mental Wellness & Nutrition',
          desc: 'Subsidized access to psychologists, nutritionists, and lab partners.',
          weight: { student: 4 }
        },
        {
          title: 'Corporate Employee Health Analytics & Coordination',
          desc: 'Centralized health reporting and employer utilization dashboards.',
          weight: { corporate: 4 }
        }
      ]
    },
    {
      id: 'timeline',
      kicker: 'STEP 6: ACTIVATION TIMELINE',
      title: 'When would you like your medical care plan to begin?',
      subtitle: 'All HealPath subscriptions activate immediately upon registration.',
      options: [
        {
          title: 'Immediate Care (Need consultation or refill this week)',
          desc: 'Access employed Board-Certified physicians within one hour of signup.',
          weight: { general: 1, chronic: 1 }
        },
        {
          title: 'Within the Next 30 Days',
          desc: 'Setting up structured healthcare coverage for the coming month.',
          weight: { general: 1, family: 1 }
        },
        {
          title: 'Planning for Upcoming Semester or Policy Renewal',
          desc: 'Evaluating healthcare options for institutional or academic cycles.',
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
