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


document.addEventListener('DOMContentLoaded', function() {
  // Find the language switcher container
  const languageSwitcher = document.querySelector('.language-switcher-container');
  if (!languageSwitcher) return;

  // Get elements
  const trigger = languageSwitcher.querySelector('.language-trigger');
  const dropdown = languageSwitcher.querySelector('.language-dropdown');
  const langOptions = languageSwitcher.querySelectorAll('.language-option');

  // Toggle dropdown
  trigger.addEventListener('click', () => {
    dropdown.classList.toggle('open');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (event) => {
    if (!languageSwitcher.contains(event.target)) {
      dropdown.classList.remove('open');
    }
  });

  // Language selection
  langOptions.forEach(option => {
    option.addEventListener('click', (e) => {
      e.preventDefault();
      const selectedLang = option.dataset.lang;
      
      // Save language preference
      localStorage.setItem('preferredLanguage', selectedLang);

      // Get current path
      const currentPath = window.location.pathname;
      
      // Use route mapping for better language switching
      const pagePath = getLanguagePath(currentPath, selectedLang);
      
      // Redirect
      window.location.href = pagePath;
    });
  });
});

// Function to get the correct path for the other language
function getLanguagePath(currentPath, targetLang) {
  // Remove leading slash and split path segments
  const path = currentPath.replace(/^\//, '').split('/');
  
  // Handle special cases
  if (path[0] === 'nl') {
    // Currently on Dutch page, switching to English
    if (targetLang === 'en') {
      // Map Dutch pages to English
      const dutchToEnglish = {
        'over-mij': 'about',
        'cv': 'resume',
        'diensten': 'services',
        'werkervaring': 'work-experience',
        'missie-visie': 'mission-vision',
        'privacybeleid': 'privacy-policy',
        'cookiebeleid': 'cookies',
        'bedankt': 'thank-you'
      };
      
      // Get the second segment (the actual page)
      const dutchPage = path[1] || '';
      // Get the English equivalent or keep as is if not in mapping
      const englishPage = dutchToEnglish[dutchPage] || dutchPage;
      return englishPage ? `/${englishPage}/` : '/';
    }
    // Already on Dutch page, no change needed
    return currentPath;
  } else {
    // Currently on English page (or root), switching to Dutch
    if (targetLang === 'nl') {
      // Map English pages to Dutch
      const englishToDutch = {
        'about': 'over-mij',
        'resume': 'cv',
        'services': 'diensten',
        'work-experience': 'werkervaring',
        'mission-vision': 'missie-visie',
        'privacy-policy': 'privacybeleid',
        'cookies': 'cookiebeleid',
        'thank-you': 'bedankt'
      };
      
      // Get the first segment (the actual page)
      const englishPage = path[0] || '';
      // Get the Dutch equivalent or keep as is if not in mapping
      const dutchPage = englishToDutch[englishPage] || englishPage;
      return dutchPage ? `/nl/${dutchPage}/` : '/nl/';
    }
    // Already on English page, no change needed
    return currentPath;
  }
}