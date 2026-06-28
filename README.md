# My App — Hirwa Paradis Personal PWA

## Structure
```
My_App/
├── frontend/   ← React + Vite PWA
└── backend/    ← Flask API
```

---

## Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

**Install on your phone:**
1. Run `npm run build` then deploy to Vercel (free)
2. Open your Vercel URL in Safari (iOS) or Chrome (Android)
3. Tap Share → "Add to Home Screen"
4. Done — it's on your home screen like a real app

---

## Backend setup

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Runs on http://localhost:5000

---

## After deploy — update QR URL

In `frontend/src/pages/QRPage.jsx`, replace:
```js
const LANDING_URL = 'https://hirwa.vercel.app'
```
with your actual Vercel URL.

---

## What's built

| Feature | Where |
|---|---|
| Contacts list with profile + call icons | `ContactsPage.jsx` |
| Tap contact → detail sheet | `ContactsPage.jsx` |
| QR code (your landing page) | `QRPage.jsx` |
| Contact form (name, number, socials) | `QRPage.jsx` |
| Ideas board with pin + delete | `IdeasPage.jsx` |
| All data persists in localStorage | `useLocalStorage.js` |
| Backend API (swap localStorage later) | `backend/app.py` |

---

## Next steps (coming)
- [ ] Landing page (public, hosted separately)
- [ ] Sync contacts from landing page form → app
- [ ] Search contacts
