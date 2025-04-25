/**
 * Language Switcher for multilingual Jekyll site
 * Works with the polyglot plugin and routes.yml
 */

// Simple direct URL switch when routes.yml data is available
function switchLanguage(targetUrl) {
  // Get the site base URL
  const siteUrl = window.location.origin;
  
  // Redirect to the new URL (add origin if it's a relative URL)
  if (targetUrl.startsWith('/')) {
    window.location.href = siteUrl + targetUrl;
  } else {
    window.location.href = targetUrl;
  }
}

// Fallback function for when routes.yml data isn't available
function switchToLanguage(targetLang, defaultLang, currentUrl) {
  let newUrl;
  const siteUrl = window.location.origin;
  
  // Handle the URL structure based on target language
  if (targetLang === defaultLang) {
    // For default language, remove any language prefix
    let path = currentUrl;
    path = path.replace(/^\/[a-z]{2}\//, '/');
    newUrl = siteUrl + path;
  } else {
    // For non-default languages, add the language code prefix
    let path = currentUrl;
    path = path.replace(/^\/[a-z]{2}\//, '/');
    newUrl = siteUrl + '/' + targetLang + path;
  }
  
  // Redirect to the new URL
  window.location.href = newUrl;
}

// Dropdown functionality
document.addEventListener('DOMContentLoaded', function() {
  const languageTrigger = document.querySelector('.language-trigger');
  const languageDropdown = document.querySelector('.language-dropdown');
  
  if (languageTrigger && languageDropdown) {
    // Toggle dropdown on click
    languageTrigger.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      languageDropdown.classList.toggle('open');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
      if (!languageTrigger.contains(e.target) && !languageDropdown.contains(e.target)) {
        languageDropdown.classList.remove('open');
      }
    });
  }
});