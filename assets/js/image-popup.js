document.addEventListener('DOMContentLoaded', function () {
  const article = document.querySelector('.single-post-content');

  if (!article) {
    return;
  }

  const modal = document.createElement('div');
  modal.className = 'visual-modal';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <div class="visual-modal__dialog" role="dialog" aria-modal="true" aria-label="Expanded visual">
      <button class="visual-modal__close" type="button" aria-label="Close expanded visual">&times;</button>
      <div class="visual-modal__body"></div>
      <div class="visual-modal__caption"></div>
    </div>
  `;
  document.body.appendChild(modal);

  const modalBody = modal.querySelector('.visual-modal__body');
  const modalCaption = modal.querySelector('.visual-modal__caption');
  const closeButton = modal.querySelector('.visual-modal__close');
  let openTechNote = null;

  function getCaption(element) {
    if (!element) {
      return '';
    }

    if (element.tagName === 'IMG') {
      return element.getAttribute('alt') || '';
    }

    if (element.classList.contains('mermaid')) {
      if (element.getAttribute('data-popup-caption')) {
        return element.getAttribute('data-popup-caption');
      }

      let probe = element.previousElementSibling;
      while (probe) {
        if (/^H[1-6]$/.test(probe.tagName)) {
          return 'Expanded diagram from ' + probe.textContent.trim();
        }

        probe = probe.previousElementSibling;
      }

      return 'Expanded article diagram';
    }

    return '';
  }

  function openWithNode(node, caption) {
    modalBody.innerHTML = '';
    modalCaption.textContent = caption || '';
    modalBody.appendChild(node);
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('visual-modal-open');
  }

  function openImageFromUrl(url, caption) {
    const img = document.createElement('img');
    img.className = 'visual-modal__image';
    img.src = url;
    img.alt = caption || 'Expanded article image';
    openWithNode(img, caption);
  }

  function openMermaid(diagram, caption) {
    const wrapper = document.createElement('div');
    wrapper.className = 'visual-modal__diagram';
    wrapper.appendChild(diagram.cloneNode(true));
    openWithNode(wrapper, caption);
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    modalBody.innerHTML = '';
    modalCaption.textContent = '';
    document.body.classList.remove('visual-modal-open');
  }

  function closeTechNote(note) {
    if (!note) {
      return;
    }

    note.classList.remove('inline-tech-note--open');
    const button = note.querySelector('.inline-tech-note__link');
    if (button) {
      button.setAttribute('aria-expanded', 'false');
    }

    if (openTechNote === note) {
      openTechNote = null;
    }
  }

  function closeAllTechNotes(except) {
    article.querySelectorAll('.inline-tech-note.inline-tech-note--open').forEach(function (note) {
      if (note !== except) {
        closeTechNote(note);
      }
    });
  }

  function bindTechNote(note, index) {
    if (!note || note.dataset.popupBound === 'true') {
      return;
    }

    const content = note.getAttribute('data-tech-note-content');

    if (!content) {
      return;
    }

    note.dataset.popupBound = 'true';
    note.classList.add('inline-tech-note--ready');

    const labelText = String(index + 1);
    const panelId = 'inline-tech-note-panel-' + index;

    note.innerHTML = `
      <sup class="inline-tech-note__marker"><a class="inline-tech-note__link" href="#${panelId}" aria-expanded="false" aria-controls="${panelId}">${labelText}</a></sup>
      <span class="inline-tech-note__panel" id="${panelId}" hidden>${content}</span>
    `;

    const button = note.querySelector('.inline-tech-note__link');
    const panel = note.querySelector('.inline-tech-note__panel');
    panel.hidden = false;

    button.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();

      const isOpen = note.classList.contains('inline-tech-note--open');
      closeAllTechNotes(note);

      if (isOpen) {
        closeTechNote(note);
        return;
      }

      note.classList.add('inline-tech-note--open');
      button.setAttribute('aria-expanded', 'true');
      openTechNote = note;
    });
  }

  function bindImage(img) {
    if (!img || img.dataset.popupBound === 'true') {
      return;
    }

    if (img.closest('.related-posts, .related-post-card, .post-hero, .related-post-image')) {
      return;
    }

    img.dataset.popupBound = 'true';
    img.classList.add('visual-popup-target');
    img.setAttribute('role', 'button');
    img.setAttribute('tabindex', '0');

    const parentLink = img.closest('a[href$=".jpg"], a[href$=".jpeg"], a[href$=".png"], a[href$=".gif"], a[href$=".webp"]');

    const open = function (event) {
      if (event) {
        event.preventDefault();
      }

      const source = parentLink ? parentLink.getAttribute('href') : (img.currentSrc || img.src);
      openImageFromUrl(source, getCaption(img));
    };

    img.addEventListener('click', open);
    img.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open(event);
      }
    });

    if (parentLink && parentLink.dataset.popupBound !== 'true') {
      parentLink.dataset.popupBound = 'true';
      parentLink.classList.add('visual-popup-link');
      parentLink.addEventListener('click', open);
    }
  }

  function bindMermaid(diagram) {
    if (!diagram || diagram.dataset.popupBound === 'true' || !diagram.querySelector('svg')) {
      return;
    }

    diagram.dataset.popupBound = 'true';
    diagram.classList.add('visual-popup-target', 'visual-popup-target--diagram');
    diagram.setAttribute('role', 'button');
    diagram.setAttribute('tabindex', '0');

    const open = function (event) {
      if (event) {
        event.preventDefault();
      }
      openMermaid(diagram, getCaption(diagram));
    };

    diagram.addEventListener('click', open);
    diagram.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open(event);
      }
    });
  }

  function bindTargets() {
    article.querySelectorAll('img').forEach(bindImage);
    article.querySelectorAll('.mermaid').forEach(bindMermaid);
    article.querySelectorAll('.inline-tech-note').forEach(bindTechNote);
  }

  closeButton.addEventListener('click', closeModal);
  modal.addEventListener('click', function (event) {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }

    if (event.key === 'Escape' && openTechNote) {
      closeTechNote(openTechNote);
    }
  });

  document.addEventListener('click', function (event) {
    if (!openTechNote) {
      return;
    }

    if (!openTechNote.contains(event.target)) {
      closeTechNote(openTechNote);
    }
  });

  bindTargets();

  const observer = new MutationObserver(function () {
    bindTargets();
  });

  observer.observe(article, {
    childList: true,
    subtree: true
  });
});
