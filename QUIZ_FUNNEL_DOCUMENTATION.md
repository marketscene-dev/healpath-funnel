# HealPath Quiz Funnel — System Documentation & Architecture

## Overview
This quiz funnel was developed specifically for **HealPath** ([healpath.care](https://healpath.care/)), adhering strictly to their corporate design system, typography (`Plus Jakarta Sans`), color scheme, clinical copywriting tone, and **zero-emoji rule**.

The funnel guides prospective patients and organizations through an intake assessment to match them with the optimal primary care or disease management bundle, directing them straight into HealPath's secure patient registration and checkout workflow.

---

## 1. Funnel Flow & User Experience

```
[ Step 0: Explainer Landing Page ]
          │
          ▼ (User Clicks: "Start Your Care Assessment")
[ Step 1: Beneficiary Profile (Individual, Family, Student, Corporate) ]
          │
          ▼
[ Step 2: Clinical Objectives (Chronic, Urgent Access, Wellness, Student) ]
          │
          ▼
[ Step 3: Medication & Condition Status (Refills, Coordination, None) ]
          │
          ▼
[ Step 4: Care Delivery Channel (Hybrid, Digital-First, Clinic, Workplace) ]
          │
          ▼
[ Step 5: Multidisciplinary Coordination (Physicians + Pharmacists) ]
          │
          ▼
[ Step 6: Activation Timeline (Immediate, 30 Days, Upcoming Semester) ]
          │
          ▼
[ Interstitial: Clinical Profile Matching Animation (CMS Guidelines Engine) ]
          │
          ▼
[ Step 7: Customized Results & Recommended Bundle ]
   ├── Primary Match (e.g. 98% Match Score + Benefit Inclusions)
   ├── Direct Secure Registration CTA -> http://patient.healpath.care
   ├── Instant WhatsApp Care Coordinator CTA -> https://wa.me/201019003440
   └── Secondary Alternative Bundles
```

---

## 2. The 6 Assessment Questions & Clinical Logic

| # | Question Title | Clinical Rationale & Intent | Primary Outcome Mapping |
| :--- | :--- | :--- | :--- |
| **Q1** | **Who is this medical care plan primarily for?** | Segregates user into Individual, Family, Student, or Corporate workflows. | Directs weights to Student, Corporate, Family, or General. |
| **Q2** | **What is your primary healthcare objective?** | Identifies whether the driver is urgent tele-triage, chronic illness, routine preventative wellness, or student budget. | Chronic Care vs. HealPass vs. General Primary Care. |
| **Q3** | **Do you manage recurring conditions requiring continuous medication?** | Evaluates need for clinical pharmacist oversight and automated prescription renewals. | Strongly triggers Chronic Refill / CCM Program. |
| **Q4** | **How do you prefer to receive medical consultations?** | Assesses geography and mode preference (Hybrid Cairo clinics vs. purely digital vs. on-site workplace). | Matches clinic location capacity (Maadi & New Cairo). |
| **Q5** | **Do you require coordination between doctors and specialists?** | Verifies multidisciplinary EHR needs (pharmacists + family physicians + psychologists). | Highlights comprehensive EHR and care team coordination. |
| **Q6** | **When would you like your medical care plan to begin?** | Gauges intent level and urgency (Immediate < 1 hr access vs. planning). | Sets expectation of instant activation upon checkout. |

---

## 3. Recommended Bundles Catalog

### 1. Chronic Care Management (CCM) & Refill Program Bundle
* **Target**: Patients managing hypertension, diabetes, thyroid disorders, or requiring routine refills.
* **Clinical Protocol**: Follows CMS Medicare Chronic Care Management Guidelines.
* **Key Inclusions**:
  * Employed Egyptian Board-Certified Family Physician oversight.
  * Quarterly clinical physician consultations.
  * Monthly clinical pharmacist follow-up calls & medication reviews.
  * Automated prescription renewals & doorstep delivery coordination.
  * 24/7 tele-triage access with guidance within 1 hour.
* **Checkout Slug**: `ccm-refill-annual`

### 2. HealPass Student Healthcare Program
* **Target**: University and college students in Egypt.
* **Key Inclusions**:
  * Unlimited virtual consultations with Board-Certified family physicians.
  * Subsidized mental health & psychology sessions.
  * Discounted clinical nutrition consultations.
  * Exclusive student discounts on diagnostic labs and radiology scans.
  * Partner pharmacy discounts with zero hidden charges.
* **Checkout Slug**: `healpass-student-monthly`

### 3. Comprehensive Individual & Family Primary Care Plan
* **Target**: Individuals and families seeking proactive, continuous primary healthcare.
* **Key Inclusions**:
  * Direct access to employed Board-Certified physicians.
  * 24/7 tele-triage for acute and non-emergent concerns.
  * Virtual appointments guaranteed within 1 hour.
  * Hybrid access: Virtual or physical visits at Maadi HQ / New Cairo.
  * Centralized family health records in the secure patient portal.
* **Checkout Slug**: `family-primary-plan`

### 4. Corporate On-Site & Employee Health Solution
* **Target**: Employers, HR departments, and corporate workforces.
* **Key Inclusions**:
  * Doctor on-site visits scheduled at workplace facilities.
  * Documented up to 45% chronic care cost savings and reduced absenteeism.
  * Real-time employer dashboard for utilization and claims mitigation.
  * Dedicated corporate account manager and executive health reporting.
* **Checkout Slug**: `corporate-demo`

---

## 4. Checkout & Patient Portal Integration

The primary call-to-action buttons dynamically construct secure links that lead into HealPath's patient registration portal:
```javascript
// Base checkout url:
const checkoutBaseUrl = 'http://patient.healpath.care';

// Example Generated Checkout Link:
// http://patient.healpath.care?plan=ccm-refill-annual&ref=quiz_assessment
```

Additionally, a secondary button offers direct access to the **HealPath Care Coordinator team via WhatsApp**:
```javascript
// Pre-filled WhatsApp link:
// https://wa.me/201019003440?text=Hello%20HealPath...
```

---

## 5. Strict Brand & Style Rules Followed

1. **Typography**: Google Font **`Plus Jakarta Sans`** loaded at weights 400, 500, 600, 700, and 800.
2. **Color Palette**:
   * Header / Dark Sections: `#00003F`
   * Headings / Primary Brand: `#0D1B4C`
   * Primary Dark / Card Elements: `#0D47A1`
   * Action Blue / Buttons: `#3B82F6` & `#1E40AF`
   * Accent Underline: `linear-gradient(135deg, #2196F3, #1565C0)`
   * Verified / Success: `#10B981` / `#A1F1C6`
   * Surfaces: `#FFFFFF`, `#F8FAFC`, `#E2E8F0`
3. **Zero-Emoji Compliance**: Verified by automated regex check. No pictographs, emoticons, or decorative unicode icons are used in copy. All iconography uses lightweight, accessible SVG vectors.
4. **Copywriting**: High-authority, clinical, transparent, and compliant with Egyptian health standards (GAHAR, URAC, HIPAA).

---

## 6. How to Run & Deploy

### Quick Local Preview
To preview locally on your computer:
```bash
# In terminal inside "/Users/test/Downloads/Healpath Funnel":
python3 -m http.server 8080
# Then open http://localhost:8080 in your browser
```

### Static Hosting (Vercel / Cloudflare Pages / Netlify)
Push this directory to a repository or drag-and-drop the files (`index.html`, `quiz-styles.css`, `quiz-app.js`, `healpath-theme.css`) to Cloudflare Pages or Netlify for instant deployment.

### Embedding into WordPress / Elementor
You can embed this funnel directly into WordPress using an `<iframe>` or by pasting the HTML/CSS/JS into a custom HTML block or template on [healpath.care](https://healpath.care/).
