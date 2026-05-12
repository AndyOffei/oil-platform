const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ── Users ────────────────────────────────────────────
  const hashed = await bcrypt.hash("password", 10);
  await prisma.user.deleteMany();
  await prisma.user.createMany({
    data: [
      { id: "usr_1", name: "Bright Offei",     email: "admin@oilintel.com",    password: hashed, role: "superadmin", avatar: "BO", active: true,  createdAt: new Date("2024-01-01") },
      { id: "usr_2", name: "John Okafor",      email: "j.okafor@oilintel.com", password: hashed, role: "analyst",    avatar: "JO", active: true,  createdAt: new Date("2024-02-15") },
      { id: "usr_3", name: "Gloria Gyamfuah", email: "a.hassan@oilintel.com", password: hashed, role: "manager",    avatar: "GG", active: true,  createdAt: new Date("2024-03-10") },
      { id: "usr_4", name: "Samuel Mensah",    email: "s.mensah@oilintel.com", password: hashed, role: "sales",      avatar: "SM", active: false, createdAt: new Date("2024-04-01") },
    ],
  });
  console.log("  ✓ Users");

  // ── Oil Prices (90 days) ─────────────────────────────
  await prisma.oilPrice.deleteMany();
  const prices = Array.from({ length: 90 }, (_, i) => {
    const base = 95 + Math.sin(i / 8) * 12 + Math.random() * 6;
    return {
      date:  new Date(Date.now() - (89 - i) * 86400000).toISOString().split("T")[0],
      brent: parseFloat((base + 4).toFixed(2)),
      wti:   parseFloat((base + 1.2).toFixed(2)),
      opec:  parseFloat((base + 5.8).toFixed(2)),
      dubai: parseFloat((base + 3.1).toFixed(2)),
    };
  });
  await prisma.oilPrice.createMany({ data: prices });
  console.log("  ✓ Oil prices (90 days)");

  // ── Production Fields ────────────────────────────────
  await prisma.productionField.deleteMany();
  await prisma.productionField.createMany({
    data: [
      { region: "West Africa",  country: "Nigeria",      field: "Agbami",         bbl: 55400,  capacity: 60000,  utilization: 92.3, lat: 6.5,  lng: 3.4    },
      { region: "West Africa",  country: "Ghana",        field: "Jubilee",         bbl: 38200,  capacity: 45000,  utilization: 84.9, lat: 5.5,  lng: -0.2   },
      { region: "Gulf States",  country: "Saudi Arabia", field: "Ghawar",          bbl: 142000, capacity: 150000, utilization: 94.7, lat: 24.7, lng: 49.1   },
      { region: "Gulf States",  country: "UAE",          field: "Bu Hasa",         bbl: 71000,  capacity: 80000,  utilization: 88.8, lat: 24.5, lng: 54.4   },
      { region: "North Africa", country: "Libya",        field: "El Sharara",      bbl: 28600,  capacity: 35000,  utilization: 81.7, lat: 28.1, lng: 13.2   },
      { region: "North Africa", country: "Algeria",      field: "Hassi Messaoud",  bbl: 43100,  capacity: 50000,  utilization: 86.2, lat: 31.7, lng: 6.1    },
      { region: "Caspian",      country: "Kazakhstan",   field: "Tengiz",          bbl: 61800,  capacity: 70000,  utilization: 88.3, lat: 45.4, lng: 53.1   },
      { region: "Americas",     country: "USA",          field: "Permian Basin",   bbl: 98400,  capacity: 110000, utilization: 89.5, lat: 31.8, lng: -102.5 },
    ],
  });
  console.log("  ✓ Production fields");

  // ── Refineries ───────────────────────────────────────
  await prisma.refinery.deleteMany();
  await prisma.refinery.createMany({
    data: [
      { id: "R001", name: "Warri Refinery",          country: "Nigeria",      capacity: 125000, throughput: 84000,  efficiency: 67.2, status: "Operational", temp: 412, pressure: 186, hasAlert: false },
      { id: "R002", name: "Port Harcourt Refinery",  country: "Nigeria",      capacity: 210000, throughput: 142000, efficiency: 67.6, status: "Operational", temp: 398, pressure: 192, hasAlert: false },
      { id: "R003", name: "Ras Tanura Refinery",     country: "Saudi Arabia", capacity: 550000, throughput: 512000, efficiency: 93.1, status: "Operational", temp: 445, pressure: 201, hasAlert: false },
      { id: "R004", name: "Tema Oil Refinery",       country: "Ghana",        capacity: 45000,  throughput: 18000,  efficiency: 40.0, status: "Maintenance", temp: 0,   pressure: 0,   hasAlert: true  },
      { id: "R005", name: "Skikda Refinery",         country: "Algeria",      capacity: 300000, throughput: 271000, efficiency: 90.3, status: "Operational", temp: 431, pressure: 198, hasAlert: false },
    ],
  });
  console.log("  ✓ Refineries");

  // ── Alerts ───────────────────────────────────────────
  await prisma.alert.deleteMany();
  await prisma.alert.createMany({
    data: [
      { id: "A001", type: "critical", category: "refinery",   message: "Tema Oil Refinery Unit 3 — Pressure anomaly detected",        time: new Date(Date.now() - 300000),   resolved: false },
      { id: "A002", type: "warning",  category: "price",      message: "Brent crude crossed $102/bbl threshold — 24h high",            time: new Date(Date.now() - 900000),   resolved: false },
      { id: "A003", type: "info",     category: "campaign",   message: "Email campaign 'Q4 Outreach' reached 4,200 recipients",        time: new Date(Date.now() - 1800000),  resolved: true  },
      { id: "A004", type: "warning",  category: "production", message: "Agbami field output 8% below daily target",                    time: new Date(Date.now() - 3600000),  resolved: false },
      { id: "A005", type: "info",     category: "customer",   message: "New enterprise lead: Qatar Energy — $2.8M opportunity",        time: new Date(Date.now() - 5400000),  resolved: true  },
      { id: "A006", type: "critical", category: "refinery",   message: "High temperature alert — Warri Refinery Unit 2 at 98%",       time: new Date(Date.now() - 7200000),  resolved: false },
      { id: "A007", type: "info",     category: "market",     message: "OPEC meeting scheduled Nov 26 — potential supply cut",         time: new Date(Date.now() - 10800000), resolved: true  },
      { id: "A008", type: "warning",  category: "customer",   message: "BP West Africa account At Risk — 62 days since last contact",  time: new Date(Date.now() - 14400000), resolved: false },
    ],
  });
  console.log("  ✓ Alerts");

  // ── Reports ──────────────────────────────────────────
  await prisma.report.deleteMany();
  await prisma.report.createMany({
    data: [
      { id: "RPT001", name: "Q3 2024 Production Summary",    type: "PDF",   size: "2.4 MB", author: "System",    status: "Ready",      downloads: 142, createdAt: new Date("2024-10-01") },
      { id: "RPT002", name: "October Price Analytics Export", type: "Excel", size: "1.1 MB", author: "J. Okafor", status: "Ready",      downloads: 87,  createdAt: new Date("2024-11-01") },
      { id: "RPT003", name: "Q3 CRM Campaign Report",        type: "PDF",   size: "3.8 MB", author: "System",    status: "Ready",      downloads: 64,  createdAt: new Date("2024-10-15") },
      { id: "RPT004", name: "Refinery Efficiency Report",    type: "PDF",   size: "5.2 MB", author: "A. Hassan", status: "Ready",      downloads: 31,  createdAt: new Date("2024-11-05") },
      { id: "RPT005", name: "Regional Sales Performance Q4", type: "Excel", size: "0.9 MB", author: "System",    status: "Generating", downloads: 0,   createdAt: new Date("2024-11-10") },
    ],
  });
  console.log("  ✓ Reports");

  console.log("\n✅ Database seeded successfully!");
  console.log("   Database file: server/prisma/oilintel.db");
}

main()
  .catch((e) => { console.error("❌ Seed failed:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
