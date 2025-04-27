// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
  // Elements
  const blogSearch = document.getElementById('blog-search');
  const tagFilters = document.querySelectorAll('.tag-filter');
  const blogCards = document.querySelectorAll('.blog-card');

  if (!blogSearch) return; // Exit if we're not on the blog page

  // Search functionality
  blogSearch.addEventListener('input', function () {
    const searchTerm = this.value.toLowerCase().trim();
    filterPosts(searchTerm, getActiveTag());
  });

  // Tag filtering
  tagFilters.forEach(filter => {
    filter.addEventListener('click', function () {
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


/**
* Tag System Functionality
* - Handles tag filtering
* - Supports tag routes (/tag/xxx)
* - Allows toggling tags on/off
*/
document.addEventListener('DOMContentLoaded', function () {
  // Elements
  const tagItems = document.querySelectorAll('.tag-item');
  const blogCards = document.querySelectorAll('.blog-card');
  const searchInput = document.getElementById('blog-search');
  const blogContainer = document.querySelector('.blog-container');

  // Check if we're on the blog page
  if (!blogContainer) return;

  // Create "no results" element if it doesn't exist
  let noResultsElem = document.querySelector('.no-matching-posts');
  if (!noResultsElem) {
    noResultsElem = document.createElement('div');
    noResultsElem.className = 'no-matching-posts';
    noResultsElem.innerHTML = `
      <h3>No matching posts found</h3>
      <p>Try selecting a different tag or clearing your search.</p>
      <a href="#" class="reset-filters">Show all posts</a>
    `;
    noResultsElem.style.display = 'none';

    // Insert after the blog grid
    const blogGrid = document.querySelector('.blog-grid');
    if (blogGrid) {
      blogGrid.after(noResultsElem);
    } else {
      blogContainer.appendChild(noResultsElem);
    }

    // Add event listener to reset button
    noResultsElem.querySelector('.reset-filters').addEventListener('click', function (e) {
      e.preventDefault();
      resetFilters();
    });
  }

  // Function to filter posts by tag
  function filterByTag(tag) {
    let visibleCount = 0;

    blogCards.forEach(card => {
      // Get card tags
      const cardTags = Array.from(card.querySelectorAll('.blog-tag'))
        .map(tag => tag.getAttribute('href').replace('/tag/', '').replace('/', ''));

      // Check if card has the selected tag or if we're showing all
      const matchesTag = tag === 'all' || cardTags.includes(tag);

      // Check if card matches search term (if search is active)
      const matchesSearch = !searchInput || !searchInput.value ||
        card.textContent.toLowerCase().includes(searchInput.value.toLowerCase());

      // Show/hide card based on both conditions
      if (matchesTag && matchesSearch) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Show/hide no results message
    noResultsElem.style.display = visibleCount > 0 ? 'none' : 'block';

    // Update active tag
    tagItems.forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-tag') === tag);
    });

    // Update URL if not 'all' (without reloading the page)
    if (tag !== 'all') {
      window.history.pushState({ tag: tag }, '', '/tag/' + tag + '/');
    } else {
      window.history.pushState({ tag: 'all' }, '', '/blog/');
    }
  }

  // Add click event listeners to tags
  tagItems.forEach(tag => {
    tag.addEventListener('click', function (e) {
      e.preventDefault();

      const tagValue = this.getAttribute('data-tag');
      const isCurrentlyActive = this.classList.contains('active');

      // If clicking an already active tag, reset to show all
      if (isCurrentlyActive) {
        resetFilters();
      } else {
        filterByTag(tagValue);
      }
    });
  });

  // Function to reset filters and show all posts
  function resetFilters() {
    // Clear search
    if (searchInput) searchInput.value = '';

    // Reset tags
    tagItems.forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-tag') === 'all');
    });

    // Show all posts
    blogCards.forEach(card => {
      card.style.display = '';
    });

    // Hide no results message
    noResultsElem.style.display = 'none';

    // Update URL
    window.history.pushState({ tag: 'all' }, '', '/blog/');
  }

  // Check URL for tag parameter on page load
  function checkUrlForTag() {
    const path = window.location.pathname;
    const tagMatch = path.match(/\/tag\/([^\/]+)\/?$/);

    if (tagMatch && tagMatch[1]) {
      const urlTag = tagMatch[1];

      // Find matching tag element
      const matchingTag = Array.from(tagItems).find(tag =>
        tag.getAttribute('data-tag') === urlTag
      );

      // If we found a matching tag, filter by it
      if (matchingTag) {
        filterByTag(urlTag);
      } else {
        // If no matching tag, reset to show all
        resetFilters();
      }
    }
  }

  // Handle browser back/forward buttons
  window.addEventListener('popstate', function (event) {
    checkUrlForTag();
  });

  // Initialize - check URL for tag
  checkUrlForTag();

  // If search functionality exists, integrate it with tags
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      const activeTag = document.querySelector('.tag-item.active');
      const tagValue = activeTag ? activeTag.getAttribute('data-tag') : 'all';

      filterByTag(tagValue);
    });
  }
});
// Fixed JavaScript for blog header functionality - add to your blog.js file
document.addEventListener('DOMContentLoaded', function() {
  // Tag section toggle functionality
  const tagToggle = document.getElementById('tagToggle');
  const tagCloud = document.getElementById('tagCloud');
  const toggleBtn = document.querySelector('.tag-toggle-btn');
  
  if (tagToggle && tagCloud && toggleBtn) {
    tagToggle.addEventListener('click', function() {
      tagCloud.classList.toggle('collapsed');
      toggleBtn.classList.toggle('collapsed');
    });
  }
  
  // Show more tags functionality
  const showMoreBtn = document.getElementById('showMoreTags');
  const moreTags = document.getElementById('moreTags');
  
  if (showMoreBtn && moreTags) {
    // Get count from data attribute that we'll set in the HTML
    const hiddenTagCount = showMoreBtn.dataset.count || 0;
    
    showMoreBtn.addEventListener('click', function() {
      moreTags.classList.toggle('hidden');
      
      if (moreTags.classList.contains('hidden')) {
        showMoreBtn.textContent = '+' + hiddenTagCount + ' more';
      } else {
        showMoreBtn.textContent = 'Show less';
      }
    });
  }
  
  // Tag filtering
  const tagItems = document.querySelectorAll('.tag-item');
  const blogCards = document.querySelectorAll('.blog-card');
  
  tagItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Remove active class from all tag items
      tagItems.forEach(tag => tag.classList.remove('active'));
      
      // Add active class to clicked tag
      this.classList.add('active');
      
      const selectedTag = this.getAttribute('data-tag');
      
      // Show/hide blog cards based on selected tag
      if (selectedTag === 'all') {
        blogCards.forEach(card => card.style.display = '');
      } else {
        blogCards.forEach(card => {
          const cardTags = card.querySelectorAll('.blog-tag');
          let hasTag = false;
          
          cardTags.forEach(tag => {
            const tagText = tag.innerText.replace('#', '');
            if (tagText.toLowerCase() === selectedTag) {
              hasTag = true;
            }
          });
          
          card.style.display = hasTag ? '' : 'none';
        });
      }
    });
  });
});