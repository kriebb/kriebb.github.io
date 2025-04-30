// Simple Jekyll search implementation
(function() {
    // Initialize search functionality once DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
      var searchInput = document.getElementById('search-input');
      if (!searchInput) return;
      
      // Load search index
      fetch('/search.json')
        .then(response => response.json())
        .then(data => {
          var searchIdx = lunr(function() {
            this.ref('id');
            this.field('title', { boost: 10 });
            this.field('content');
            this.field('tags', { boost: 5 });
            
            data.forEach((doc, idx) => {
              doc.id = idx;
              this.add(doc);
            });
          });
          
          // Store data in window for accessing later
          window.searchData = data;
          window.searchIdx = searchIdx;
          
          // Initialize search if on search page
          initSearch();
        })
        .catch(error => console.error('Error loading search index:', error));
    });
    
    // Handle search functionality on the search page
    function initSearch() {
      if (window.location.pathname !== '/search/' && 
          window.location.pathname !== '/search/index.html') return;
      
      var searchInput = document.getElementById('search-input');
      var resultsContainer = document.getElementById('search-results');
      if (!searchInput || !resultsContainer || !window.searchIdx) return;
      
      // Get search query from URL
      var searchQuery = getParameterByName('q');
      if (searchQuery) {
        searchInput.value = searchQuery;
        performSearch(searchQuery, resultsContainer);
      }
      
      // Set up form submission
      var searchForm = document.querySelector('.search-form');
      if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
          var query = searchInput.value.trim();
          if (!query) {
            e.preventDefault();
            resultsContainer.innerHTML = '<p>Please enter a search term.</p>';
          }
        });
      }
    }
    
    // Perform search and display results
    function performSearch(query, resultsContainer) {
      // Clear previous results
      resultsContainer.innerHTML = '';
      
      if (!query || !window.searchIdx || !window.searchData) {
        resultsContainer.innerHTML = '<p>No search results.</p>';
        return;
      }
      
      // Perform the search
      var results = window.searchIdx.search(query);
      
      // Display results
      if (results.length > 0) {
        var resultsHtml = '<p>Found ' + results.length + ' result' + 
                           (results.length > 1 ? 's' : '') + ' for <strong>"' + 
                           query + '"</strong></p>';
        
        resultsHtml += '<div class="search-results">';
        
        results.forEach(function(result) {
          var item = window.searchData[result.ref];
          resultsHtml += '<div class="search-result-item">';
          resultsHtml += '<h3 class="search-result-title"><a href="' + item.url + '">' + item.title + '</a></h3>';
          resultsHtml += '<div class="search-result-snippet">' + getSnippet(item.content, query) + '</div>';
          
          if (item.tags && item.tags.length > 0) {
            resultsHtml += '<div class="search-result-meta">Tags: ';
            item.tags.forEach(function(tag, idx) {
              resultsHtml += '<a href="/tag/' + tag.toLowerCase().replace(/\s+/g, '-') + 
                            '/">#' + tag + '</a>';
              if (idx < item.tags.length - 1) resultsHtml += ', ';
            });
            resultsHtml += '</div>';
          }
          
          resultsHtml += '</div>';
        });
        
        resultsHtml += '</div>';
        resultsContainer.innerHTML = resultsHtml;
      } else {
        resultsContainer.innerHTML = '<p>No results found for <strong>"' + query + '"</strong>.</p>';
      }
    }
    
    // Helper function to get a snippet of text around the search term
    function getSnippet(text, query) {
      if (!text) return '';
      
      text = text.replace(/<[^>]*>/g, ''); // Remove HTML tags
      var words = query.split(' ');
      var regex = new RegExp('(.{0,50})(' + words.join('|') + ')(.{0,50})', 'gi');
      var match = regex.exec(text);
      
      if (match) {
        return '...' + 
               (match[1] ? match[1] : '') + 
               '<strong>' + match[2] + '</strong>' + 
               (match[3] ? match[3] : '') + 
               '...';
      } else {
        return text.substr(0, 100) + '...';
      }
    }
    
    // Helper function to get URL parameters
    function getParameterByName(name) {
      var url = window.location.href;
      name = name.replace(/[\[\]]/g, '\\$&');
      var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
      var results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
  })();