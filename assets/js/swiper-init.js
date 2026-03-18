document.addEventListener('DOMContentLoaded', function() {
  const container = document.querySelector('.project-cards-container');
  const prevBtn = document.querySelector('.custom-swiper-prev');
  const nextBtn = document.querySelector('.custom-swiper-next');
  
  if (!container || !prevBtn || !nextBtn) return;
  
  const cards = container.querySelectorAll('.project-card');
  let currentIndex = 0;
  
  prevBtn.addEventListener('click', function() {
    currentIndex = Math.max(0, currentIndex - 1);
    cards[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  });
  
  nextBtn.addEventListener('click', function() {
    currentIndex = Math.min(cards.length - 1, currentIndex + 1);
    cards[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  });
});