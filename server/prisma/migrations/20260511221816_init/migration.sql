-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'analyst',
    "avatar" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "OilPrice" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" TEXT NOT NULL,
    "brent" REAL NOT NULL,
    "wti" REAL NOT NULL,
    "opec" REAL NOT NULL,
    "dubai" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "ProductionField" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "region" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "bbl" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL,
    "utilization" REAL NOT NULL,
    "lat" REAL NOT NULL,
    "lng" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "Refinery" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "throughput" INTEGER NOT NULL,
    "efficiency" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Operational',
    "temp" INTEGER NOT NULL,
    "pressure" INTEGER NOT NULL,
    "hasAlert" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "size" TEXT NOT NULL DEFAULT '—',
    "author" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Generating',
    "downloads" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    CONSTRAINT "Report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "OilPrice_date_key" ON "OilPrice"("date");

-- CreateIndex
CREATE UNIQUE INDEX "ProductionField_field_key" ON "ProductionField"("field");
