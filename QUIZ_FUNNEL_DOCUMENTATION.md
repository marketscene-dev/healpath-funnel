# HealPath Plan Finder — Funnel Documentation

A 5-question quiz that recommends one of the six bundles on the
[HealPath pricing page](https://healpath.the-marketscene.com/pricing/) and sends the
customer to the same CTA link the website uses: `https://patient.healpath.care/`.

## Files
| File | Purpose |
| --- | --- |
| `index.html` | Page shell: top bar, header, intro, quiz, loading, result |
| `quiz-app.js` | Questions, scoring, bundle data, result rendering |
| `healpath-theme.css` | Brand tokens copied from the live site (Poppins, navy, teal) |
| `quiz-styles.css` | Components (option cards, pricing cards, SME cards, student card) |

## Bundles (from the pricing page)
| Key | Bundle | Price | CTA |
| --- | --- | --- | --- |
| `individual` | Individual Access | 250 / 625 / 2,500 EGP (month / quarter / year) | Continue to Patient Platform |
| `family` | Family Access (4 members) | 750 / 1,875 / 7,500 EGP | Continue to Patient Platform |
| `smeA` | SME Option A — Essential Primary Care | 90 EGP / employee / month | Start Company Setup |
| `smeB` | SME Option B — Primary Care + Chronic Refill | 105 EGP | Start Company Setup |
| `smeC` | SME Option C — Expanded Employee Access | 120 EGP | Start Company Setup |
| `student` | HealPass Student Program | 200 EGP / month | Verify Student Access |

All CTAs → `https://patient.healpath.care/`. "Compare / View plan" links → pricing page anchors
`#individual-family`, `#sme-access`, `#healpass`.

## Questions and points
Every answer adds points to one or more bundles. The bundle with the most points wins,
limited to the bundles the person can buy (based on Q1):

- Just me → Individual, Family
- My family → Family, Individual
- My company → SME A / B / C (a tie goes to the option with more coverage)
- Student → HealPass, Individual

| Q | Answers → points |
| --- | --- |
| 1. Who is the plan for? | Just me: individual 5 · My family: family 5 · My company: smeA/B/C 4 · Student: student 5 |
| 2. How many people need care? | 1: individual 3, student 3 · 2–4: family 4 · 5–20: smeA 2, smeB 2, smeC 1 · 20+: smeA 1, smeB 2, smeC 2 |
| 3. Monthly medicine? | No: individual/family/student 2, smeA 3 · 1–2 people: smeB 3, smeC 1 · Several: smeB 4, smeC 2 · Not sure: 1 to all except smeC |
| 4. What else matters? | Doctor when needed: individual 2, family 2, smeA 3 · Specialists: student 3, smeC 4 · Dental: smeC 5 · Lab/scan/medicine discounts: student 4 |
| 5. How to pay? | Monthly: individual 1, family 1, student 3 · Quarterly: individual 2, family 2 · Yearly: individual 2, family 2 · Company pays: smeA/B/C 2 |

Q5 also preselects the billing period shown as "Recommended" on Individual/Family results.

## Result page
- Plan card in the same layout as the website (pricing card, SME option cards, student split card).
- "X/5 answers point to this plan" plus the reasons.
- "Good to know" notes when the person asked for something the plan does not include
  (for example Chronic Refill on Individual → pay-per-use 525 EGP).
- "Also worth a look" runner-up (not shown for SME, where all three options are already visible).

## Run locally
```bash
python3 -m http.server 8080
```
Then open http://localhost:8080
