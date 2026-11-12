# Free Consultation Booking API (contract)

What the free consultation funnel (`frontend/consult/`) expects from the **main
HealPath booking system**. The funnel shows real availability, holds the slot the
visitor picks, and the patient platform confirms it when they **create their account**.

> **Eligibility: new accounts only, one free consultation each.** The offer is a
> sign-up incentive. A phone number that already has a HealPath account, or that has
> already used (or currently holds) a free consultation, can't get one.

Until these endpoints exist, the funnel runs on **demo data** (fake slots, fake
booking ids) and shows a "Demo times" notice.

All times are ISO 8601 with offset. Clinic time zone: `Africa/Cairo`.

---

## Flow

```
Funnel                         Booking system                    Patient platform
──────                         ──────────────                    ────────────────
0. POST /leads          ───▶   name + phone saved (first step of the funnel)
1. GET  /availability   ───▶   free slots from the dashboard
2. POST /bookings/hold  ───▶   slot locked for 15 min,
                               status = "held", returns bookingId
3. Redirect to /register with ?booking=<bookingId>&ref=free-consult ──▶
                               ◀─── GET /bookings/{id}            4. Platform pre-fills sign-up
                                                                     (name + phone) from the booking
                                                                  5. Visitor creates an account
                                                                     (phone + OTP)
                               ◀─── POST /bookings/{id}/confirm   (server to server)
                               status = "confirmed",
                               linked to the account
                               slot shows as booked on dashboard
```

---

## 0. `POST /leads` (optional)

Sent as soon as the visitor enters their name and phone (the funnel's first step),
so people who stop mid-quiz can still be followed up.

```json
{ "source": "free-consult-funnel", "name": "Sara Ahmed", "phone": "01012345678", "marketingConsent": false, "lang": "ar" }
```
**201** (body ignored). Store by phone; the later hold request carries the same phone.

---

## 1. `GET /availability`

Called by the browser whenever the visitor changes the consultation type or specialty.

| Query | Example | Notes |
|---|---|---|
| `consultation` | `general` or `specialty` | |
| `specialty` | `dermatology` | Only when `consultation=specialty`. Keys: `internal`, `dermatology`, `gynecology`, `pediatrics`, `psychology`, `nutrition` (see `SPECIALTIES` in `consult-app.js`) |
| `from` | `2026-11-12` | First day, Cairo date |
| `days` | `14` | How many days ahead |

**200**
```json
{
  "timezone": "Africa/Cairo",
  "slots": [
    { "id": "slt_8f2a", "start": "2026-11-15T10:00:00+02:00", "durationMin": 20 },
    { "id": "slt_8f2b", "start": "2026-11-15T10:30:00+02:00", "durationMin": 20 }
  ]
}
```
- Only **free, bookable** slots. Held and booked slots must be left out.
- Include only slots at least 1 hour from now.
- CORS: allow the funnel's origin (e.g. `https://marketscene-dev.github.io`).
- Cache for ≤ 30 seconds so the funnel sees new bookings quickly.

---

## 2. `POST /bookings/hold`

Called when the visitor presses **Book**. Locks the slot so nobody else can take it.

**Request**
```json
{
  "slotId": "slt_8f2a",
  "source": "free-consult-funnel",
  "consultation": "specialty",
  "specialty": "dermatology",
  "for": "me",
  "name": "Sara Ahmed",
  "phone": "01012345678",
  "marketingConsent": false,
  "lang": "ar"
}
```

**201**
```json
{ "bookingId": "bk_3Jd9xQ2", "status": "held", "start": "2026-11-15T10:00:00+02:00", "holdExpiresAt": "2026-11-12T09:45:00+02:00" }
```

**Errors**
| Status | When | Funnel shows |
|---|---|---|
| `409` `slot_taken` | Someone else took it | "That time was just taken. Please pick another." and reloads slots |
| `409` `existing_account` | This phone already has a HealPath account | "This number already has a HealPath account. The free consultation is for new accounts only." |
| `409` `already_used` | This phone already held or used a free consultation | "This number has already used its free consultation." |
| `422` | Bad phone / missing fields | Generic error |

Rules:
- `bookingId` must be random and unguessable (it travels in a URL).
- Hold lasts **15 minutes**. Expired holds free the slot again.
- **New accounts only:** reject with `existing_account` if the phone belongs to any HealPath account.
- **One each:** reject with `already_used` if the phone has another held or confirmed free consultation.
- Rate-limit by IP and phone: these two errors reveal whether a number has an account.

---

## 3. Patient platform → `GET /bookings/{bookingId}` (pre-fill, server to server)

When the visitor lands on the platform with `?booking=`, the platform fetches the
booking to pre-fill sign-up, so they never type their details twice.

**200**
```json
{ "bookingId": "bk_3Jd9xQ2", "status": "held", "name": "Sara Ahmed", "phone": "01012345678",
  "consultation": "specialty", "specialty": "dermatology", "for": "me",
  "start": "2026-11-15T10:00:00+02:00", "holdExpiresAt": "2026-11-12T09:45:00+02:00", "lang": "ar" }
```
- The platform should verify the phone (OTP) before treating it as the account's number.
- The funnel links to **`https://patient.healpath.care/register`** (sign-up), so the platform
  must keep the `booking`, `ref` and `utm_*` query parameters on that page and through every
  sign-up step.
- If the visitor tries to sign up with a phone that already has an account, the platform
  should explain the free consultation is for new accounts only (and offer normal booking).

---

## 4. Patient platform → `POST /bookings/{bookingId}/confirm`

**Server to server**, called by the patient platform right after the visitor
**finishes sign-up** (phone verified by OTP). Never called from the funnel, and never
for an account that existed before the booking.

The platform must:
1. On landing, read `booking` and `ref` from the URL and keep them through sign-up
   (cookie or session), because sign-up can take several pages.
2. When the new account is created, call confirm with it:

```json
{ "accountId": "acc_5521", "accountPhone": "01012345678", "accountCreatedAt": "2026-11-12T09:41:00+02:00" }
```

The booking system then checks:
- the booking exists and is `held` (or expired **but the slot is still free**: confirm anyway),
- `accountPhone` matches the booking phone (stops someone using a link that isn't theirs),
- the account was **created after the booking was held** (`accountCreatedAt` ≥ booking time), so only new accounts qualify,
- the account hasn't already used a free consultation.

**200** → `{ "status": "confirmed", "start": "...", "consultation": "...", "specialty": "..." }`
The slot now shows as booked on the main dashboard, and the platform shows the
appointment in the patient's account.

**409** `slot_taken` (hold expired and someone took it) → platform asks the patient to pick a new time.

---

## Privacy

- The URL to the platform carries only `booking`, `ref`, `utm_*` and `lang`. Never the name, phone or specialty.
- No booking details are sent to Meta. The funnel only fires an empty `Lead` event.
