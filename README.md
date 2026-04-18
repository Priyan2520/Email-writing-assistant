# ✦ MailCraft AI — Full-Stack Email Writing Assistant

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)](https://vercel.com)

A production-ready, full-stack SaaS application for AI-powered email generation with a real-time admin monitoring dashboard.

> **Live Demo:** [your-project.vercel.app](https://your-project.vercel.app)  
> **Admin Panel:** [your-project.vercel.app/admin](https://your-project.vercel.app/admin)

---

## ✨ Key Features

- **Multi-Tone Generation** — Professional, Friendly, Formal, Concise, Persuasive, Empathetic
- **6 Email Types** — Follow-up, Proposal, Thank You, Introduction, Apology, Request
- **8 Languages** — English, Hindi, Spanish, French, German, Portuguese + more
- **Admin Dashboard** — Real-time activity log with usage statistics (total emails, top tone, success rate)
- **Serverless Backend** — Next.js API Routes with zero server management
- **Database Logging** — Every generation logged to Supabase/PostgreSQL for analytics
- **Auto-Refresh** — Admin panel polls for new activity every 30 seconds

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), React 18 |
| Styling | CSS Modules (no Tailwind dependency) |
| Backend | Next.js Serverless API Routes |
| Database | Supabase (PostgreSQL) |
| Language | TypeScript |
| Deployment | Vercel |

---

## 📂 Project Structure

```
ai-email-pro/
├── app/
│   ├── page.tsx              # Client: Email generator UI
│   ├── page.module.css       # Client page styles
│   ├── layout.tsx            # Root layout + metadata
│   ├── globals.css           # Global reset
│   ├── admin/
│   │   ├── page.tsx          # Admin: Activity monitor UI
│   │   └── admin.module.css  # Admin page styles
│   └── api/
│       ├── generate/
│       │   └── route.ts      # POST /api/generate — email logic + logging
│       └── admin/
│           └── logs/
│               └── route.ts  # GET /api/admin/logs — fetch + compute stats
├── lib/
│   └── supabase.ts           # Supabase client singleton
├── .env.example              # Environment variable template
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/ai-email-pro.git
cd ai-email-pro
npm install
```

### 2. Set Up Supabase (Free)

1. Go to [supabase.com](https://supabase.com) and create a free project.
2. Open the **SQL Editor** and run:

```sql
create table email_logs (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  prompt_preview text,
  tone text,
  email_type text,
  language text,
  status text default 'Success'
);
```

3. Go to **Project Settings → API** and copy your URL and `anon` key.

### 3. Configure Environment Variables

```bash
cp .env.example .env.local
# Then fill in your Supabase URL and key
```

### 4. Run Locally

```bash
npm run dev
# → http://localhost:3000       (Client)
# → http://localhost:3000/admin (Admin)
```

---

## 🌐 Deploy to Vercel (Free)

```bash
npm i -g vercel
vercel
```

Add your environment variables in the Vercel dashboard under **Settings → Environment Variables**.

---

## 🔑 Architecture Decisions

**Why Next.js App Router?**  
The App Router allows collocating the API routes with the UI, making the project a single deployable unit. No separate Express server needed.

**Why Supabase?**  
Supabase gives us a fully managed PostgreSQL database with a REST API out of the box — zero ops, free tier, and real-time subscriptions are available if needed later.

**Why CSS Modules over Tailwind?**  
CSS Modules keep styles scoped to each component and require zero build configuration, making the project easier to clone and run.

---

## 📈 Business Recommendations (Roadmap)

- [ ] Replace template engine with **Anthropic Claude API** for real AI generation
- [ ] Add **authentication** (Supabase Auth) to protect the `/admin` route
- [ ] Add **rate limiting** to the `/api/generate` route (e.g., 10 emails/hour per IP)
- [ ] Add **tone analytics chart** using Recharts or Chart.js in the admin dashboard
- [ ] Add **email history** feature — let users see their past generated emails

---

## 📄 License

MIT — free to use, modify, and distribute.
