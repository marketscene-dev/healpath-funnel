# Free Consultation Funnel

Top-of-funnel quiz: 5 questions → we suggest a **general** or a **specialty**
consultation → the visitor picks either one (both free) → short booking form →
`thanks.html`, which upsells the subscription funnel in `../subs-funnel/`.

## Files
| File | What it does |
|------|--------------|
| `index.html` | Intro → quiz → emergency screen → result + choice cards + booking form |
| `thanks.html` | Booking received, next steps, WhatsApp fallback, plan upsell |
| `js/consult-app.js` | Settings, specialties, questions, scoring, booking |
| `js/thanks.js` | Fires the Meta `Lead` event once, fills the thanks text |
| `js/lang-ar.js` | Arabic copy, keyed by the English text |
| `css/consult.css` | Choice cards, form, emergency and thanks styles |

Shared with the subscription funnel: `../shared/css/`, `../shared/images/`,
`../shared/js/i18n.js` (English / Arabic switch) and `../shared/js/tracking.js` (Meta Pixel).

## Before going live
1. **Specialties:** edit `SPECIALTIES` in `js/consult-app.js` to match what HealPath offers free (add the Arabic name and text to `js/lang-ar.js`).
2. **Bookings:** they open a pre-filled WhatsApp message to `WHATSAPP_NUMBER`. Set `BOOKING_ENDPOINT` to POST them to the backend instead.
3. **Meta Pixel:** paste the Pixel ID into `../shared/js/tracking.js`. Only the `Lead` event is sent, with no health details.

## How the suggestion works
Each answer gives points to General (`g`) or Specialty (`s`). Specialty wins only
with more points; ties go to General, since a family doctor can refer on. The
concern question picks which specialty to offer (children default to Pediatrics).
"Danger signs" skips booking and shows the emergency screen (ambulance 123).
