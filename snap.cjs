const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  await page.goto('http://localhost:3000/login');
  await page.fill('input[type="email"]', 'admin@oilintel.com');
  await page.fill('input[type="password"]', 'password');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard', { timeout: 12000 }).catch(() => {});
  await page.waitForTimeout(2000);

  // AI Predictions
  await page.goto('http://localhost:3000/ai-predictions');
  await page.waitForTimeout(4000);
  await page.screenshot({ path: './public/ss_predictions.png' });
  console.log('predictions done');

  // CRM Overview
  await page.goto('http://localhost:3000/crm');
  await page.waitForTimeout(3500);
  await page.screenshot({ path: './public/ss_crm_overview.png' });
  console.log('crm overview done');

  // Sales Analytics
  await page.click('button:has-text("Sales Analytics")');
  await page.waitForTimeout(2500);
  await page.screenshot({ path: './public/ss_crm_sales.png' });
  console.log('sales analytics done');

  // Campaigns
  await page.click('button:has-text("Campaigns")');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: './public/ss_crm_campaigns.png' });
  console.log('campaigns done');

  await browser.close();
})();
