/**
 * Navigation Menu Functionality
 * - Handles mobile menu toggle
 * - Provides accessibility support
 */
(function() {
    document.addEventListener("DOMContentLoaded", function() {
      const navToggle = document.querySelector('.nav-toggle');
      const navbar = document.querySelector('.navbar');
      
      if (navToggle && navbar) {
        // Toggle menu on click
        navToggle.addEventListener('click', function() {
          navbar.classList.toggle('nav-open');
          
          // Update aria-expanded for accessibility
          const isExpanded = navbar.classList.contains('nav-open');
          navToggle.setAttribute('aria-expanded', isExpanded.toString());
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
          if (navbar.classList.contains('nav-open') && 
              !navbar.contains(event.target) && 
              event.target !== navToggle) {
            navbar.classList.remove('nav-open');
            navToggle.setAttribute('aria-expanded', 'false');
          }
        });
        
        // Initialize aria attributes
        navToggle.setAttribute('aria-controls', 'nav-links');
        navToggle.setAttribute('aria-expanded', 'false');
      }
      
      // Close menu on window resize (especially when switching to desktop)
      window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navbar.classList.contains('nav-open')) {
          navbar.classList.remove('nav-open');
          if (navToggle) {
            navToggle.setAttribute('aria-expanded', 'false');
          }
        }
      });
    });
  })();