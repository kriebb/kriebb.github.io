// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const blogSearch = document.getElementById('blog-search');
    const tagFilters = document.querySelectorAll('.tag-filter');
    const blogCards = document.querySelectorAll('.blog-card');
    
    if (!blogSearch) return; // Exit if we're not on the blog page
    
    // Search functionality
    blogSearch.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase().trim();
      filterPosts(searchTerm, getActiveTag());
    });
    
    // Tag filtering
    tagFilters.forEach(filter => {
      filter.addEventListener('click', function() {
        // Remove active class from all filters
        tagFilters.forEach(f => f.classList.remove('active'));
        
        // Add active class to clicked filter
        this.classList.add('active');
        
        // Filter posts
        filterPosts(blogSearch.value.toLowerCase().trim(), getActiveTag());
      });
    });
    
    // Helper function to get the active tag
    function getActiveTag() {
      const activeFilter = document.querySelector('.tag-filter.active');
      return activeFilter ? activeFilter.getAttribute('data-tag') : 'all';
    }
    
    // Function to filter posts by search term and tag
    function filterPosts(searchTerm, activeTag) {
      let visibleCount = 0;
      
      blogCards.forEach(card => {
        // Get card content for searching
        const title = card.querySelector('.blog-card-title').textContent.toLowerCase();
        const excerpt = card.querySelector('.blog-card-excerpt').textContent.toLowerCase();
        const tags = Array.from(card.querySelectorAll('.blog-tag'))
                         .map(tag => tag.textContent.toLowerCase().replace('#', ''));
        
        // Check if card matches search term
        const matchesSearch = searchTerm === '' || 
                             title.includes(searchTerm) || 
                             excerpt.includes(searchTerm);
        
        // Check if card matches selected tag
        const matchesTag = activeTag === 'all' || 
                          tags.includes(activeTag) || 
                          tags.some(tag => tag.replace(/-/g, ' ') === activeTag);
        
        // Show/hide card based on both conditions
        if (matchesSearch && matchesTag) {
          card.style.display = '';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });
      
      // Show "no posts" message if no visible posts
      const noPostsElement = document.querySelector('.no-posts');
      if (noPostsElement) {
        if (visibleCount === 0) {
          // If no existing message, create one
          if (!noPostsElement.style.display || noPostsElement.style.display === 'none') {
            const blogGrid = document.querySelector('.blog-grid');
            const noPostsDiv = document.createElement('div');
            noPostsDiv.className = 'no-posts';
            noPostsDiv.innerHTML = '<p>No posts match your search criteria.</p>';
            blogGrid.appendChild(noPostsDiv);
          } else {
            noPostsElement.style.display = '';
          }
        } else {
          noPostsElement.style.display = 'none';
        }
      }
    }
    
    // Optional: Animate cards when they appear
    blogCards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 100);
    });
  });