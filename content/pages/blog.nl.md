---
layout: default
title: Blog
permalink: /blog/
sidebar: false
lang: nl
ref: blog
pageid: blog
---

<div class="blog-header">
  <h1 class="blog-title">Blog</h1>
  <p class="blog-subtitle">Thoughts on .NET development, security, and professional growth</p>
</div>

<div class="blog-filter-bar">
  <div class="search-box">
    <input type="text" id="searchInput" placeholder="Search posts..." aria-label="Search posts">
    <i class="fas fa-search"></i>
  </div>
  <div class="filter-controls">
    <button class="filter-btn active" data-category="all">All</button>
    <button class="filter-btn" data-category="dotnet">.NET</button>
    <button class="filter-btn" data-category="security">Security</button>
    <button class="filter-btn" data-category="career">Career</button>
  </div>
</div>

<div class="blog-posts-container">
  {% for post in site.posts %}
    {% assign cover_path = post.cover | default: "/assets/images/blog/default-cover.jpg" %}
    {% assign post_date = post.date | date: "%B %d, %Y" %}
    {% assign post_url = post.url | relative_url %}
    {% assign post_title = post.title %}
    {% assign post_excerpt = post.excerpt | strip_html | truncatewords: 30 %}
    
    <article class="blog-card" data-aos="fade-up" data-category="{{ post.categories | join: ' ' }}">
      <div class="blog-card-image">
        <a href="{{ post_url }}">
          <img src="{{ cover_path }}" alt="Cover image for {{ post_title }}" loading="lazy">
        </a>
      </div>
      <div class="blog-card-content">
        <div class="blog-card-meta">
          <span class="blog-date"><i class="far fa-calendar-alt"></i> {{ post_date }}</span>
          {% if post.tags.size > 0 %}
            <span class="blog-tags">
              {% for tag in post.tags limit:3 %}
                <a href="/tag/{{ tag | slugify }}/" class="blog-tag">#{{ tag }}</a>
              {% endfor %}
            </span>
          {% endif %}
        </div>
        <h2 class="blog-card-title">
          <a href="{{ post_url }}">{{ post_title }}</a>
        </h2>
        <div class="blog-card-excerpt">
          {{ post_excerpt }}
        </div>
        <a href="{{ post_url }}" class="read-more-link">Read more <i class="fas fa-arrow-right"></i></a>
      </div>
    </article>
  {% endfor %}
</div>

<div class="blog-pagination">
  <button class="pagination-btn" id="loadMoreBtn">Load More Posts</button>
</div>

<script>
  document.addEventListener('DOMContentLoaded', function() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const blogCards = document.querySelectorAll('.blog-card');
    
    searchInput.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      
      blogCards.forEach(card => {
        const title = card.querySelector('.blog-card-title').textContent.toLowerCase();
        const excerpt = card.querySelector('.blog-card-excerpt').textContent.toLowerCase();
        const tags = card.querySelector('.blog-tags') ? 
          card.querySelector('.blog-tags').textContent.toLowerCase() : '';
        
        if (title.includes(searchTerm) || excerpt.includes(searchTerm) || tags.includes(searchTerm)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
    
    // Category filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        const category = this.dataset.category;
        
        // Update active class
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        // Filter cards
        if (category === 'all') {
          blogCards.forEach(card => card.style.display = 'flex');
        } else {
          blogCards.forEach(card => {
            if (card.dataset.category.includes(category)) {
              card.style.display = 'flex';
            } else {
              card.style.display = 'none';
            }
          });
        }
      });
    });
    
    // Load more functionality
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const postsPerPage = 6;
    let currentPage = 1;
    
    function showPosts() {
      const visiblePosts = Array.from(blogCards).filter(card => 
        card.style.display !== 'none');
      
      const maxPosts = currentPage * postsPerPage;
      
      visiblePosts.forEach((post, index) => {
        if (index < maxPosts) {
          post.classList.remove('hidden-post');
        } else {
          post.classList.add('hidden-post');
        }
      });
      
      // Hide button if all posts are visible
      if (visiblePosts.length <= maxPosts) {
        loadMoreBtn.style.display = 'none';
      } else {
        loadMoreBtn.style.display = 'block';
      }
    }
    
    // Initial setup
    blogCards.forEach((card, index) => {
      if (index >= postsPerPage) {
        card.classList.add('hidden-post');
      }
    });
    
    loadMoreBtn.addEventListener('click', function() {
      currentPage++;
      showPosts();
    });
    
    // Run initial setup
    showPosts();
  });
</script>