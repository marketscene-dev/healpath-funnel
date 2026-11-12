# Free Consultation Funnel

Top-of-funnel quiz: name + phone → 5 questions → we suggest a **general** or a **specialty**
consultation → the visitor picks either one (both free) → pick a date and time (live from the booking dashboard) → slot held →
`thanks.html` → sign in on the patient platform to claim it. The thanks page also
upsells the subscription funnel in `../subs-funnel/`.

## Files
| File | What it does |
|------|--------------|
| `index.html` | Intro → quiz → emergency screen → result + choice cards + booking form |
| `thanks.html` | Booking received, next steps, sign-in link to the patient platform, plan upsell |
| `js/consult-app.js` | Settings, specialties, questions, scoring, booking |
| `js/thanks.js` | Fires the Meta `Lead` event once, builds the tagged sign-in link |
| `js/lang-ar.js` | Arabic copy, keyed by the English text |
| `css/consult.css` | Choice cards, form, emergency and thanks styles |

Shared with the subscription funnel: `../shared/css/`, `../shared/images/`,
`../shared/js/i18n.js` (English / Arabic switch) and `../shared/js/tracking.js` (Meta Pixel).

## Before going live
1. **Specialties:** edit `SPECIALTIES` in `js/consult-app.js` to match what HealPath offers free (add the Arabic name and text to `js/lang-ar.js`).
2. **Booking system:** set `API_BASE` in `js/consult-app.js` once the main booking system offers the calls in [`backend/BOOKING_API.md`](../../backend/BOOKING_API.md). **Until then the date/time slots are demo data and nothing is held.**
3. **Meta Pixel:** paste the Pixel ID into `../shared/js/tracking.js`. Only the `Lead` event is sent, with no health details.

## How the suggestion works
Each answer gives points to General (`g`) or Specialty (`s`). Specialty wins only
with more points; ties go to General, since a family doctor can refer on. The
concern question picks which specialty to offer (children default to Pediatrics).
"Danger signs" skips booking and shows the emergency screen (ambulance 123).

## How the patient platform knows the visitor came from here
The "Sign in to claim" link opens `https://patient.healpath.care/` with:
`ref=free-consult`, `utm_source=healpath-funnel`, `utm_medium=consult-funnel`,
`utm_campaign=free-consultation`, `lang`, and `booking=<id>` when the backend returns one.
No name, phone or specialty is ever put in the URL.

The platform should:
1. Read `ref` / `booking` when the visitor lands and keep them through sign-up (e.g. in a cookie).
2. After sign-in, look up the booking (by `booking` id, or by the mobile number) and give
   the account its free consultation.
