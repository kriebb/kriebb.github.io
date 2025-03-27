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

const LANGUAGES = [
  { code: 'en', name: 'English', icon: '🇬🇧' },
  { code: 'nl', name: 'Nederlands', icon: '🇳🇱' }
];

document.addEventListener('DOMContentLoaded', function() {
 // Find the language actions area in the navbar
 const navActions = document.querySelector('.nav-actions');
 if (!navActions) return;

 // Create and append language switcher
 const languageSwitcher = document.querySelector('.language-switcher-container')

 // Get elements
 const trigger = languageSwitcher.querySelector('.language-trigger');
 const dropdown = languageSwitcher.querySelector('.language-dropdown');
 const currentLangEl = languageSwitcher.querySelector('.current-lang');
 const langOptions = languageSwitcher.querySelectorAll('.language-option');

 // Detect current language
 const detectCurrentLanguage = () => {
   const path = window.location.pathname;
   const savedLang = localStorage.getItem('preferredLanguage');
   
   // Determine current language
   const detectedLang = path.startsWith('/nl/') ? 'nl' : 'en';
   return savedLang || detectedLang;
 };

 // Update current language display
 const updateCurrentLanguage = (langCode) => {
   const lang = LANGUAGES.find(l => l.code === langCode);
   if (lang) {
     currentLangEl.textContent = lang.name;
     
     // Highlight active language in dropdown
     langOptions.forEach(option => {
       option.classList.toggle('active', option.dataset.lang === langCode);
     });
   }
 };

 // Initial language setup
 const currentLang = detectCurrentLanguage();
 updateCurrentLanguage(currentLang);

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
   option.addEventListener('click', () => {
     const selectedLang = option.dataset.lang;
     
     // Save language preference
     localStorage.setItem('preferredLanguage', selectedLang);

     // Get current path
     const currentPath = window.location.pathname;
     
     // Remove existing language prefix
     const cleanPath = currentPath.replace(/^\/[^\/]+/, '');
     
     // Construct new path
     const newPath = selectedLang === 'en' ? cleanPath : `/${selectedLang}${cleanPath}`;
     
     // Redirect
     window.location.href = newPath;
   });
 });
});