---
title: OilIntel AI API
emoji: 🛢️
colorFrom: blue
colorTo: indigo
sdk: docker
app_port: 8000
pinned: false
license: mit
---

# OilIntel AI Server

FastAPI-based oil market AI endpoints — deployable as a Hugging Face Space (Docker SDK).

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Liveness check |
| POST | `/predict/prices` | GBM price forecast (7–90 days) |
| POST | `/predict/demand` | Quarterly demand by region |
| POST | `/predict/anomalies` | Z-score anomaly detection |
| GET | `/predict/sentiment` | Aggregated market sentiment |

Interactive docs: `https://<your-space>.hf.space/docs`

## Authentication

All prediction endpoints require a Bearer token:

```
Authorization: Bearer <AI_API_KEY>
```

Set the `AI_API_KEY` secret in your Space settings (default dev key: `oilintel-ai-dev-key`).

## Deploy to Hugging Face Spaces

1. Create a new Space → **Docker** SDK
2. Push this `ai-server/` folder as the Space root
3. Add Secrets in Space settings:
   - `AI_API_KEY` — shared secret (must match `AI_SERVER_KEY` in Express `.env`)
   - `ALLOWED_ORIGINS` — e.g. `https://oilintel.vercel.app`

## Local development

```bash
cd ai-server
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
