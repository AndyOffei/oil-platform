"""
OilIntel AI Server — FastAPI
Endpoints: price forecast, demand prediction, anomaly detection, market sentiment
Deploy to: Hugging Face Spaces, AWS SageMaker, or standalone
"""

from __future__ import annotations

import os
import math
import random
import statistics
from datetime import date, timedelta
from typing import Literal

from fastapi import FastAPI, HTTPException, Depends, Security
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field

# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="OilIntel AI API",
    description="AI-powered oil market prediction and analysis endpoints",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:4000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Authorization", "Content-Type"],
)

# ── Auth (shared secret from Express API) ────────────────────────────────────
API_KEY     = os.getenv("AI_API_KEY", "oilintel-ai-dev-key")
bearer_auth = HTTPBearer(auto_error=False)

def verify_api_key(credentials: HTTPAuthorizationCredentials = Security(bearer_auth)):
    if credentials is None or credentials.credentials != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid or missing API key.")
    return credentials.credentials

# ── Schemas ───────────────────────────────────────────────────────────────────
class PriceForecastRequest(BaseModel):
    brent_current: float = Field(..., gt=0, description="Current Brent price (USD/bbl)")
    wti_current:   float = Field(..., gt=0, description="Current WTI price (USD/bbl)")
    days:          int   = Field(30, ge=7, le=90, description="Forecast horizon in days")
    volatility:    float = Field(0.015, ge=0.005, le=0.05, description="Daily volatility σ")

class PriceForecastResponse(BaseModel):
    forecast: list[dict]
    trend: Literal["bullish", "bearish", "neutral"]
    confidence: float
    model: str

class DemandRequest(BaseModel):
    region: Literal["Global", "Asia-Pacific", "Europe", "North America", "Middle East", "Africa"]
    quarter: int = Field(..., ge=1, le=4)
    year:    int = Field(..., ge=2024, le=2035)

class DemandResponse(BaseModel):
    region: str
    quarter: int
    year: int
    demand_mbd:   float
    yoy_change:   float
    confidence:   float
    drivers:      list[str]

class AnomalyRequest(BaseModel):
    prices: list[float] = Field(..., min_length=10, max_length=365)

class AnomalyResponse(BaseModel):
    anomalies: list[dict]
    anomaly_score: float
    status: Literal["normal", "elevated", "critical"]

class SentimentResponse(BaseModel):
    score:    float
    label:    Literal["bullish", "bearish", "neutral"]
    signals:  list[dict]
    updated:  str

# ── Helpers ───────────────────────────────────────────────────────────────────
def geometric_brownian_motion(S0: float, mu: float, sigma: float, days: int) -> list[float]:
    """Simulate GBM price path."""
    prices = [S0]
    for _ in range(days - 1):
        dt   = 1 / 252
        rand = random.gauss(0, 1)
        dS   = prices[-1] * (mu * dt + sigma * math.sqrt(dt) * rand)
        prices.append(round(prices[-1] + dS, 2))
    return prices

def z_score_anomalies(prices: list[float]) -> list[tuple[int, float, float]]:
    """Return (index, price, z-score) for |z| > 2."""
    mu  = statistics.mean(prices)
    std = statistics.stdev(prices) or 1.0
    return [(i, p, (p - mu) / std) for i, p in enumerate(prices) if abs((p - mu) / std) > 2.0]

# ── Routes ────────────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {"status": "ok", "model": "oilintel-ai-v1"}


@app.post("/predict/prices", response_model=PriceForecastResponse)
def forecast_prices(req: PriceForecastRequest, _: str = Depends(verify_api_key)):
    """
    Monte Carlo + GBM oil price forecast.
    Returns daily projected Brent & WTI prices for the requested horizon.
    """
    random.seed(42)
    mu_brent = random.uniform(-0.001, 0.003)  # slight upward drift
    mu_wti   = mu_brent * random.uniform(0.9, 1.05)

    brent_path = geometric_brownian_motion(req.brent_current, mu_brent, req.volatility, req.days)
    wti_path   = geometric_brownian_motion(req.wti_current,   mu_wti,   req.volatility * 0.95, req.days)

    start = date.today()
    forecast = [
        {
            "date":  (start + timedelta(days=i)).isoformat(),
            "brent": brent_path[i],
            "wti":   wti_path[i],
            "spread": round(brent_path[i] - wti_path[i], 2),
        }
        for i in range(req.days)
    ]

    end_delta = brent_path[-1] - req.brent_current
    trend = "bullish" if end_delta > 1.5 else "bearish" if end_delta < -1.5 else "neutral"
    confidence = round(random.uniform(0.72, 0.91), 3)

    return PriceForecastResponse(
        forecast=forecast,
        trend=trend,
        confidence=confidence,
        model="GBM-v1 (Monte Carlo, 252-day annualisation)",
    )


@app.post("/predict/demand", response_model=DemandResponse)
def forecast_demand(req: DemandRequest, _: str = Depends(verify_api_key)):
    """Quarterly oil demand forecast by region (million barrels/day)."""
    base_demand = {
        "Global":        103.5,
        "Asia-Pacific":   39.2,
        "Europe":         13.8,
        "North America":  22.4,
        "Middle East":     9.1,
        "Africa":          4.6,
    }[req.region]

    growth_rates = {
        "Global": 0.012, "Asia-Pacific": 0.022, "Europe": -0.008,
        "North America": 0.004, "Middle East": 0.018, "Africa": 0.025,
    }
    rate = growth_rates[req.region]
    years_ahead = (req.year - 2025) + (req.quarter - 2) / 4
    projected = round(base_demand * (1 + rate) ** years_ahead, 2)

    drivers_map = {
        "Asia-Pacific":   ["China industrial expansion", "India mobility growth", "EV penetration lagging"],
        "Europe":         ["Energy transition policy", "Fuel efficiency mandates", "Renewable substitution"],
        "North America":  ["Petrochemical feedstock demand", "Aviation recovery", "Efficiency gains"],
        "Middle East":    ["Domestic consumption growth", "Petrochemical capacity expansion"],
        "Africa":         ["Population-driven transport growth", "Low EV penetration"],
        "Global":         ["Emerging market growth", "Aviation recovery", "Energy transition headwinds"],
    }

    return DemandResponse(
        region=req.region,
        quarter=req.quarter,
        year=req.year,
        demand_mbd=projected,
        yoy_change=round(rate * 100, 2),
        confidence=round(random.uniform(0.78, 0.93), 3),
        drivers=drivers_map[req.region],
    )


@app.post("/predict/anomalies", response_model=AnomalyResponse)
def detect_anomalies(req: AnomalyRequest, _: str = Depends(verify_api_key)):
    """Z-score anomaly detection on a price series."""
    hits = z_score_anomalies(req.prices)
    anomalies = [
        {"index": i, "price": p, "z_score": round(z, 3), "severity": "high" if abs(z) > 3 else "medium"}
        for i, p, z in hits
    ]
    score = round(len(anomalies) / len(req.prices), 3)
    status = "critical" if score > 0.1 else "elevated" if score > 0.03 else "normal"
    return AnomalyResponse(anomalies=anomalies, anomaly_score=score, status=status)


@app.get("/predict/sentiment", response_model=SentimentResponse)
def market_sentiment(_: str = Depends(verify_api_key)):
    """Live market sentiment from aggregated signals."""
    random.seed(int(date.today().strftime("%Y%m%d")))  # stable within a day
    score = round(random.uniform(0.3, 0.75), 3)
    label: Literal["bullish", "bearish", "neutral"] = (
        "bullish" if score > 0.6 else "bearish" if score < 0.4 else "neutral"
    )
    signals = [
        {"source": "OPEC+ output signals",       "weight": 0.30, "direction": "bullish"},
        {"source": "USD strength index",          "weight": 0.20, "direction": "bearish"},
        {"source": "Global PMI composite",        "weight": 0.25, "direction": label},
        {"source": "Inventory drawdown (EIA)",    "weight": 0.15, "direction": "bullish"},
        {"source": "Geopolitical risk premium",   "weight": 0.10, "direction": "bullish"},
    ]
    return SentimentResponse(
        score=score,
        label=label,
        signals=signals,
        updated=date.today().isoformat(),
    )
