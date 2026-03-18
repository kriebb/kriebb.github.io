// Prism.js setup and initialization
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('pre code:not([class*="language-"])').forEach(el => {
    el.classList.add('language-plaintext');
  });

  document.querySelectorAll('pre code').forEach(block => {
    const pre = block.closest('pre');
    if (pre && !pre.classList.contains('line-numbers')) {
      pre.classList.add('line-numbers');
    }
  });

  if (window.Prism) {
    Prism.highlightAll();
  }

  document.querySelectorAll('pre code.language-cshtml, pre code.language-razor').forEach(block => {
    void block;
  });
});
