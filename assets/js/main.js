document.addEventListener("DOMContentLoaded", function() {
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
    const navToggle = document.querySelector('.nav-toggle');
    const navbar = document.querySelector('.navbar');
  
    if (navToggle && navbar) {
      navToggle.addEventListener('click', () => {
        navbar.classList.toggle('nav-open');
      });
    }
  });
  document.addEventListener('DOMContentLoaded', function() {
    const darkModeButton = document.getElementById('darkModeToggle');
    const body = document.body;

    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      body.classList.add('dark-mode');
      darkModeButton.textContent = 'Light Mode';
    }

    darkModeButton.addEventListener('click', function() {
      body.classList.toggle('dark-mode');

      if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        darkModeButton.textContent = 'Light Mode';
      } else {
        localStorage.setItem('theme', 'light');
        darkModeButton.textContent = 'Dark Mode';
      }
    });
  });