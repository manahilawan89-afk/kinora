# Kinora

A full-stack video-sharing platform for watching and sharing videos and reels.

## Live Demo

https://youtube-bay-xi.vercel.app

## Features

- Video and reel feeds
- YouTube video playback
- Search and category filters
- User authentication
- Channels and subscriptions
- Likes, comments, and view counts
- Create and manage playlists
- Video upload interface
- Light and dark themes
- Responsive design

## Tech Stack

- Frontend: React, Vite, Redux Toolkit, Tailwind CSS, Framer Motion
- Backend: Node.js and Express
- Storage: Local JSON file store
- Authentication: JWT
- Deployment: Vercel

## Run Locally

### Requirements

- Node.js 18 or newer
- npm

### Installation

```bash
git clone https://github.com/manahilawan89-afk/kinora.git
cd kinora
npm run install:all
```

Create the local environment files:

```bash
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env
```

Start the frontend and backend:

```bash
npm run dev
```

Open http://localhost:5173 in your browser. The API runs at
http://localhost:5000.

## Demo Account

- Email: `demo@youtube.com`
- Password: `password123`

## Project Structure

```text
kinora/
├── api/          # Vercel serverless entry point
├── backend/      # Express API and JSON store
├── frontend/     # React application
└── vercel.json   # Deployment configuration
```

## Available Commands

```bash
npm run dev
npm run dev:frontend
npm run dev:backend
npm run build
```

## Deployment Note

The Vercel deployment uses temporary serverless storage. Seeded content remains
available, but newly created accounts, likes, comments, and uploads may reset
after a cold start. Use a hosted database for permanent production data.
