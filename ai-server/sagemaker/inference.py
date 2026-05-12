"""
AWS SageMaker inference handler for OilIntel AI models.
Package this file + requirements.txt into a tar.gz and upload to S3,
then create a SageMaker Model pointing at the tar.gz.

Deploy steps:
  1. pip install sagemaker boto3
  2. python sagemaker/deploy.py
"""

import os
import json
import math
import random
import statistics
from datetime import date, timedelta


def model_fn(model_dir: str):
    """SageMaker calls this once at container startup."""
    return {"loaded": True, "model_dir": model_dir}


def input_fn(request_body: str, content_type: str = "application/json") -> dict:
    if content_type != "application/json":
        raise ValueError(f"Unsupported content type: {content_type}")
    return json.loads(request_body)


def predict_fn(data: dict, model: dict) -> dict:
    """Route to the correct prediction function based on 'endpoint' key."""
    endpoint = data.get("endpoint", "prices")

    if endpoint == "prices":
        return _forecast_prices(data)
    elif endpoint == "demand":
        return _forecast_demand(data)
    elif endpoint == "anomalies":
        return _detect_anomalies(data)
    elif endpoint == "sentiment":
        return _market_sentiment()
    else:
        raise ValueError(f"Unknown endpoint: {endpoint}")


def output_fn(prediction: dict, accept: str = "application/json") -> str:
    return json.dumps(prediction)


# ── Prediction logic (mirrors main.py) ───────────────────────────────────────

def _gbm(S0, mu, sigma, days):
    prices = [S0]
    for _ in range(days - 1):
        dt   = 1 / 252
        rand = random.gauss(0, 1)
        dS   = prices[-1] * (mu * dt + sigma * math.sqrt(dt) * rand)
        prices.append(round(prices[-1] + dS, 2))
    return prices


def _forecast_prices(data: dict) -> dict:
    random.seed(42)
    brent  = float(data.get("brent_current", 85.0))
    wti    = float(data.get("wti_current", 81.0))
    days   = int(data.get("days", 30))
    vol    = float(data.get("volatility", 0.015))

    mu = random.uniform(-0.001, 0.003)
    bp = _gbm(brent, mu, vol, days)
    wp = _gbm(wti, mu * 0.97, vol * 0.95, days)
    start = date.today()

    return {
        "forecast": [
            {"date": (start + timedelta(i)).isoformat(), "brent": bp[i], "wti": wp[i]}
            for i in range(days)
        ],
        "trend":      "bullish" if bp[-1] - brent > 1.5 else "bearish" if bp[-1] - brent < -1.5 else "neutral",
        "confidence": round(random.uniform(0.72, 0.91), 3),
    }


def _forecast_demand(data: dict) -> dict:
    base = {"Global": 103.5, "Asia-Pacific": 39.2, "Europe": 13.8,
            "North America": 22.4, "Middle East": 9.1, "Africa": 4.6}
    growth = {"Global": 0.012, "Asia-Pacific": 0.022, "Europe": -0.008,
              "North America": 0.004, "Middle East": 0.018, "Africa": 0.025}
    region = data.get("region", "Global")
    year   = int(data.get("year", 2025))
    q      = int(data.get("quarter", 1))
    yrs    = (year - 2025) + (q - 2) / 4
    projected = round(base[region] * (1 + growth[region]) ** yrs, 2)
    return {"region": region, "demand_mbd": projected, "yoy_change": round(growth[region] * 100, 2)}


def _detect_anomalies(data: dict) -> dict:
    prices = [float(p) for p in data.get("prices", [])]
    if len(prices) < 2:
        return {"anomalies": [], "anomaly_score": 0, "status": "normal"}
    mu  = statistics.mean(prices)
    std = statistics.stdev(prices) or 1.0
    hits = [{"index": i, "price": p, "z_score": round((p - mu) / std, 3)}
            for i, p in enumerate(prices) if abs((p - mu) / std) > 2.0]
    score = round(len(hits) / len(prices), 3)
    return {"anomalies": hits, "anomaly_score": score,
            "status": "critical" if score > 0.1 else "elevated" if score > 0.03 else "normal"}


def _market_sentiment() -> dict:
    random.seed(int(date.today().strftime("%Y%m%d")))
    score = round(random.uniform(0.3, 0.75), 3)
    label = "bullish" if score > 0.6 else "bearish" if score < 0.4 else "neutral"
    return {"score": score, "label": label, "updated": date.today().isoformat()}
