// tag-handler.js - Add to your assets/js folder
document.addEventListener('DOMContentLoaded', function() {
    // Handle clicks on any tag links across the site
    document.body.addEventListener('click', function(event) {
      // Find if the clicked element is a tag link or a child of a tag link
      var target = event.target;
      while (target != null && !isTagLink(target)) {
        target = target.parentElement;
      }
      
      // If we found a tag link, handle it
      if (target && isTagLink(target)) {
        var href = target.getAttribute('href');
        var tagMatch = href.match(/\/tag\/([^\/]+)\/?/);
        
        if (tagMatch && tagMatch[1]) {
          // Get the tag from the URL
          var tag = tagMatch[1];
          
          // If we're not already on the tag page, navigate to it
          if (!window.location.pathname.includes('/tag/')) {
            window.location.href = '/tag/' + tag + '/';
            event.preventDefault();
          }
        }
      }
    });
    
    // Helper function to determine if an element is a tag link
    function isTagLink(element) {
      return element.tagName === 'A' && 
             element.classList.contains('tag-item') && 
             element.getAttribute('href') && 
             element.getAttribute('href').includes('/tag/');
    }
  });