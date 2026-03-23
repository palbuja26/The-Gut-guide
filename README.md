# 🌿 Gut Guide — IBS & Cycle Food Tracker

A personal PWA (installable app) for managing IBS symptoms, tracking FODMAP triggers, getting AI-generated recipes from your pantry, and eating in sync with your menstrual cycle.

---

## 🚀 Deploy to Your Phone in 4 Steps

### Step 1 — Create a free GitHub account
Go to https://github.com and sign up (free).

### Step 2 — Upload this project to GitHub
1. Click the **+** button → "New repository"
2. Name it `gut-guide`, set to **Public**, click "Create repository"
3. Click "uploading an existing file"
4. Drag the entire `gut-guide` folder contents in
5. Click "Commit changes"

### Step 3 — Deploy to Vercel (free)
1. Go to https://vercel.com and sign up with your GitHub account
2. Click "Add New Project"
3. Select your `gut-guide` repository
4. Leave all settings as default — Vercel auto-detects React
5. Click **Deploy** — takes ~2 minutes
6. You'll get a URL like `gut-guide-xyz.vercel.app` — that's your app! 🎉

### Step 4 — Install on your iPhone
1. Open Safari on your iPhone
2. Go to your Vercel URL (e.g. `gut-guide-xyz.vercel.app`)
3. Tap the **Share** button (box with arrow pointing up)
4. Scroll down and tap **"Add to Home Screen"**
5. Tap **Add** — the app icon appears on your home screen!

**On Android:** Open Chrome → tap the 3-dot menu → "Add to Home screen"

---

## ✨ Features
- **Pantry tracker** — add ingredients, get instant FODMAP & GI risk flags
- **AI Recipe Generator** — Claude creates bespoke IBS-safe recipes from your pantry
- **Recipe Library** — curated IBS-friendly recipes matched to your pantry & cycle phase
- **Cycle Tracker** — set your period start date once, app auto-advances daily
- **Phase nutrition** — personalised eating advice for each of the 4 cycle phases

## 💾 Data
All your data (pantry, cycle date) saves locally to your device via localStorage. Nothing is sent to any server except the AI recipe generation (which uses the Anthropic API via Claude.ai).

---

## 🛠 Local Development (optional)
```bash
npm install
npm start
```
Opens at http://localhost:3000
