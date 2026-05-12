# OilIntel — Deployment Guide

## Architecture Overview

```
Browser  →  Vercel (Next.js)  →  Backend API  →  PostgreSQL
                                      ↓
                                  AI Server (FastAPI)
```

---

## 1. Frontend → Vercel

### Steps
1. Push repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo
3. Set **Root Directory** to `.` (the repo root)
4. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL` = `https://oilintel-api.onrender.com` *(your backend URL)*
5. Click **Deploy**

Vercel auto-detects Next.js. The `vercel.json` in the repo root handles the rest.

---

## 2. Backend → Render (Easiest)

1. Push repo to GitHub
2. Go to [render.com](https://render.com) → **New** → **Blueprint**
3. Connect your repo — Render auto-reads `render.yaml`
4. It will create:
   - A **Web Service** (Express API on port 4000)
   - A **PostgreSQL** database
5. After deploy, set these env vars in the Render dashboard:
   - `JWT_SECRET` = `<run: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))">`
   - `ALLOWED_ORIGINS` = `https://oilintel.vercel.app`

**Free tier note:** Render free instances spin down after 15 min of inactivity.

---

## 3. Backend → Railway

1. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub**
2. Select your repo
3. Add a **PostgreSQL** plugin from the Railway dashboard
4. Set environment variables:
   - `DATABASE_URL` = *(auto-filled by Railway PostgreSQL plugin)*
   - `JWT_SECRET` = `<strong random secret>`
   - `ALLOWED_ORIGINS` = `https://oilintel.vercel.app`
   - `PORT` = `4000`
5. Railway reads `railway.toml` automatically

---

## 4. Backend → AWS EC2

**Instance:** Ubuntu 22.04 LTS, t3.small (2 GB RAM) minimum

```bash
# 1. SSH into your EC2 instance
ssh -i your-key.pem ubuntu@<EC2-PUBLIC-IP>

# 2. Run the setup script
curl -O https://raw.githubusercontent.com/youruser/oil-platform/main/deploy/ec2-setup.sh
sudo bash ec2-setup.sh

# 3. Clone the repo
git clone https://github.com/youruser/oil-platform.git /opt/oilintel
cd /opt/oilintel/server

# 4. Configure environment
cp .env.example .env
# Edit .env with your DATABASE_URL from /root/db-credentials.txt and JWT_SECRET

# 5. Set up database
cp prisma/schema.prod.prisma prisma/schema.prisma
npm install
npx prisma generate
npx prisma migrate deploy
node prisma/seed.js

# 6. Start with PM2
pm2 start ecosystem.config.js --env production
pm2 save

# 7. Set up Nginx + SSL
sudo cp /opt/oilintel/deploy/nginx.conf /etc/nginx/sites-available/oilintel
# Edit the file: replace yourdomain.com with your actual domain
sudo ln -s /etc/nginx/sites-available/oilintel /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com
```

**Security group rules:** Allow 22 (SSH), 80 (HTTP), 443 (HTTPS) inbound.

---

## 5. Backend → Digital Ocean

### Option A — Droplet (same as EC2)
```bash
# Create Ubuntu 22.04 Droplet (1 GB RAM minimum, 2 GB recommended)
ssh root@<DROPLET-IP>
bash <(curl -s https://raw.githubusercontent.com/youruser/oil-platform/main/deploy/digitalocean-setup.sh)
# Then follow the same steps as EC2 above
```

### Option B — App Platform (managed PaaS)
1. Go to DO App Platform → **New App** → GitHub
2. **Build command:** `cd server && npm install && cp prisma/schema.prod.prisma prisma/schema.prisma && npx prisma generate && npx prisma migrate deploy`
3. **Run command:** `cd server && node index.js`
4. **HTTP port:** `4000`
5. Add a **managed PostgreSQL** database from the Add-Ons section
6. Set env vars: `JWT_SECRET`, `ALLOWED_ORIGINS`, `NODE_ENV=production`

---

## 6. AI Server → Hugging Face Spaces

1. Create a new Space at [huggingface.co/spaces](https://huggingface.co/spaces)
2. Select **Docker** SDK
3. Push the `ai-server/` folder contents as the Space root:
   ```bash
   cd ai-server
   git init
   git remote add origin https://huggingface.co/spaces/youruser/oilintel-ai
   git add .
   git commit -m "initial"
   git push
   ```
4. In Space **Settings → Secrets**, add:
   - `AI_API_KEY` = `<strong random secret>`
   - `ALLOWED_ORIGINS` = `https://oilintel.vercel.app,https://oilintel-api.onrender.com`
5. The Space URL will be: `https://youruser-oilintel-ai.hf.space`
6. Add to Express `.env`: `AI_SERVER_URL=https://youruser-oilintel-ai.hf.space`

**Free tier:** HF Spaces free CPU tier is sufficient for this workload.

---

## 7. AI Server → AWS SageMaker

```bash
# Prerequisites
pip install sagemaker boto3
aws configure  # set your AWS credentials

# Set environment variables
export AWS_REGION=us-east-1
export S3_BUCKET=your-oilintel-bucket
export SAGEMAKER_ROLE_ARN=arn:aws:iam::123456789:role/SageMakerRole
export AI_API_KEY=your-strong-api-key

# Deploy
cd ai-server
python sagemaker/deploy.py
```

After deploying, the endpoint name `oilintel-ai-endpoint` can be called via the AWS SDK.
Add `SAGEMAKER_ENDPOINT_NAME=oilintel-ai-endpoint` to Express `.env` and update `server/routes/ai.js`
to use `@aws-sdk/client-sagemaker-runtime` instead of `fetch`.

---

## 8. Environment Variable Reference

### Frontend (Vercel)
| Variable | Example |
|----------|---------|
| `NEXT_PUBLIC_API_URL` | `https://oilintel-api.onrender.com` |

### Backend (all platforms)
| Variable | Example |
|----------|---------|
| `DATABASE_URL` | `postgresql://user:pass@host:5432/oilintel?sslmode=require` |
| `JWT_SECRET` | 64-char hex string |
| `PORT` | `4000` |
| `ALLOWED_ORIGINS` | `https://oilintel.vercel.app` |
| `AI_SERVER_URL` | `https://youruser-oilintel-ai.hf.space` |
| `AI_API_KEY` | shared secret with AI server |

### AI Server
| Variable | Example |
|----------|---------|
| `AI_API_KEY` | shared secret with Express backend |
| `ALLOWED_ORIGINS` | `https://oilintel-api.onrender.com` |

---

## Recommended Stack (free tier)

| Layer | Platform | Cost |
|-------|----------|------|
| Frontend | Vercel | Free |
| Backend | Render (starter) | $7/mo |
| Database | Render PostgreSQL | $7/mo |
| AI Server | Hugging Face Spaces | Free |
| **Total** | | **~$14/mo** |
