"""
Deploy OilIntel AI to AWS SageMaker.
Run: python sagemaker/deploy.py

Prerequisites:
  pip install sagemaker boto3
  aws configure  (or set AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY env vars)
"""

import os
import tarfile
import boto3
import sagemaker
from sagemaker.sklearn.estimator import SKLearn
from sagemaker.model import Model
from sagemaker.predictor import Predictor
from sagemaker.serializers import JSONSerializer
from sagemaker.deserializers import JSONDeserializer

REGION         = os.getenv("AWS_REGION", "us-east-1")
BUCKET         = os.getenv("S3_BUCKET", "oilintel-sagemaker")
ROLE_ARN       = os.getenv("SAGEMAKER_ROLE_ARN")   # IAM role with SageMaker + S3 access
ENDPOINT_NAME  = "oilintel-ai-endpoint"

session = sagemaker.Session(boto_session=boto3.Session(region_name=REGION))

# ── 1. Package model artifacts ────────────────────────────────────────────────
print("Packaging model artifacts...")
with tarfile.open("/tmp/oilintel-model.tar.gz", "w:gz") as tar:
    tar.add("inference.py")
    tar.add("../requirements.txt", arcname="requirements.txt")

s3 = boto3.client("s3", region_name=REGION)
s3.upload_file("/tmp/oilintel-model.tar.gz", BUCKET, "models/oilintel-model.tar.gz")
model_uri = f"s3://{BUCKET}/models/oilintel-model.tar.gz"
print(f"Uploaded to {model_uri}")

# ── 2. Create SageMaker Model ─────────────────────────────────────────────────
print("Creating SageMaker model...")
model = SKLearn(
    entry_point  = "inference.py",
    role         = ROLE_ARN,
    instance_type= "ml.m5.large",
    framework_version= "1.2-1",
    model_data   = model_uri,
    sagemaker_session= session,
    env={
        "AI_API_KEY": os.getenv("AI_API_KEY", "oilintel-ai-dev-key"),
    },
)

# ── 3. Deploy endpoint ────────────────────────────────────────────────────────
print(f"Deploying endpoint: {ENDPOINT_NAME} (this takes ~5 minutes)...")
predictor = model.deploy(
    initial_instance_count= 1,
    instance_type          = "ml.m5.large",
    endpoint_name          = ENDPOINT_NAME,
    serializer             = JSONSerializer(),
    deserializer           = JSONDeserializer(),
)

# ── 4. Test ───────────────────────────────────────────────────────────────────
print("Testing endpoint...")
result = predictor.predict({"endpoint": "sentiment"})
print("Sentiment result:", result)

print(f"\nEndpoint deployed: {ENDPOINT_NAME}")
print("Add SAGEMAKER_ENDPOINT_NAME to your Express .env to route AI calls here.")
