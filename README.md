# render-proj

A simple Dockerized Node.js app, hosted on GitHub and deployed to [Render](https://render.com).

## Endpoints

| Path        | Description                  |
|-------------|------------------------------|
| `/`         | Landing page                 |
| `/api/info` | JSON server info             |
| `/health`   | Health check (used by Render)|

## Run locally

```bash
# Without Docker
npm start            # http://localhost:10000

# With Docker
docker build -t render-proj .
docker run -p 10000:10000 render-proj
```

## Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/render-proj.git
git push -u origin main
```

## Deploy to Render

**Option A – Blueprint (uses `render.yaml`)**
1. Render Dashboard → **New** → **Blueprint**
2. Connect your GitHub repo → **Apply**

**Option B – Manual**
1. Render Dashboard → **New** → **Web Service**
2. Connect your GitHub repo
3. Language: **Docker** (auto-detected from `Dockerfile`)
4. Health Check Path: `/health` → **Create Web Service**

Every push to `main` triggers an automatic redeploy.
