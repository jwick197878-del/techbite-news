# TechBite Daily - Auto Content Site

An automated news site that fetches RSS feeds (including Google News), rewrites articles using AI (Groq Llama 3), and displays Google AdSense ads.

## How it makes money

1. Auto-fetches from 7 RSS feeds (Google News, TechCrunch, Wired, etc.) every 6 hours
2. AI rewrites each article into unique content using Groq's Llama 3 (free)
3. Google AdSense ads are displayed on every page
4. Original source links are included for attribution
5. More traffic = more ad revenue

## Setup

### 1. Get a free Groq API key
1. Go to https://console.groq.com/keys
2. Sign up (free, no credit card needed)
3. Click "Create API Key" → copy it

### 2. Edit `.env`
Replace `your-groq-api-key-here` with your real key:
```
GROQ_API_KEY=gsk_your-actual-key
```
Also update `AD_CLIENT` once AdSense approves you.

### 3. Install & run
```
npm install
npm start
```

Open http://localhost:3000

## How the AI rewriting works

- Each new article is sent to Groq's Llama 3 8B model to rewrite it completely
- Facts, dates, names, and numbers are preserved
- Sentence structure, wording, and paragraph flow are changed
- The "AI Rewritten" badge shows on rewritten articles
- Without a Groq API key, the site still works — just without rewriting

## Deployment (free)

### Render (free)
1. Push to GitHub
2. Go to https://dashboard.render.com → New → Web Service
3. Connect repo, set: Build = `npm install`, Start = `npm start`
4. Add env vars from `.env` (including `GROQ_API_KEY`)

### Railway (free)
Same as Render — connect GitHub repo, set start command to `npm start`

## Files

| File | Purpose |
|------|---------|
| `server.js` | Express server + cron (auto-generates every 6h) |
| `scripts/generate-content.js` | Fetches RSS → Groq AI rewrite → saves articles |
| `views/index.ejs` | Homepage with ad slots |
| `views/article.ejs` | Article page with ad slots |
| `public/style.css` | Responsive theme |
| `.env` | Config (API keys, AdSense IDs) |