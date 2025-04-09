const { chromium } = require('@playwright/test');

(async () => {
  try {
    console.log('Starting Playwright PDF generation...');
    
    // Launch browser
    const browser = await chromium.launch();
    
    // English version
    console.log('Generating English PDF...');
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('http://localhost:4000/print-resume/', {
      waitUntil: 'networkidle'
    });
    
    // Generate PDF
    await page.pdf({
      path: './_site/kristof-riebbels-resume-en.pdf',
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
    const nlPage = await context.newPage();
    await nlPage.goto('http://localhost:4000/nl/print-resume/', {
      waitUntil: 'networkidle'
    });
    
    // Generate PDF
    await nlPage.pdf({
      path: './_site/nl/kristof-riebbels-resume-nl.pdf',
      format: 'A4',
      printBackground: true,
      margin: {
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm'
      }
    });
    
    await browser.close();
    console.log('PDF generation completed successfully!');
  } catch (error) {
    console.error('Error generating PDFs:', error);
    process.exit(1);
  }
})();