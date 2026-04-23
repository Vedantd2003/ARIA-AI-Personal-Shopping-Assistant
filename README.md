# ARIA — Voice AI Personal Shopping Assistant

> A production-grade voice-first AI assistant that helps users make smart buying decisions — not just browse products.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwindcss)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-ff69b4?style=flat-square)
![OpenRouter](https://img.shields.io/badge/OpenRouter-GPT--4o--mini-green?style=flat-square)

---

## Features

- **Voice-first** — Web Speech API with waveform animation and mic recording indicator
- **Smart decision engine** — AI asks adaptive questions about budget, use-case, and priorities
- **Structured recommendations** — Best pick + 2 alternatives + pros/cons + regret risk score
- **Session history** — Collapsible sidebar with past conversations (rename, delete, switch)
- **Auth system** — Email + password with JWT (httpOnly cookies) and bcrypt hashing
- **Premium UI** — Glassmorphism, Framer Motion animations, suggestion chips, quick replies
- **Fully responsive** — Mobile-first with collapsible sidebar and tab switching

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 |
| Animations | Framer Motion 11 |
| AI | OpenRouter → GPT-4o-mini |
| Auth | JWT (jose) + bcrypt |
| State | Zustand (with localStorage persist) |
| Voice | Web Speech API |

---

## Local Development

### 1. Clone and install

```bash
git clone https://github.com/Vedantd2003/ARIA-AI-Personal-Shopping-Assistant.git
cd ARIA-AI-Personal-Shopping-Assistant
npm install
```

### 2. Set environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
OPENROUTER_API_KEY=sk-or-v1-your-key-here     # https://openrouter.ai/keys
JWT_SECRET=your-random-32-char-secret-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deployment

### Vercel (Recommended for Next.js)

1. Push to GitHub
2. Import repo at [vercel.com/new](https://vercel.com/new)
3. Add environment variables in Vercel dashboard:
   - `OPENROUTER_API_KEY`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_APP_URL` → your Vercel URL
4. Deploy

> **Note:** The user store is in-memory. On Vercel serverless, users persist within a warm function instance. For production scale, replace `lib/users.ts` with a database (Vercel KV, Postgres, MongoDB).

### Render

1. Create a new **Web Service** on [render.com](https://render.com)
2. Connect your GitHub repo
3. Configure:
   - **Environment:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start`
   - **Node Version:** 18+
4. Add environment variables (same as above)
5. Deploy

> **Render advantage:** Single persistent process — the in-memory user store survives between requests without a database.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `OPENROUTER_API_KEY` | ✅ | API key from openrouter.ai |
| `JWT_SECRET` | ✅ | Random 32+ char string for JWT signing |
| `NEXT_PUBLIC_APP_URL` | ✅ | Your deployed URL (or localhost) |

---

## Project Structure

```
├── app/
│   ├── (auth)/login|signup     # Auth pages
│   ├── (app)/app/page.tsx      # Main assistant UI
│   └── api/auth|ai/            # API routes
├── components/
│   ├── chat/                   # ChatBubble, HeroSection, ChatContainer
│   ├── layout/                 # Sidebar, TopBar, InputBar
│   ├── products/               # ProductCard, AlternativeCard, RecommendationPanel
│   ├── ui/                     # Button, Input, Badge
│   └── voice/                  # VoiceButton, Waveform
├── hooks/                      # useVoice, useChat
├── lib/                        # ai.ts, auth.ts, users.ts, utils.ts
├── store/                      # Zustand store with session management
└── types/                      # TypeScript types
```

---

## License

MIT
