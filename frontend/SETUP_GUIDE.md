# InboxGuardian — React + Vite Setup Guide

## Project Structure

```
inboxguardian-react/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx              ← Entry point
    ├── App.jsx               ← Routes defined here
    ├── index.css             ← Global styles + Tailwind
    ├── components/
    │   ├── Navbar.jsx        ← Shared top navigation
    │   ├── Footer.jsx        ← Shared footer
    │   └── Toggle.jsx        ← Reusable toggle switch
    └── pages/
        ├── Landing.jsx       → /
        ├── Services.jsx      → /services
        ├── Login.jsx         → /login
        ├── Register.jsx      → /register
        ├── AddMail.jsx       → /add-mail
        ├── AddKeywords.jsx   → /add-keywords
        ├── AlertConfig.jsx   → /alert-config
        ├── AddPassKey.jsx    → /add-passkey
        ├── LoadingScreen.jsx → /loading
        └── SetupComplete.jsx → /setup-complete
```

---

## How to Run in VS Code

### Step 1 — Open the project
```bash
# Copy the inboxguardian-react folder somewhere, then:
cd inboxguardian-react
code .
```

### Step 2 — Install dependencies
Open VS Code terminal (`Ctrl + `` ` ``), then run:
```bash
npm install
```

### Step 3 — Start the dev server
```bash
npm run dev
```
Visit `http://localhost:5173` in your browser.

---

## How Navigation Works (React Router)

All 10 pages are connected via **React Router v6**. Links use `<Link to="/path">` instead of `<a href>`, which means:
- No page reloads — navigation is instant (SPA)
- The URL bar updates correctly
- The browser back/forward buttons work

The full flow is:
```
/ (Landing)
  ↓ "Get Started"
/register → /add-mail → /add-keywords → /alert-config → /add-passkey → /loading → /setup-complete
```
Also: `/login` → `/add-mail` (after form submit)


## Tips for VS Code

- Install the **ES7+ React/Redux/React-Native snippets** extension for shortcuts like `rafce` to generate components
- Install **Tailwind CSS IntelliSense** extension for autocomplete on all the custom colors/spacing
- Install **Prettier** and set format-on-save for clean code automatically
