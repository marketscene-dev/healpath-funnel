# HealPath Plan Finder

A 5-question quiz funnel that matches visitors with the right HealPath access plan
(Individual, Family, SME Access A/B/C, or the HealPass Student Program) and sends them
to the patient platform to activate it.

Branding, prices and CTA links mirror the
[HealPath pricing page](https://healpath.the-marketscene.com/pricing/).

**Live:** https://marketscene-dev.github.io/healpath-funnel/frontend/ (GitHub Pages, deployed from
`main` on every push).

## Repository layout
```
healpath-funnel/
├── frontend/   # This plan finder (static HTML, CSS, JS)
└── backend/    # Reserved for server-side code (not used yet)
```

## Frontend structure
```
frontend/
├── index.html                      # Funnel page: intro → quiz → loading → result
├── assets/
│   ├── css/
│   │   ├── healpath-theme.css      # Brand tokens (Poppins, navy, teal, radii, shadows)
│   │   └── quiz-styles.css         # Funnel components and responsive layout
│   ├── js/
│   │   └── quiz-app.js             # Bundles, branching questions, scoring, result rendering
│   └── images/
│       ├── healpath-logo.png
│       └── healpath-logo-white.png
├── components/
│   └── privacy-policy-component.html   # Embeddable Meta tracking privacy notice
└── docs/
    ├── QUIZ_FUNNEL_DOCUMENTATION.md    # Quiz logic, points table, result rules
    ├── BRAND_GUIDELINES.md             # Brand and design system reference
    └── PRIVACY_POLICY_META_TRACKING.md # Privacy notice copy
```

## How the funnel works
1. **Question 1** picks a path: Just me, My family, My company, or University student.
2. **Questions 2–5** are specific to that path. Every answer gives points to one or more bundles.
3. The eligible bundle with the most points wins. Must-haves (for example dental for a company)
   always beat price, and unverified students are matched to Individual Access.
4. The result shows the plan in the same card style as the website, the reasons it fits,
   honest "Good to know" notes, and a CTA to `https://patient.healpath.care/`.

Full logic and points: [docs/QUIZ_FUNNEL_DOCUMENTATION.md](docs/QUIZ_FUNNEL_DOCUMENTATION.md).

## Run locally
No build step; it's plain HTML, CSS and JavaScript. From the repository root:
```bash
python3 -m http.server 8080 --directory frontend
```
Then open http://localhost:8080

## Editing
- **Prices or plan copy:** `BUNDLES` in `assets/js/quiz-app.js`
- **Questions and points:** `Q_WHO` and `PATHS` in `assets/js/quiz-app.js`
- **Colors and font:** `:root` tokens in `assets/css/healpath-theme.css`
