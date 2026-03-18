const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:4000';

test.describe('Navigation Menu Tests', () => {

  test('English: "Work Experience" link should navigate correctly', async ({ page }) => {
    // Go to the English Resume page (which has a sidebar)
    await page.goto(`${BASE_URL}/resume/`);

    // Click the "Work Experience" link in the sidebar
    // We target the link by its text content "Work Experience"
    await page.getByRole('link', { name: 'Work Experience' }).click();

    // Expect the URL to contain /work-experience/
    await expect(page).toHaveURL(/.*\/work-experience\//);
    
    // Verify the heading on the page to ensure content loaded
    await expect(page.locator('h1')).toContainText('Work Experience');
  });

  test('Dutch: "Werkervaring" link should navigate correctly', async ({ page }) => {
    // Go to the Dutch Resume page
    await page.goto(`${BASE_URL}/nl/cv/`);

    // Click the "Werkervaring" link in the sidebar
    await page.getByRole('link', { name: 'Werkervaring' }).click();

    // Expect the URL to contain /nl/werkervaring/
    await expect(page).toHaveURL(/.*\/nl\/werkervaring\//);

    // Verify the heading on the page
    await expect(page.locator('h1')).toContainText('Werkervaring');
  });

  test('Verify all sidebar links have valid hrefs', async ({ page }) => {
    // Go to the English Resume page
    await page.goto(`${BASE_URL}/resume/`);
    
    // Select all links in the sidebar
    const links = await page.locator('.sidebar a').all();
    
    console.log(`Found ${links.length} links in sidebar:`);
    for (const link of links) {
      const text = await link.textContent();
      const href = await link.getAttribute('href');
      console.log(`- Text: "${text.trim()}", Href: "${href}"`);
      
      // Check that href is not empty and not just '#'
      expect(href).toBeTruthy();
      expect(href).not.toBe('#');
      expect(href).not.toBe('');
    }
  });

});