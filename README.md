# My Interview Bot — AI-Powered Interview Prep Assistant

> Practice real interview questions with an AI that gives structured, role-specific feedback.

![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-yellow?logo=javascript) ![Next.js](https://img.shields.io/badge/Next.js-13%2B-black?logo=next.js) ![Vercel](https://img.shields.io/badge/Deployed-Vercel-000?logo=vercel) ![OpenAI](https://img.shields.io/badge/OpenAI-Powered-412991?logo=openai)

🔗 **Live demo:** [my-interview-bot.vercel.app](https://my-interview-bot.vercel.app)

---

## What It Does

My Interview Bot is a conversational prep tool that simulates an AI interviewer — asking role-specific questions, listening to your responses, and giving structured feedback on clarity, depth, and relevance.

**Use cases:**
- Warm up before technical or behavioral interviews
- Practice answering questions about specific roles (AI safety, analytics, finance)
- Get instant feedback on your response structure (STAR format, etc.)
- Repeat-practice without a human partner

---

## Why I Built This

Interview prep is mostly solo — you either talk to yourself in the mirror or pay for coaching. This bot creates a low-friction middle ground: always available, role-aware, and honest about weak answers.

As someone who evaluates AI behavior professionally (red teaming at xAI), I was also curious how well a prompted LLM handles multi-turn interview simulation vs. going off-track. Spoiler: system prompt discipline matters a lot.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| AI | OpenAI API |
| Deployment | Vercel |
| Language | JavaScript |

---

## Local Setup

```bash
# 1. Clone the repo
git clone https://github.com/abhishekkumarjjha/my-interview-bot.git
cd my-interview-bot

# 2. Install dependencies
npm install

# 3. Add your OpenAI API key
echo "OPENAI_API_KEY=your_key_here" > .env.local

# 4. Run locally
npm run dev
```

Open `http://localhost:3000`.

---

## Project Structure

```
my-interview-bot/
├── pages/          # Next.js pages and API routes
├── package.json
└── README.md
```

---

## Author

**Abhishek Kumar Jha**
AI Safety Researcher · Former xAI (Grok) Red Teamer · MS Business Analytics, UT Arlington

[LinkedIn](https://linkedin.com/in/abhishekkumarjjha) · [GitHub](https://github.com/abhishekkumarjjha)

---

## Related Projects

- [Agent That Knows Me](https://github.com/abhishekkumarjjha/agent-that-knows-me) — Personal AI portfolio agent
- [ChatCSV](https://github.com/abhishekkumarjjha/chatcsv) — Conversational AI for CSV data
