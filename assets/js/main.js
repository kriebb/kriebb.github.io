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

document.addEventListener("DOMContentLoaded", function () {
  const navToggle = document.querySelector('.nav-toggle');
  const navbar = document.querySelector('.navbar');

  if (navToggle && navbar) {
    navToggle.addEventListener('click', () => {
      navbar.classList.toggle('nav-open');
    });
  }
});
// Theme toggle function for assets/js/main.js

document.addEventListener('DOMContentLoaded', function() {
  // Get references to buttons
  const darkModeButton = document.getElementById('darkModeToggle');
  const lightModeButton = document.getElementById('lightModeToggle');
  
  // Check if buttons exist before adding event listeners
  if (!darkModeButton || !lightModeButton) return;

  // Get the body element
  const body = document.body;
  
  // Check saved theme preference
  const storedTheme = localStorage.getItem('theme');
  
  // Set initial state based on saved preference
  if (storedTheme === 'dark') {
    body.classList.add('dark-mode');
    darkModeButton.hidden = true; // Hide dark mode button
    lightModeButton.hidden = false; // Show light mode button
  } else {
    body.classList.remove('dark-mode');
    darkModeButton.hidden = false; // Show dark mode button
    lightModeButton.hidden = true; // Hide light mode button
  }

  // Add click event for dark mode button
  darkModeButton.addEventListener('click', function() {
    body.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
    darkModeButton.hidden = true; // Hide dark mode button
    lightModeButton.hidden = false; // Show light mode button
  });

  // Add click event for light mode button
  lightModeButton.addEventListener('click', function() {
    body.classList.remove('dark-mode');
    localStorage.setItem('theme', 'light');
    darkModeButton.hidden = false; // Show dark mode button
    lightModeButton.hidden = true; // Hide light mode button
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
