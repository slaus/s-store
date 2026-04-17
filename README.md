This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!


## Multilingual Setup (i18n)

This project is fully multilingual and uses **next-intl** for internationalization.  
Adding a new language requires **only 3 simple steps** – no code changes other than updating the locales array.

### Project structure for i18n
```text
src/
├── config/
│ └── locales.js # Array of supported locales + default locale
├── messages/ # Translation files
│ ├── uk.json # Ukrainian translations
│ ├── en.json # English translations
│ └── ... # Add new language file here
public/
└── images/
├── uk.png # Flag icon for Ukrainian
├── en.png # Flag icon for English
└── ... # Add new flag image here
```

### How to add a new language (e.g., German `de`)

1. **Add the locale to the config**  
   Edit `src/config/locales.js`:
   ```js
   export const locales = ['uk', 'en', 'de'];
   export const defaultLocale = 'uk';

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


## 📦 Telegram Bot Setup Guide

This guide explains how to set up a Telegram bot that will send order details directly to your Telegram account.

---

### 📌 Step 1: Create a Telegram Bot

1. Open [@BotFather](https://t.me/BotFather) in Telegram.
2. Send the command: `/newbot`
3. Follow the prompts to:
   - Choose a **name** for your bot
   - Choose a **username** (must end with `bot`, e.g., `myshop_bot`)
4. After completing the setup, you'll receive your bot **API token**.  
   **📌 Save this token** — you'll need it later.

---

### 📌 Step 2: Get Your Chat ID

1. Open Telegram and **send any message** to your new bot.
2. In your browser, go to the following URL (replace `<YOUR_BOT_TOKEN>` with your actual token): https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates and the answer will be chat.id

