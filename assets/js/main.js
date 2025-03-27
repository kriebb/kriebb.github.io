document.addEventListener('DOMContentLoaded', function() {
  // Initialize AOS only after the page has loaded
  if (typeof AOS !== 'undefined') {
    AOS.init({
      once: true,
      offset: 120,
      delay: 0,
      duration: 800
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // Initialize Swiper for the Projects page
  return swiper = new Swiper(".swiper", {
    // Optional parameters
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    slidesPerView: 1,
    spaceBetween: 20,
    // Responsiveness
    breakpoints: {
      768: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 3,
      },
    },
  });
});

document.addEventListener("DOMContentLoaded", function() {
  const contentArea = document.querySelector('.page-content');
  const toc = document.getElementById('toc');
  if (!contentArea || !toc) return;

  // Grab all h2/h3 in .page-content
  const allHeaders = contentArea.querySelectorAll('h2, h3');

  // Filter out headings inside .swiper-slide OR .competence-card
  const filteredHeaders = Array.from(allHeaders).filter(header => 
    !header.closest('.swiper-slide, .competence-card')
  );

  // Build the TOC only from the filtered set
  filteredHeaders.forEach(header => {
    // If the heading doesn’t have an id, create one
    if (!header.id) {
      header.id = header.textContent
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '');
    }

    const link = document.createElement('a');
    link.href = `#${header.id}`;
    link.textContent = header.textContent;

    const listItem = document.createElement('li');
    listItem.appendChild(link);
    toc.appendChild(listItem);
  });
});


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