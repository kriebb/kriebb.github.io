document.addEventListener('DOMContentLoaded', function() {
    // Simple search functionality
    const searchInput = document.getElementById('blog-search');
    const blogCards = document.querySelectorAll('.blog-card');
    
    if (searchInput) {
      searchInput.addEventListener('keyup', function() {
        const searchTerm = this.value.toLowerCase();
        
        blogCards.forEach(card => {
          const title = card.querySelector('.blog-card-title').textContent.toLowerCase();
          const excerpt = card.querySelector('.blog-card-excerpt').textContent.toLowerCase();
          const tags = Array.from(card.querySelectorAll('.blog-tag')).map(tag => tag.textContent.toLowerCase());
          
          const isVisible = 
            title.includes(searchTerm) || 
            excerpt.includes(searchTerm) || 
            tags.some(tag => tag.includes(searchTerm));
          
          card.style.display = isVisible ? 'flex' : 'none';
        });
      });
    }
    
    // Tag filter functionality
    const tagFilters = document.querySelectorAll('.tag-filter');
    
    tagFilters.forEach(filter => {
      filter.addEventListener('click', function() {
        // Remove active class from all filters
        tagFilters.forEach(f => f.classList.remove('active'));
        
        // Add active class to clicked filter
        this.classList.add('active');
        
        const filterTag = this.textContent.toLowerCase();
        
        if (filterTag === 'all') {
          blogCards.forEach(card => {
            card.style.display = 'flex';
          });
          return;
        }
        
        blogCards.forEach(card => {
          const tags = Array.from(card.querySelectorAll('.blog-tag')).map(tag => 
            tag.textContent.toLowerCase().replace('#', '')
          );
          
          card.style.display = tags.includes(filterTag) ? 'flex' : 'none';
        });
      });
    });
  });