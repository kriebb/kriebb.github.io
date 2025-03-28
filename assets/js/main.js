if (typeof AOS !== 'undefined') {
  AOS.init({
    once: true,
    offset: 120,
    delay: 0,
    duration: 800
  });
}

/**
 * Enhanced language switcher functionality
 * - Supports adding new languages beyond just EN/NL
 * - Persists language preference in localStorage
 * - Works with Jekyll's multilingual setup
 */
document.addEventListener('DOMContentLoaded', function() {
  // Get references to the language elements
  const languageSwitcher = document.querySelector('.language-switcher-container');
  if (!languageSwitcher) return;
  
  const trigger = languageSwitcher.querySelector('.language-trigger');
  const dropdown = languageSwitcher.querySelector('.language-dropdown');
  const languageOptions = dropdown.querySelectorAll('.language-option');
  
  // Get routes data from the embedded script (this assumes your routes data is embedded in a script tag)
  let siteRoutes = {};
  const routesData = document.getElementById('site-routes-data');
  if (routesData) {
    try {
      siteRoutes = JSON.parse(routesData.textContent).routes;
    } catch (e) {
      console.error('Error parsing routes data:', e);
    }
  }
});


document.addEventListener('DOMContentLoaded', function() {
  // Get reference to the language switcher container
  const languageSwitcherContainer = document.querySelector('.language-switcher-container');
  
  // Guard clause: exit if language switcher doesn't exist on page
  if (!languageSwitcherContainer) {
    return;
  }
  
  // Get references to the elements inside the language switcher
  const trigger = languageSwitcherContainer.querySelector('.language-trigger');
  const dropdown = languageSwitcherContainer.querySelector('.language-dropdown');
  
  // Guard clause: exit if required elements don't exist
  if (!trigger || !dropdown) {
    console.error('Language switcher is missing required elements');
    return;
  }
  
  // Get route mapping data if available
  let routesData = {};
  const routesDataElement = document.getElementById('site-routes-data');
  if (routesDataElement) {
    try {
      routesData = JSON.parse(routesDataElement.textContent).routes || {};
    } catch (e) {
      console.error('Error parsing routes data:', e);
    }
  }
  
  // Toggle dropdown visibility when trigger is clicked
  trigger.addEventListener('click', function(e) {
    e.preventDefault();
    dropdown.classList.toggle('open');
  });
  
  // Handle language option clicks
  const languageOptions = dropdown.querySelectorAll('.language-option');
  languageOptions.forEach(option => {
    option.addEventListener('click', function(e) {
      // Get the target language
      const targetLang = this.getAttribute('data-lang');
      if (!targetLang) return;
      
      // Save language preference to localStorage
      localStorage.setItem('preferredLanguage', targetLang);
      
      // Get the current page ref from meta tag if available
      const pageRefMeta = document.querySelector('meta[name="page-ref"]');
      const pageRef = pageRefMeta ? pageRefMeta.getAttribute('content') : null;
      
      // If we have route mapping and current page reference
      if (pageRef && routesData[pageRef] && routesData[pageRef][targetLang]) {
        e.preventDefault(); // Prevent default link behavior
        window.location.href = routesData[pageRef][targetLang];
        return;
      }
      
      // Fallback: Try to rewrite the URL based on language pattern
      const currentPath = window.location.pathname;
      const currentLang = document.documentElement.lang || document.querySelector('html').getAttribute('lang');
      
      if (currentLang) {
        e.preventDefault(); // Prevent default link behavior
        
        // Handle special case of root path
        if (currentPath === '/' || currentPath === '/index.html') {
          window.location.href = targetLang === 'en' ? '/' : `/${targetLang}/`;
          return;
        }
        
        // Rewrite URL based on language pattern
        let newPath = currentPath;
        
        // Remove current language prefix
        if (newPath.startsWith(`/${currentLang}/`)) {
          newPath = newPath.substring(currentLang.length + 1);
        }
        
        // Add new language prefix (but skip for default language if configured that way)
        const targetPath = targetLang === 'en' ? newPath : `/${targetLang}${newPath}`;
        
        window.location.href = targetPath;
      }
    });
  })});;

/**
 * Email protection script
 * Assembles email addresses at runtime to prevent scraping
 */
document.addEventListener('DOMContentLoaded', function() {
  // Assemble and display protected email addresses
  document.querySelectorAll('.protected-email').forEach(function(element) {
    const name = element.getAttribute('data-name');
    const domain = element.getAttribute('data-domain');
    
    if (name && domain) {
      // Create the email text with a unicode character instead of @
      const assembledEmail = name + '&#64;' + domain;
      
      // If it's a link, set the href attribute
      if (element.tagName.toLowerCase() === 'a') {
        element.setAttribute('href', 'mailto:' + name + '@' + domain);
      }
      
      // Set the inner HTML
      element.innerHTML = assembledEmail;
      
      // Add click event for non-link elements
      if (element.tagName.toLowerCase() !== 'a') {
        element.style.cursor = 'pointer';
        element.title = 'Click to email';
        element.addEventListener('click', function() {
          window.location.href = 'mailto:' + name + '@' + domain;
        });
      }
    }
  });

  // Make phone numbers readable but not scrapable
  document.querySelectorAll('.protected-phone').forEach(function(element) {
    // Remove hidden spans when displaying to humans
    const displayedNumber = element.innerHTML;
    const cleanNumber = displayedNumber.replace(/<span style="display:none">.*?<\/span>/g, '');
    
    // Store the clean version for click-to-call
    const callableNumber = cleanNumber.replace(/\s+/g, '');
    
    // Make it clickable
    element.style.cursor = 'pointer';
    element.title = 'Click to call';
    element.addEventListener('click', function() {
      window.location.href = 'tel:' + callableNumber;
    });
  });
});

document.querySelectorAll('.protected-address').forEach(function(element) {
  // Remove hidden spans when displaying to humans
  const displayedAddress = element.innerHTML;
  const cleanAddress = displayedAddress.replace(/<span style="display:none">.*?<\/span>/g, '');
  
  // Update the element with the clean version
  element.innerHTML = cleanAddress;
});