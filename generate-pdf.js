const puppeteer = require('puppeteer');

(async () => {
  try {
    console.log('Starting Puppeteer PDF generation...');
    
    // Launch browser with proper settings for GitHub Actions
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    // English version
    console.log('Generating English PDF...');
    const pageEN = await browser.newPage();
    await pageEN.goto('http://localhost:4000/print-resume/', {
      waitUntil: 'networkidle0',
      timeout: 60000
    });
    
    // Wait for any JavaScript to execute
    await pageEN.waitForTimeout(2000);
    
    // Generate PDF
    await pageEN.pdf({
      path: './_site/kristof-riebbels-resume-en-puppeteer.pdf',
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
    const pageNL = await browser.newPage();
    await pageNL.goto('http://localhost:4000/nl/print-resume/', {
      waitUntil: 'networkidle0',
      timeout: 60000
    });
    
    // Wait for any JavaScript to execute
    await pageNL.waitForTimeout(2000);
    
    // Generate PDF
    await pageNL.pdf({
      path: './_site/nl/kristof-riebbels-resume-nl-puppeteer.pdf',
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