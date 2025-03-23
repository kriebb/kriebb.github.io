/**
 * Theme Toggle Functionality
 * - Handles theme switching between light and dark mode
 * - Persists theme preference in localStorage
 * - Applies appropriate theme on page load
 */
(function() {
  // Elements
  const darkModeButton = document.getElementById('darkModeToggle');
  const lightModeButton = document.getElementById('lightModeToggle');
  const html = document.documentElement;
  const body = document.body;
  
  /**
   * Set theme and save preference
   * @param {string} themeName - 'light' or 'dark'
   */
  function setTheme(themeName) {
    // Add transition-disabling class during theme change to prevent flickering
    html.classList.add('no-transitions');
    body.classList.add('no-transitions');
    
    // Update localStorage first
    localStorage.setItem('theme', themeName);
    
    // Apply theme classes
    if (themeName === 'dark') {
      html.classList.add('dark-mode');
      body.classList.add('dark-mode');
    } else {
      html.classList.remove('dark-mode');
      body.classList.remove('dark-mode');
    }
    
    // Re-enable transitions after theme is applied
    setTimeout(function() {
      html.classList.remove('no-transitions');
      body.classList.remove('no-transitions');
    }, 50);
  }
  
  /**
   * Init theme toggle buttons
   */
  function initThemeToggle() {
    if (darkModeButton && lightModeButton) {
      // Set up event listeners for both buttons
      darkModeButton.addEventListener('click', function(e) {
        e.preventDefault();
        setTheme('dark');
      });
      
      lightModeButton.addEventListener('click', function(e) {
        e.preventDefault();
        setTheme('light');
      });
      
      // Unhide buttons once JS is loaded
      darkModeButton.removeAttribute('hidden');
      lightModeButton.removeAttribute('hidden');
    }
  }
  
  // Run on DOM ready
  document.addEventListener('DOMContentLoaded', initThemeToggle);
})();