# Thiru Insurance — Frontend

React + Vite + Tailwind CSS insurance platform (frontend-only, mock data).

## Run locally
```
npm install
npm run dev
```

## Demo logins
- Merchant: merchant@thiru.com / demo123 (or "Demo Merchant" button)
- Admin: admin@thiru.com / admin123 (or "Demo Admin" button)

## What's built
- Public site: Home, Insurance categories & plan pages, About, FAQ, Contact, Login
- Merchant portal: Dashboard, Browse Insurance, multi-step Apply flow, Applications,
  Policies, Claims, Payments, Notifications, Profile, Support
- Admin panel: Dashboard (charts), Applications (approve/reject), Policies, Merchants,
  Claims (approve/reject/settle), Products, Payments, Reports (charts), Notifications,
  Settings, Profile

## Data
All data is mock, backed by localStorage. See `src/services/mockApi.js` — every function
is written to be swapped for a real Axios call later without changing call signatures.

## Workflow implemented end-to-end
Apply → Admin approves → Payment Pending → Pay → Policy Active → Raise Claim → Admin
approves/settles claim. Notifications fire at each step for both roles.
