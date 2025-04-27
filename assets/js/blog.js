// blog.js - Streamlined blog functionality

document.addEventListener('DOMContentLoaded', function() {
  // Initialize category toggles
  initCategoryToggles();
  
  // Initialize blog TOC if needed
  initBlogTOC();
  
  // Initialize tag filtering if on blog page
  initTagFiltering();
});

/**
 * Initialize collapsible category toggles in the sidebar
 */
function initCategoryToggles() {
  const toggles = document.querySelectorAll('.category-toggle');
  
  toggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      const categoryId = this.getAttribute('data-category');
      const content = document.getElementById('category-' + categoryId);
      
      // Toggle the collapsed class
      content.classList.toggle('collapsed');
      
      // Update the toggle icon
      const icon = this.querySelector('.toggle-icon');
      icon.textContent = content.classList.contains('collapsed') ? '+' : '-';
    });
  });
}

/**
 * Initialize blog table of contents
 */
function initBlogTOC() {
  const tocContainer = document.getElementById('blog-toc');
  
  if (!tocContainer) return;
  
  // Find all headings in the blog post
  const headings = document.querySelectorAll('.blog-content h2, .blog-content h3');
  
  if (headings.length === 0) {
    tocContainer.closest('.sidebar-section').style.display = 'none';
    return;
  }
  
  // Create TOC items
  headings.forEach((heading, index) => {
    // Add ID to the heading if it doesn't have one
    if (!heading.id) {
      heading.id = 'heading-' + index;
    }
    
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    
    link.href = '#' + heading.id;
    link.textContent = heading.textContent;
    
    // Add indent for h3 elements
    if (heading.tagName.toLowerCase() === 'h3') {
      listItem.style.paddingLeft = '1.5rem';
    }
    
    listItem.appendChild(link);
    tocContainer.appendChild(listItem);
  });
}

/**
 * Initialize tag filtering on blog pages
 */
function initTagFiltering() {
  const tagItems = document.querySelectorAll('.tag-item');
  const blogCards = document.querySelectorAll('.blog-card');
  
  if (tagItems.length === 0 || blogCards.length === 0) return;
  
  tagItems.forEach(tag => {
    tag.addEventListener('click', function(e) {
      e.preventDefault();
      
      const selectedTag = this.getAttribute('data-tag');
      
      // Remove active class from all tags
      tagItems.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked tag
      this.classList.add('active');
      
      // Filter blog cards
      if (selectedTag === 'all') {
        // Show all posts
        blogCards.forEach(card => card.style.display = 'flex');
      } else {
        // Filter by tag
        blogCards.forEach(card => {
          const tags = card.getAttribute('data-tags');
          
          if (tags && tags.includes(selectedTag)) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      }
    });
  });
}