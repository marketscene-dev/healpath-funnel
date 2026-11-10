# HealPath Brand Identity & Design System Guidelines

> **Source Reference**: [healpath.care](https://healpath.care/)  
> **Brand Name**: HealPath (Healthcare)  
> **Tagline**: *"We Don't Heal Bodies — We Heal Paths"*  
> **Mission**: *"Empowering Lives through Primary Care"*  
> **Vision**: *"Revolutionizing Primary Care for a Digital Era"*

---

## 1. Brand Overview & Value Proposition

HealPath is an Egyptian digital healthcare platform redefining primary and continuous healthcare. Unlike transactional telemedicine platforms, HealPath focuses on long-term patient relationships, proactive disease management, and transparent care coordination across Egypt and the MENA region.

### Core Value Pillars
1. **Employed Physicians, Not Gig Workers**: Care is delivered directly by employed Egyptian Board-Certified family medicine physicians and consultants.
2. **Hybrid Virtual & On-Site Care**: Seamlessly connects 24/7 digital tele-triage, virtual consultations (under 1 hour), and physical clinical centers (Maadi HQ, New Cairo, and upcoming branches).
3. **Evidence-Based Guidelines**: Follows CMS Medicare Chronic Care Management (CCM), AAFP (American Academy of Family Physicians), and AAPC standards.
4. **Accreditation & Compliance**: Ongoing GAHAR (Egypt's General Authority for Healthcare Accreditation and Regulation), URAC (Global Telehealth), and HIPAA alignment.
5. **Measurable Outcomes**: Over 80,000 annual consultations delivered, up to 45% chronic care cost savings, and 95%+ patient satisfaction.

---

## 2. Color Palette & Design Tokens

### Primary Brand Colors
| Token Name | Hex Code | RGB | Role / Usage |
| :--- | :--- | :--- | :--- |
| `--hp-primary-navy` | `#00003F` | `rgb(0, 0, 63)` | Deep brand navy; header bars, deep footers, high-contrast dark sections |
| `--hp-primary-blue` | `#0D1B4C` | `rgb(13, 27, 76)` | Primary brand dark blue; section headings, primary button baselines, text emphasis |
| `--hp-primary-dark` | `#0D47A1` | `rgb(13, 71, 161)` | Deep royal blue; card titles, active icons, card hover shadows |
| `--hp-primary-light` | `#1565C0` | `rgb(21, 101, 192)` | Mid-tone royal blue; secondary gradients, link hovers |
| `--hp-accent-blue` | `#2196F3` | `rgb(33, 150, 243)` | Vibrant tech blue; underline indicators, form focus rings, gradient stops |
| `--hp-electric-blue` | `#0000FE` | `rgb(0, 0, 254)` | High-energy accent blue; footer hover links, interactive badges |
| `--hp-action-blue` | `#3B82F6` | `rgb(59, 130, 246)` | Action blue; submit buttons, form control focus highlights |

### Secondary & Accent Colors
| Token Name | Hex Code | RGB | Role / Usage |
| :--- | :--- | :--- | :--- |
| `--hp-accent-cyan` | `#00BCD4` | `rgb(0, 188, 212)` | Medical cyan; feature highlights, tech badges, icons |
| `--hp-accent-mint` | `#A1F1C6` | `rgb(161, 241, 198)` | Tertiary light mint; wellness highlights, soothing background accents |
| `--hp-accent-green` | `#4CAF50` / `#10B981` | `rgb(16, 185, 129)` | Success, verified status, GAHAR compliance, active refill indicators |
| `--hp-accent-orange`| `#FF7F11` | `rgb(255, 127, 17)` | Quaternary warm orange; urgency badges, special announcements |
| `--hp-error-red` | `#EF4444` | `rgb(239, 68, 68)` | Required field indicators, validation errors |

### Neutral & Background Colors
| Token Name | Hex Code | Role / Usage |
| :--- | :--- | :--- |
| `--hp-white` | `#FFFFFF` | Card backgrounds, containers, crisp white space |
| `--hp-bg-light` | `#F8FAFC` | Page body background, soft section alternating panels |
| `--hp-bg-lighter` | `#F5F7FA` | Subtle grey cards, input fields background |
| `--hp-text-dark` | `#0F172A` / `#222529` | Headings, primary copy, form labels |
| `--hp-text-medium`| `#4B5563` / `#666666` | Body text, descriptions, feature paragraphs |
| `--hp-text-muted` | `#6C757D` / `#848484` | Subtitles, meta tags, timestamps |
| `--hp-text-light` | `#94A3B8` / `#999999` | Placeholders, inactive icons, helper text |
| `--hp-border-light`| `#E2E8F0` / `#F0F0F0` | Form field borders, soft card dividers |

---

## 3. Typography System

### Primary Typeface: **Poppins**
- **Google Font Import**:
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  ```
- **CSS Font Family**:
  ```css
  font-family: 'Poppins', sans-serif;
  ```
- **Fallback / Alternative**: `Poppins`, `sans-serif` (theme base)

### Typographic Hierarchy & Scale
| Level | Desktop Size | Mobile Size | Weight | Line Height | Letter Spacing | Color |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **H1 (Hero Heading)** | `44px - 48px` | `32px - 34px` | 700 / 800 | 1.15 - 1.25 | `-0.02em` | `#0D1B4C` / `#FFFFFF` |
| **H2 (Section Heading)** | `32px - 36px` | `26px - 28px` | 700 | 1.25 | `-0.015em` | `#1A237E` / `#0D1B4C` |
| **H3 (Sub-section / Card)**| `20px - 24px` | `18px - 20px` | 600 / 700 | 1.3 | `-0.01em` | `#0D47A1` |
| **H4 (Feature Title)** | `18px - 20px` | `16px - 18px` | 600 | 1.35 | `0` | `#222529` |
| **Lead / Subtitle** | `18px - 19px` | `16px` | 400 / 500 | 1.6 | `0` | `#6C757D` |
| **Body Regular** | `15px - 16px` | `14px` | 400 | 1.7 - 1.8 | `0` | `#4B5563` |
| **Button Text** | `15px - 17px` | `14px - 15px` | 700 | 1.0 | `0.5px` (Caps / Semi-bold) | `#FFFFFF` |
| **Caption / Meta** | `12px - 13px` | `12px` | 500 | 1.5 | `0` | `#94A3B8` |

---

## 4. UI Elements & Design Patterns

### Border Radius
- **Small (`--hp-radius-sm`)**: `10px` — Form inputs, select dropdowns, inner chips
- **Medium (`--hp-radius-md`)**: `12px - 15px` — Cards, primary action buttons, process steps
- **Large (`--hp-radius-lg`)**: `20px` — Large modal dialogs, overview containers, contact form wrapper
- **Full / Pill (`--hp-radius-pill`)**: `50px` / `9999px` — Hero CTA buttons, pill tags, status pills

### Shadows & Elevation
```css
/* Elevation 1: Subtle card base */
--hp-shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.08);

/* Elevation 2: Interactive card base */
--hp-shadow-md: 0 8px 25px rgba(0, 0, 0, 0.10);

/* Elevation 3: Hover states & prominent popups */
--hp-shadow-lg: 0 15px 40px rgba(13, 71, 161, 0.15);

/* Blue Glow: Focus & Primary Button hover */
--hp-shadow-blue: 0 8px 24px rgba(59, 130, 246, 0.35);
```

### Gradients
1. **Primary Navy Gradient**:
   `linear-gradient(135deg, #0D1B4C 0%, #1565C0 100%)`
   *Used for: Process step circles, icon bubbles, standards cards indicator top border.*
2. **Action Button Gradient**:
   `linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)`
   *Hover: `linear-gradient(135deg, #1E40AF 0%, #1E3A8A 100%)`*
3. **Section Underline Gradient**:
   `linear-gradient(135deg, #2196F3, #1565C0)`
   *Dimensions: width 60px, height 4px, border-radius 2px.*
4. **Service Card Dark Overlay**:
   `linear-gradient(to bottom, rgba(13, 71, 161, 0) 30%, rgba(13, 71, 161, 0.85) 100%)`

---

## 5. Reusable Component Specifications

### A. Section Titles with Underline Accent
```html
<div class="text-center">
  <span class="hp-badge">Our Services</span>
  <h2 class="section-title-with-underline">Comprehensive Care, Digitally Delivered</h2>
  <p class="section-subtitle">Tailored healthcare experiences designed around your needs and schedule.</p>
</div>
```
```css
.section-title-with-underline {
  color: #1a237e;
  position: relative;
  display: inline-block;
  padding-bottom: 12px;
  font-size: 2.2rem;
  font-weight: 700;
}
.section-title-with-underline::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0; /* Or 50% with translateX(-50%) if centered */
  width: 60px;
  height: 4px;
  background: linear-gradient(135deg, #2196F3, #1565C0);
  border-radius: 2px;
}
```

### B. Primary Call-to-Action Buttons
- **Hero CTA (Pill Button)**:
  - Background: `#FFFFFF`
  - Text Color: `#0D1B4C`
  - Font Size: `1.1rem` (Bold 700)
  - Padding: `18px 45px`
  - Border-Radius: `50px`
  - Hover: `transform: translateY(-3px); box-shadow: 0 12px 35px rgba(0,0,0,0.3);`
- **Standard Action Button**:
  - Background: `linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)`
  - Text Color: `#FFFFFF`
  - Font Size: `1rem` (Bold 700)
  - Padding: `14px 32px`
  - Border-Radius: `12px`
  - Hover: `transform: translateY(-2px); box-shadow: 0 12px 32px rgba(59, 130, 246, 0.4);`

### C. Service & Feature Cards
- **Container**: White background, `12px` border-radius, `1px solid #F0F0F0`, overflow hidden.
- **Icon / Visual**: `80px` circular icon bubble with Navy gradient `linear-gradient(135deg, #0D1B4C 0%, #1565C0 100%)` and white icon.
- **Card Hover**: `translateY(-8px)`, elevated blue shadow `0 20px 40px rgba(13, 71, 161, 0.20)`.

### D. Process Timeline (3-Step Onboarding)
- **Step Circle**: `80px x 80px` circle with bold step numbers (`01`, `02`, `03`) in white over `#0D1B4C` gradient.
- **Connecting Line**: Vertical connecting line `2px` wide with gradient `linear-gradient(180deg, #0D1B4C 0%, rgba(13, 71, 161, 0.2) 100%)`.
- **Steps**:
  1. **Choose Your Care Plan**: Flexible options, no hidden fees, instant activation.
  2. **Connect with Your Care Team**: Employed Board-Certified doctors within 1 hour, video or in-person.
  3. **Experience Continuous Care**: 24/7 tele-triage, medication management, wellness coaching.

### E. Contact & Funnel Forms
- Container padding: `2.5rem` (40px)
- Border radius: `20px`
- Input field height: `~48px` (`padding: 0.875rem 1.25rem`)
- Input border: `2px solid #E2E8F0`
- Input focus ring: `border-color: #3B82F6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);`
- Required asterisks: `#EF4444`

---

## 6. Official Copy, Programs & Proof Points

### Core Programs & Offerings
1. **Tele-Triage (24/7)**: Immediate round-the-clock clinical guidance by trained doctors and healthcare professionals within 1 hour.
2. **Urgent Primary Care**: Egyptian Board-Certified family medicine physicians for instant consultations.
3. **Chronic Care Management (CCM)**: Quarterly consultations, monthly clinical pharmacist follow-ups, and personalized treatment plans (following CMS Medicare guidelines).
4. **Chronic Medication Refill Program**: Stable patient medication oversight, automated refills, delivery, and pharmacist monitoring (annual subscription).
5. **HealPass (For Students)**: Student healthcare subscription offering unlimited family doctor access, specialist visits, discounted mental health sessions, discounted scans/labs, and pharmacy discounts.
6. **For Businesses & Employers**: On-site corporate doctors, workforce health metrics, reduced absenteeism, real-time access dashboards, and up to 45% healthcare cost savings.
7. **Peri-Surgical Care**: Pre- and post-operative monitoring in direct coordination with surgical teams.
8. **Digital Medical Tourism**: Complete cross-border healthcare navigation and post-procedure follow-ups.

### Proof Points & Verified Stats
- **80,000+** Annual Teleconsultations Delivered
- **10,000+** Active Refill Program Members
- **500+** Active CCM Patients
- **45%** Documented Cost Savings in Chronic Care
- **25%** Improved Outcomes vs. Payer Baseline
- **95%+** Patient Satisfaction Rating
- **< 1 Hour** Appointment Availability

### Official Contact & Operational Details
- **Website**: [https://healpath.care](https://healpath.care)
- **Patient Portal**: [http://patient.healpath.care](http://patient.healpath.care)
- **Phone / WhatsApp**: `+20 101 900 3440` (+201019003440)
- **Customer Care**: `customercare@healpath.care`
- **Partnerships & Business**: `partnerships@healpath.care`
- **Headquarters**: 43 Al Gazaer Square, El Basatin, Maadi, Cairo, Egypt
- **Other Branches**: New Cairo (Operational), 6th October & Downtown Cairo (Coming Soon)

---

## 7. Tone of Voice & Copywriting Rules

| Do | Don't |
| :--- | :--- |
| **Clinical yet Empathetic**: Warm, reassuring, evidence-based, professional. | Cold, robotic medical jargon or overly casual slang. |
| **Empowering & Proactive**: "Take control of your health journey with continuous care." | Reactive or fear-inducing ("Don't wait until it's too late"). |
| **Trust & Accountability**: Highlight Board-Certified doctors and institutional compliance (GAHAR, URAC, HIPAA). | Vague marketplace claims ("Talk to doctors anytime"). |
| **Transparent**: Clearly articulate no hidden fees, direct pricing, and under-1-hour access. | Confusing fine print or obscured charges. |
