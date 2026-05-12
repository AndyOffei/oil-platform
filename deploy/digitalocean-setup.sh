#!/bin/bash
# Digital Ocean Droplet setup (Ubuntu 22.04, 2 GB RAM / 1 vCPU minimum)
# Identical to EC2 setup — DigitalOcean uses the same Ubuntu base
# Run as root on a fresh Droplet: bash digitalocean-setup.sh
set -euo pipefail

echo "=== OilIntel Digital Ocean Setup ==="

apt-get update -y
apt-get install -y curl git nginx certbot python3-certbot-nginx ufw \
                   postgresql postgresql-contrib python3.11 python3.11-venv python3-pip

# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
npm install -g pm2

# PostgreSQL
DB_PASSWORD=$(openssl rand -hex 24)
sudo -u postgres psql <<SQL
CREATE USER oilintel WITH PASSWORD '${DB_PASSWORD}';
CREATE DATABASE oilintel OWNER oilintel;
GRANT ALL PRIVILEGES ON DATABASE oilintel TO oilintel;
SQL
echo "DATABASE_URL=postgresql://oilintel:${DB_PASSWORD}@localhost:5432/oilintel?sslmode=disable" \
  > /root/db-env.txt
chmod 600 /root/db-env.txt

# Firewall
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

# DigitalOcean App Platform alternative:
# If using DO App Platform (PaaS) instead of a Droplet,
# set these environment variables in the dashboard:
#   - NODE_ENV=production
#   - DATABASE_URL=<DO managed PostgreSQL connection string>
#   - JWT_SECRET=<random 64-char hex>
#   - ALLOWED_ORIGINS=https://oilintel.vercel.app
#
# Build command:  cd server && npm install && cp prisma/schema.prod.prisma prisma/schema.prisma && npx prisma generate && npx prisma migrate deploy
# Run command:    cd server && node index.js
# HTTP port:      4000

echo ""
echo "DB credentials saved to /root/db-env.txt"
echo "Follow the same steps as ec2-setup.sh to deploy the app."
