# Cloud Deployment Guide: National Scholarship Portal (EligiFind)

This project is architected as a complete full-stack web application with **Frontend (React 19 + Vite + TailwindCSS + PWA)** and **Backend (Express API + 82 Scholarships Dataset)**.

---

## ⚡ Option 1: 1-Click Free Deployment on Render (Recommended)

Render offers free Node.js web service hosting that runs both your frontend and backend on a single live URL with automated HTTPS.

### Steps:
1. Push your project to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "National Scholarship Portal with PWA & UI Enhancements"
   git remote add origin https://github.com/YOUR_USERNAME/nsp-eligifind-portal.git
   git branch -M main
   git push -u origin main
   ```
2. Go to **[Render.com Dashboard](https://dashboard.render.com/)** and sign in with GitHub.
3. Click **New +** ➔ **Web Service**.
4. Select your `nsp-eligifind-portal` repository.
5. Fill in the deployment settings:
   - **Name**: `eligifind-scholarship-portal`
   - **Environment**: `Node`
   - **Region**: `Singapore` or `Frankfurt` (closest to your users)
   - **Branch**: `main`
   - **Build Command**: `npm run build`
   - **Start Command**: `node backend/server.js`
   - **Instance Type**: `Free`
6. Click **Deploy Web Service**!
7. Render will automatically build the React frontend into `frontend/dist` and start the Express server, serving both the API and the web interface at:
   `https://eligifind-scholarship-portal.onrender.com`

*(A pre-configured `render.yaml` blueprint is already included in your root folder for automated infrastructure deployment).*

---

## ⚡ Option 2: 1-Click Deployment on Vercel

Vercel is ideal for lightning-fast edge delivery. A configured [`vercel.json`](file:///d:/PBL/PROJECT/NSP%20S7%20MP/vercel.json) is already created in your project root.

### Steps:
1. Install the Vercel CLI or deploy via GitHub:
   ```bash
   npm install -g vercel
   vercel
   ```
2. Or open **[Vercel Dashboard](https://vercel.com/)** ➔ Click **Add New Project** ➔ Import Git Repository.
3. Vercel will automatically detect `vercel.json` and deploy both the serverless API routes (`/api/*`) and the static PWA frontend!

---

## ⚡ Option 3: 1-Click Deployment on Railway.app

Railway provides free starter credits with instant zero-configuration builds.

### Steps:
1. Open **[Railway.app](https://railway.app/)** ➔ Click **New Project**.
2. Select **Deploy from GitHub Repo**.
3. Choose your repository.
4. Set the Start Command: `node backend/server.js`.
5. Railway will detect the Node.js project and deploy it instantly with a custom `.up.railway.app` URL.

---

## 🖥️ Local Full-Stack Production Testing

To test the unified production build on your local machine before cloud deployment:

```bash
# 1. Build the frontend production bundle
npm run build

# 2. Run the unified full-stack server
npm run serve
```

Open: **`http://localhost:5000`** — The Express server will serve the complete React PWA application and the API from a single port!
