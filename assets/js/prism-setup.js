// Prism.js setup and initialization
document.addEventListener('DOMContentLoaded', () => {
  // Set default language if not specified
  document.querySelectorAll('pre code:not([class*="language-"])').forEach(el => {
    el.classList.add('language-plaintext');
  });

  // Initialize Prism.js if it's loaded
  if (window.Prism) {
    Prism.highlightAll();
    
    // Add line numbers to code blocks for better readability
    document.querySelectorAll('pre code').forEach(block => {
      if (!block.closest('pre').classList.contains('line-numbers')) {
        block.closest('pre').classList.add('line-numbers');
      }
    });
  }

  // Special handling for CSHTML/Razor code blocks
  document.querySelectorAll('pre code.language-cshtml, pre code.language-razor').forEach(block => {
    // Custom post-processing for CSHTML/Razor blocks if needed
  });
});