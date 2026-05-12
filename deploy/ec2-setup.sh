#!/bin/bash
# AWS EC2 setup script for OilIntel
# Tested on Ubuntu 22.04 LTS (t3.small or larger)
# Run as: sudo bash ec2-setup.sh
set -euo pipefail

echo "=== OilIntel EC2 Setup ==="

# ── System packages ───────────────────────────────────────────────────────────
apt-get update -y
apt-get install -y curl git nginx certbot python3-certbot-nginx ufw postgresql postgresql-contrib

# ── Node.js 20 ────────────────────────────────────────────────────────────────
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
node -v && npm -v

# ── PM2 (process manager) ────────────────────────────────────────────────────
npm install -g pm2
pm2 startup systemd -u ubuntu --hp /home/ubuntu

# ── Python 3.11 + FastAPI dependencies ───────────────────────────────────────
apt-get install -y python3.11 python3.11-venv python3-pip

# ── PostgreSQL — create DB and user ──────────────────────────────────────────
DB_PASSWORD=$(openssl rand -hex 24)
sudo -u postgres psql <<SQL
CREATE USER oilintel WITH PASSWORD '${DB_PASSWORD}';
CREATE DATABASE oilintel OWNER oilintel;
GRANT ALL PRIVILEGES ON DATABASE oilintel TO oilintel;
SQL
echo "PostgreSQL password: ${DB_PASSWORD}" > /root/db-credentials.txt
chmod 600 /root/db-credentials.txt
echo "[db] Credentials saved to /root/db-credentials.txt"

# ── Firewall ──────────────────────────────────────────────────────────────────
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

# ── Clone / deploy app ────────────────────────────────────────────────────────
APP_DIR="/opt/oilintel"
mkdir -p "${APP_DIR}"

echo ""
echo "=== Manual steps remaining ==="
echo "1. Copy your app to ${APP_DIR}:"
echo "   git clone https://github.com/youruser/oil-platform.git ${APP_DIR}"
echo ""
echo "2. Set up backend .env:"
echo "   cd ${APP_DIR}/server && cp .env.example .env"
echo "   # Edit .env: set DATABASE_URL with password from /root/db-credentials.txt"
echo "   # Set JWT_SECRET to a strong random value"
echo ""
echo "3. Install & migrate backend:"
echo "   cd ${APP_DIR}/server"
echo "   npm install"
echo "   cp prisma/schema.prod.prisma prisma/schema.prisma"
echo "   npx prisma generate && npx prisma migrate deploy && node prisma/seed.js"
echo ""
echo "4. Start backend with PM2:"
echo "   pm2 start ecosystem.config.js --env production"
echo "   pm2 save"
echo ""
echo "5. Build & start frontend:"
echo "   cd ${APP_DIR}"
echo "   NEXT_PUBLIC_API_URL=https://api.yourdomain.com npm run build"
echo "   pm2 start 'npm run start' --name oilintel-web"
echo "   pm2 save"
echo ""
echo "6. Set up Nginx:"
echo "   cp ${APP_DIR}/deploy/nginx.conf /etc/nginx/sites-available/oilintel"
echo "   # Edit the file and replace yourdomain.com"
echo "   ln -s /etc/nginx/sites-available/oilintel /etc/nginx/sites-enabled/"
echo "   nginx -t && systemctl reload nginx"
echo ""
echo "7. SSL with Let's Encrypt:"
echo "   certbot --nginx -d yourdomain.com -d api.yourdomain.com"
echo ""
echo "Setup complete."
