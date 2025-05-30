if (typeof AOS !== 'undefined') {
  AOS.init({
    once: true,
    offset: 120,
    delay: 0,
    duration: 800
  });
}


/**
 * Email protection script
 * Assembles email addresses at runtime to prevent scraping
 */
document.addEventListener('DOMContentLoaded', function() {
  // Assemble and display protected email addresses
  document.querySelectorAll('.protected-email').forEach(function(element) {
    const name = element.getAttribute('data-name');
    const domain = element.getAttribute('data-domain');
    
    if (name && domain) {
      // Create the email text with a unicode character instead of @
      const assembledEmail = name + '&#64;' + domain;
      
      // If it's a link, set the href attribute
      if (element.tagName.toLowerCase() === 'a') {
        element.setAttribute('href', 'mailto:' + name + '@' + domain);
      }
      
      // Set the inner HTML
      element.innerHTML = assembledEmail;
      
      // Add click event for non-link elements
      if (element.tagName.toLowerCase() !== 'a') {
        element.style.cursor = 'pointer';
        element.title = 'Click to email';
        element.addEventListener('click', function() {
          window.location.href = 'mailto:' + name + '@' + domain;
        });
      }
    }
  });

  // Make phone numbers readable but not scrapable
  document.querySelectorAll('.protected-phone').forEach(function(element) {
    // Remove hidden spans when displaying to humans
    const displayedNumber = element.innerHTML;
    const cleanNumber = displayedNumber.replace(/<span style="display:none">.*?<\/span>/g, '');
    
    // Store the clean version for click-to-call
    const callableNumber = cleanNumber.replace(/\s+/g, '');
    
    // Make it clickable
    element.style.cursor = 'pointer';
    element.title = 'Click to call';
    element.addEventListener('click', function() {
      window.location.href = 'tel:' + callableNumber;
    });
  });
});

document.querySelectorAll('.protected-address').forEach(function(element) {
  // Remove hidden spans when displaying to humans
  const displayedAddress = element.innerHTML;
  const cleanAddress = displayedAddress.replace(/<span style="display:none">.*?<\/span>/g, '');
  
  // Update the element with the clean version
  element.innerHTML = cleanAddress;
});
// Add this to your main.js file or create a new toc.js file
document.addEventListener('DOMContentLoaded', function() {
  // Generate table of contents if the element exists
  const tocContainer = document.getElementById('toc');
  if (!tocContainer) return;
  
  // Find the main content area - adjust the selector as needed
  const mainContent = document.querySelector('.main-content');
  if (!mainContent) return;
  
  // Find only h2 headings in the main content (skip h3 and smaller)
  const headings = mainContent.querySelectorAll('h2');
  if (headings.length === 0) return;
  
  // Clear existing content
  tocContainer.innerHTML = '';
  
  // Add each heading to the TOC
  headings.forEach(function(heading, index) {
    // Create a unique ID if the heading doesn't have one
    if (!heading.id) {
      heading.id = 'heading-' + index;
    }
    
    // Create TOC item
    const listItem = document.createElement('li');
    
    const link = document.createElement('a');
    link.href = '#' + heading.id;
    link.textContent = heading.textContent;
    
    listItem.appendChild(link);
    tocContainer.appendChild(listItem);
    
    // Add click event to smooth scroll
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetHeading = document.getElementById(heading.id);
      if (targetHeading) {
        // Smooth scroll to the heading
        window.scrollTo({
          top: targetHeading.offsetTop - 80, // Adjust for header height
          behavior: 'smooth'
        });
        
        // Update URL hash
        history.pushState(null, null, '#' + heading.id);
      }
    });
  });
});