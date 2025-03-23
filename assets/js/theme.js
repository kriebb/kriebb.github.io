/**
 * Theme Toggle - Simplified
 */
(function() {
  // Elements
  const darkModeButton = document.getElementById('darkModeToggle');
  const lightModeButton = document.getElementById('lightModeToggle');
  
  // Set theme and save preference
  function setTheme(themeName) {
    if (themeName === 'dark') {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
    
    localStorage.setItem('theme', themeName);
  }
  
  // Set up event listeners
  function initThemeToggle() {
    if (!darkModeButton || !lightModeButton) return;
    
    darkModeButton.addEventListener('click', () => setTheme('dark'));
    lightModeButton.addEventListener('click', () => setTheme('light'));
    
    // Show the appropriate button based on current theme
    const isDark = document.documentElement.classList.contains('dark-mode');
    
    darkModeButton.style.display = isDark ? 'none' : 'block';
    lightModeButton.style.display = isDark ? 'block' : 'none';
    
    // Unhide buttons now that JS has initialized them
    darkModeButton.removeAttribute('hidden');
    lightModeButton.removeAttribute('hidden');
  }
  
  // Run when the DOM is ready
  document.addEventListener('DOMContentLoaded', initThemeToggle);
})();