document.addEventListener('DOMContentLoaded', function() {
    // Initialize mermaid with theme matching site theme
    mermaid.initialize({
      startOnLoad: true,
      theme: document.documentElement.classList.contains('dark-mode') ? 'dark' : 'default',
      securityLevel: 'loose',
      flowchart: { useMaxWidth: true }
    });
    
    // Re-render on theme change
    const darkModeToggle = document.getElementById('darkModeToggle');
    const lightModeToggle = document.getElementById('lightModeToggle');
    
    if (darkModeToggle) {
      darkModeToggle.addEventListener('click', function() {
        setTimeout(function() {
          window.mermaid.initialize({
            theme: 'dark'
          });
          window.mermaid.init(undefined, document.querySelectorAll('.mermaid'));
        }, 200);
      });
    }
    
    if (lightModeToggle) {
      lightModeToggle.addEventListener('click', function() {
        setTimeout(function() {
          window.mermaid.initialize({
            theme: 'default'
          });
          window.mermaid.init(undefined, document.querySelectorAll('.mermaid'));
        }, 200);
      });
    }
  });