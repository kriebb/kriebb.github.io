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
  const languageSwitcher = document.querySelector('.language-switcher-container');
  if (!languageSwitcher) return;
  
  const trigger = languageSwitcher.querySelector('.language-trigger');
  const dropdown = languageSwitcher.querySelector('.language-dropdown');
  
  // Toggle dropdown visibility
  trigger.addEventListener('click', function(e) {
    e.preventDefault();
    dropdown.classList.toggle('open');
  });
  
  // Close dropdown when clicking elsewhere
  document.addEventListener('click', function(e) {
    if (!languageSwitcher.contains(e.target)) {
      dropdown.classList.remove('open');
    }
  });
  
  // Prevent dropdown from closing when clicking inside it
  dropdown.addEventListener('click', function(e) {
    // Only needed if you have interactive elements in the dropdown
    // that shouldn't trigger navigation immediately
    e.stopPropagation();
  });
});