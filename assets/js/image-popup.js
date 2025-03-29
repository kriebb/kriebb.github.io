document.addEventListener('DOMContentLoaded', function() {
    // Find all links that point to image files
    const imageLinks = document.querySelectorAll('a[href$=".jpg"], a[href$=".jpeg"], a[href$=".png"], a[href$=".gif"]');
    
    if (imageLinks.length === 0) {
      console.log('No image links found on this page');
      return; // Exit if no links found
    }
    
    console.log('Found ' + imageLinks.length + ' image links');
    
    // Create modal element
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <img class="modal-image" src="" alt="Fullsize image">
      </div>
    `;
    document.body.appendChild(modal);
  
    // Get modal elements
    const modalImg = modal.querySelector('.modal-image');
    const closeBtn = modal.querySelector('.close-modal');
  
    // Process each image link
    imageLinks.forEach(link => {
      // Store the original href as data-image attribute
      const imageUrl = link.getAttribute('href');
      link.setAttribute('data-image', imageUrl);
      
      // Add popup class for styling
      link.classList.add('image-popup');
      
      // Replace the default navigation behavior
      link.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Opening image: ' + imageUrl);
        modal.style.display = 'block';
        modalImg.src = imageUrl;
      });
      
      console.log('Transformed link: ' + link.textContent);
    });
  
    // Close modal when clicking X
    closeBtn.addEventListener('click', function() {
      modal.style.display = 'none';
      modalImg.src = ''; // Clear the image
    });
  
    // Close modal when clicking outside the image
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.style.display = 'none';
        modalImg.src = ''; // Clear the image
      }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.style.display === 'block') {
        modal.style.display = 'none';
        modalImg.src = ''; // Clear the image
      }
    });
    
    console.log('Image popup functionality initialized');
  });