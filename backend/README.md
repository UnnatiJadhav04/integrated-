# InboxGuardian — Integrated Project

## Structure
```
final/
├── backend/        ← FastAPI backend (port 8101)
└── frontend/       ← React + Vite frontend (port 5173)
```

## How to Run

### 1. Start the Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8101 --reload
```

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173

## API Integration Map

| Page         | API Called                                         |
|--------------|----------------------------------------------------|
| Register     | POST /auth/send-otp → /auth/verify-otp → /user/register |
| Login        | POST /user/login (saves user_id to session)        |
| AddMail      | GET /email-accounts/:id + POST /email-accounts/add |
| AddKeywords  | POST /keywords/bulk-add                            |
| AlertConfig  | POST /alerts/config                                |
| AddPassKey   | GET /email-accounts/:id + POST /email-accounts/update-passkey |

## Flow
Landing → Register (OTP → Verify → Create Account) → Login → Add Mail → Add Keywords → Alert Config → Add Passkey → Loading → Setup Complete
