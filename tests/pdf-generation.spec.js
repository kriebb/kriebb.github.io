// @ts-check
const { test } = require('@playwright/test');

test('Generate Resume PDFs @pdf', async ({ page }) => {
  // English version
  console.log('Generating English PDF...');
  // The baseURL is configured in playwright.config.js (http://localhost:4000)
  await page.goto('/print-resume/', { waitUntil: 'networkidle' });
  
  await page.pdf({
    path: './kristof-riebbels-resume-en.pdf',
    format: 'A4',
    printBackground: true,
    margin: {
      top: '10mm',
      right: '10mm',
      bottom: '10mm',
      left: '10mm'
    }
  });

  // Dutch version
  console.log('Generating Dutch PDF...');
  await page.goto('/nl/print-resume/', { waitUntil: 'networkidle' });
  
  await page.pdf({
    path: './_site/kristof-riebbels-resume-nl.pdf',
    format: 'A4',
    printBackground: true,
    margin: {
      top: '10mm',
      right: '10mm',
      bottom: '10mm',
      left: '10mm'
    }
  });
});
