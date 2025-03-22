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
    const root = document.documentElement;
    
    // Helper: Set theme and save preference
    function setTheme(themeName) {
      // Remove any existing theme classes
      document.body.classList.remove('dark-mode');
      
      // Apply new theme if not default
      if (themeName === 'dark') {
        document.body.classList.add('dark-mode');
      }
      
      // Save preference
      localStorage.setItem('theme', themeName);
    }
    
    // Apply saved theme on load
    function applyInitialTheme() {
      const savedTheme = localStorage.getItem('theme');
      
      // Check for saved preference
      if (savedTheme) {
        setTheme(savedTheme);
      } else {
        // Check for system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
      }
    }
    
    // Set up event listeners
    function initThemeToggle() {
      if (darkModeButton && lightModeButton) {
        darkModeButton.addEventListener('click', () => setTheme('dark'));
        lightModeButton.addEventListener('click', () => setTheme('light'));
        
        // Unhide buttons once JS is loaded
        darkModeButton.removeAttribute('hidden');
        lightModeButton.removeAttribute('hidden');
      }
    }
    
    // Run on DOM ready
    document.addEventListener('DOMContentLoaded', () => {
      applyInitialTheme();
      initThemeToggle();
    });
  })();