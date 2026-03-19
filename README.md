# Vox AI Studio

🎙️ A production-ready AI Voice Generation SaaS built with Next.js, Google Gemini TTS, AWS S3, Polar & Better Auth.

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Gemini](https://img.shields.io/badge/Google%20Gemini-TTS-orange)](https://ai.google.dev/)
[![Neon](https://img.shields.io/badge/Neon-PostgreSQL-green)](https://neon.tech/)
[![Polar](https://img.shields.io/badge/Polar-Payments-blue)](https://polar.sh/)
[![Better Auth](https://img.shields.io/badge/Better%20Auth-Authentication-red)](https://better-auth.com/)

## 📋 Overview

Vox AI Studio is a full-stack SaaS platform that lets users generate natural-sounding speech from text using Google Gemini TTS models. It features a credits-based monetization system, custom voice cloning, multi-voice dialogue scenes, and a clean dashboard for managing all generated audio projects.

## ✅ Key Features

### 🔐 Authentication & Security
- Email & social login via **Better Auth**
- Protected routes and session management
- Role-based access control (admin / user)
- Account settings and profile management

### 💰 SaaS Monetization
- **Credits-based system** — users buy credits, spend them on generations
- One-time purchase plans via **Polar** (Starter, Creator, Pro)
- Polar webhook integration for automatic credit top-up on purchase
- Customer portal for invoice history and billing management
- Admin panel to send branded emails and gift credits to users

### 🎵 AI Text-to-Speech Generation
- Powered by **Google Gemini TTS** (Flash & Pro models)
- Support for **multiple languages and voices**
- **Multi-voice dialogue scenes** — assign different voices per speaker
- Emotion, style, pace and voice controls
- Real-time audio generation and playback

### 📁 Project Management
- Save, organize and search all generated audio projects
- Audio project history with metadata
- Download generated audio files

### 🎨 User Interface
- Clean dashboard with **Tailwind CSS** and **shadcn/ui**
- Fully responsive for all devices
- Real-time audio playback controls
- Markdown-based blog system (admin only)

---

## 🧠 Tech Stack

### Frontend & Framework
- **Next.js 16** — React framework with App Router
- **TypeScript** — Type-safe development
- **Tailwind CSS** — Utility-first styling
- **shadcn/ui** — Component library
- **Lucide React** — Icon set
- **Sonner** — Toast notifications

### AI & Audio
- **Google Gemini TTS Flash** — Fast, cost-effective voice generation
- **Google Gemini TTS Pro** — High-quality voice generation
- **AWS S3** — Cloud storage for all generated audio files

### Database & ORM
- **Neon** — Serverless PostgreSQL
- **Prisma** — Database ORM and migrations

### Payments & Auth
- **Polar** — One-time payment plans and customer portal
- **Better Auth** — Authentication, sessions, and admin plugin

### Email
- **Resend** — Transactional and marketing emails
- Custom branded HTML email templates

---

## 🏗️ Project Structure
```bash
vox-ai-studio/
├── src/
│ ├── app/
│ │ ├── (auth)/ # Sign-in, sign-up pages
│ │ ├── (dashboard)/ # Protected dashboard pages
│ │ │ └── dashboard/
│ │ │ ├── studio/ # TTS generation interface
│ │ │ ├── projects/ # Audio project management
│ │ │ ├── settings/ # Account settings
│ │ │ ├── send-email/ # Admin email panel
│ │ │ └── blog/ # Admin blog management
│ │ ├── (public)/ # Public pages
│ │ │ ├── blog/ # Public blog
│ │ │ └── pricing/ # Pricing page
│ │ └── api/
│ │ ├── tts/ # Gemini TTS generation endpoint
│ │ ├── polar/ # Polar webhook handler
│ │ └── admin/ # Admin-only API routes
│ ├── components/ # Reusable React components
│ ├── lib/ # Config and utilities
│ ├── actions/ # Next.js server actions
│ └── env.ts # Type-safe environment variables
├── prisma/
│ └── schema.prisma # Database schema
└── public/ # Static assets
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 24+
- Neon database account
- Google AI (Gemini) API key
- AWS account with S3 bucket
- Polar account for payments
- Resend account for emails

### 1. Clone the Repository

```bash
git clone https://github.com/ahmetsukkar/VoxAIStudio.git
cd VoxAIStudio
npm install
```

### 2. Environment Variables

Create a .env file in the root:

```bash
# Database
DATABASE_URL="your-neon-connection-string"

# Authentication
BETTER_AUTH_SECRET="your-better-auth-secret"
BETTER_AUTH_URL="http://localhost:3000"

# Google Gemini
GOOGLE_GENERATIVE_AI_API_KEY="your-gemini-api-key"

# AWS S3
AWS_ACCESS_KEY_ID="your-aws-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret"
AWS_REGION="your-aws-region"
AWS_S3_BUCKET_NAME="your-s3-bucket"

# Polar Payments
POLAR_ACCESS_TOKEN="your-polar-token"
POLAR_WEBHOOK_SECRET="your-polar-webhook-secret"

# Resend Email
RESEND_API_KEY="your-resend-api-key"

```

### 3. Database Setup

```bash
npx prisma generate
npx prisma db push
```

### 4. Run the Development Server
```bash
npm run dev
```

Visit http://localhost:3000

## 📖 Usage
### Generating Speech
1. Sign up or log in to your account

2. Navigate to Studio

3. Enter your text, select language, voice and model

4. Click Generate — audio is created via Gemini TTS

5. Play, download or save to your projects

### Multi-Voice Dialogue
1. Switch to Dialogue mode in the Studio

2. Add multiple speakers with different voices

3. Generate a full conversation scene

### Managing Credits
1. Visit the Pricing page

2. Purchase a plan (Starter / Creator / Pro)

3. Credits are added to your account automatically after payment

## 🔧 Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

npx prisma studio    # Open Prisma Studio GUI
npx prisma db push   # Push schema changes to database
```

## 🌐 Deployment

The app is deployed on Vercel with Cloudflare for DNS and SSL.

1. Push to GitHub

2. Connect repository to Vercel

3. Add all environment variables in Vercel dashboard

4. Deploy — Vercel handles builds automatically on every push

---
If you find this project helpful, please give it a ⭐ on GitHub!

#nextjs15 #typescript #ai #saas #gemini #tts #texttospeech #aws #fullstackdevelopment

