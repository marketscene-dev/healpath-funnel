# HealPath Plan Finder — Funnel Documentation

A branching 5-question quiz that recommends one of the six bundles on the
[HealPath pricing page](https://healpath.the-marketscene.com/pricing/) and sends the
customer to the same CTA link the website uses: `https://patient.healpath.care/`.

## Files
| File | Purpose |
| --- | --- |
| `subs-funnel/index.html` | Page shell: top bar, header, intro, quiz, loading, result |
| `subs-funnel/js/quiz-app.js` | Questions, scoring, bundle data, result rendering |
| `shared/css/healpath-theme.css` | Brand tokens copied from the live site (Poppins, navy, teal) |
| `shared/css/quiz-styles.css` | Components (option cards, pricing cards, SME cards, student card) |

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

## How the logic works
1. **Question 1 picks the path** (Just me → "me" path; My family → "family" path; My company → SME path;
   Student → Student path). Changing Q1 with Back clears the other path's answers.
2. **Every answer gives points.** The plan with the most points wins, among the plans the person can buy.
3. **Must-haves beat points (SME).** Answers marked `requires` remove options that don't include that feature:
   refills needed → B or C; specialists or dental "must" → C. Price priority can't override a must-have.
4. **Exclusions.** A student with no student ID or university email can't get HealPass → Individual Access,
   with a note on how to switch later.
5. **Ties** go to the plan with more coverage (C > B > A) or the plan matching Q1.

## Questions per path (4 answers each)
**Q1 — Who is the plan for?** Just me (individual 2) · My family (family 2) · My company (SME A/B/C 3) · Student (student 3)

**"Just me" and "My family" paths** (only question 2 differs)
| Q | Answers → points |
| --- | --- |
| 2. (Just me) Does anyone else at home need care too? | No, just me: individual 6 · 1 more person: family 5, individual 2 · 2 or 3 more: family 6 · Maybe later: individual 5, family 1 (+ note) |
| 2. (My family) How many family members, including you? | 2: family 5, individual 2 (+ 500 EGP note) · 3: family 6 · 4: family 6 · More than 4: family 6 (+ note: extras use Individual) |
| 3. How often a doctor? | Rarely 1 · Every few months 2 · Monthly 3 · More often 3 (both plans) |
| 4. Also need? | Just a doctor 2 · Medicine refills / Specialists / Dental 1 (both plans, + "Good to know" note) |
| 5. How to pay? | Monthly 1 · Quarterly 2 · Yearly 2 · Not sure 1 (sets the "Recommended" billing period) |

**SME path**
| Q | Answers → points |
| --- | --- |
| 2. Monthly medicine refills? | No: A 3 · A few: B 3, C 1 (must have refills) · Many: B 4, C 2 (must have refills) · Not sure: A 1, B 2 |
| 3. Specialists? | No: A 2, B 2 · Sometimes: B 1, C 2 · Must: C 4 (must have specialty) · Not sure: B 1, C 1 |
| 4. Dental? | No: A 1, B 1 · Nice to have: C 2 · Must: C 4 (must have dental) · Not sure: B 1 |
| 5. Priority? | Lowest cost: A 4 · Balance: B 3 · Widest coverage: C 4 · Recommend for me: B 2 |

**Student path**
| Q | Answers → points |
| --- | --- |
| 2. How to verify? | Student ID: student 3 · Uni email: student 3 · Both: student 4 · Neither: individual 5, HealPass excluded |
| 3. Use most? | Doctor when sick: student 2, individual 2 · Specialists: student 3 · Mental health: 1 each (+ note) · Discounts: student 3 |
| 4. How often a doctor? | Same as above (student / individual) |
| 5. Monthly medicine? | No: 2 each · Yes / Sometimes / Not sure: 1 each (+ note when needed) |

## Result page
- Plan card in the same layout as the website (pricing card, SME option cards, student split card).
- "X/5 answers point to this plan" with reasons (shown when 3 or more; otherwise just the reasons).
- "Good to know" notes, for example: Chronic Refill pay-per-use 525 EGP; for 2 people two Individual plans
  cost 500 EGP; a must-have overrode "lowest cost"; Option C adds dental for +15/+30 EGP.
- "Also worth a look" runner-up (not shown for SME, where all three options are visible).

## Run locally
```bash
python3 -m http.server 8080 --directory frontend
```
Then open http://localhost:8080
