/**
 * Injects site route data from _data/routes.yml into the page
 * To be included in _layouts/default.html before other scripts
 */
(function() {
    /**
     * Gets the translated route for the current page
     * @param {string} currentPath - Current page path
     * @param {string} targetLang - Target language code
     * @return {string} The translated path
     */
    window.getTranslatedRoute = function(currentPath, targetLang) {
      // Strip trailing slash
      const cleanPath = currentPath.replace(/\/$/, '');
      
      // Default to home page if we can't determine current page
      if (!cleanPath || cleanPath === '') {
        return targetLang === 'en' ? '/' : '/nl/';
      }
      
      // Try to find current route in site routes
      let currentLang = 'en';
      let currentRoute = null;
      
      // Check if we're on a Dutch page
      if (cleanPath.startsWith('/nl/')) {
        currentLang = 'nl';
      }
      
      // If already on target language, no need to change
      if (currentLang === targetLang) {
        return currentPath;
      }
      
      // Find which route we're currently on
      for (const [routeKey, routeObj] of Object.entries(window.siteRoutes)) {
        if (cleanPath === routeObj[currentLang].replace(/\/$/, '')) {
          currentRoute = routeKey;
          break;
        }
      }
      
      // If we found a match, return the translated route
      if (currentRoute && window.siteRoutes[currentRoute][targetLang]) {
        return window.siteRoutes[currentRoute][targetLang];
      }
      
      // Fallback to home page if no match found
      return targetLang === 'en' ? '/' : '/nl/';
    };
  })();