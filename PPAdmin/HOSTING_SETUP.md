# Hosting Setup for Pondy Admin

## Step 1 — Set Environment Variables on your hosting platform

Add these two variables in your hosting dashboard (Netlify/Vercel/etc):

```
VITE_SUPABASE_URL = https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY = eyJ...your-anon-key...
```

## Step 2 — Build the app

```bash
npm install
npm run build
```

Then deploy the `dist/` folder.

## Step 3 — SPA routing (already configured)

- Netlify: `public/_redirects` is included ✓  
- Vercel: `vercel.json` is included ✓  
- Other: Serve `index.html` for all routes

## Login credentials

Username: `admin`  
Password: `admin123`

> Change these in `src/pages/LoginPage.jsx` lines 4–5 before going live.
