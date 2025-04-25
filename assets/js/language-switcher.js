// Language preference handling with debug mode
document.addEventListener('DOMContentLoaded', function() {
  // Constants
  const STORAGE_KEY = 'preferredLanguage';
  const DEBUG = window.location.search.includes('debug=true');
  
  // Create debug panel if in debug mode
  let debugPanel, logContainer;
  if (DEBUG) {
    debugPanel = document.createElement('div');
    debugPanel.id = 'lang-debug-panel';
    debugPanel.style.cssText = `
      position: fixed;
      bottom: 10px;
      right: 10px;
      width: 300px;
      max-height: 300px;
      overflow: auto;
      background: rgba(0,0,0,0.8);
      color: #00ff00;
      padding: 10px;
      font-family: monospace;
      font-size: 12px;
      z-index: 9999;
      border-radius: 5px;
    `;
    
    const closeBtn = document.createElement('button');
    closeBtn.innerText = 'Close';
    closeBtn.style.cssText = `
      position: absolute;
      top: 5px;
      right: 5px;
      background: #333;
      color: white;
      border: none;
      padding: 2px 5px;
      cursor: pointer;
    `;
    closeBtn.onclick = () => { debugPanel.style.display = 'none'; };
    
    const clearBtn = document.createElement('button');
    clearBtn.innerText = 'Clear';
    clearBtn.style.cssText = `
      position: absolute;
      top: 5px;
      right: 60px;
      background: #333;
      color: white;
      border: none;
      padding: 2px 5px;
      cursor: pointer;
    `;
    clearBtn.onclick = () => { 
      logContainer.innerHTML = '';
    };
    
    const title = document.createElement('h3');
    title.innerText = 'Language Switcher Debug';
    title.style.cssText = 'margin: 0 0 10px 0; color: white;';
    
    logContainer = document.createElement('div');
    logContainer.id = 'lang-debug-log';
    
    debugPanel.appendChild(closeBtn);
    debugPanel.appendChild(clearBtn);
    debugPanel.appendChild(title);
    debugPanel.appendChild(logContainer);
    
    document.body.appendChild(debugPanel);
  }
  
  // Debug logging function
  function logDebug(message, data = null) {
    if (!DEBUG) return;
    
    console.log('[LangSwitcher]', message, data || '');
    
    if (!logContainer) return;
    
    const entry = document.createElement('div');
    entry.style.borderBottom = '1px solid #333';
    entry.style.paddingBottom = '5px';
    entry.style.marginBottom = '5px';
    
    const timestamp = document.createElement('span');
    timestamp.innerText = new Date().toLocaleTimeString();
    timestamp.style.color = '#999';
    
    const messageEl = document.createElement('div');
    messageEl.innerText = message;
    
    entry.appendChild(timestamp);
    entry.appendChild(messageEl);
    
    if (data) {
      const dataEl = document.createElement('pre');
      dataEl.innerText = typeof data === 'object' ? JSON.stringify(data, null, 2) : data;
      dataEl.style.margin = '5px 0';
      dataEl.style.padding = '5px';
      dataEl.style.background = 'rgba(0,0,0,0.3)';
      dataEl.style.borderRadius = '3px';
      dataEl.style.overflow = 'auto';
      entry.appendChild(dataEl);
    }
    
    logContainer.prepend(entry);
  }
  
  // Log initial state if in debug mode
  if (DEBUG) {
    logDebug('Page loaded: ' + window.location.pathname);
    
    // Log localStorage
    try {
      const storedLang = localStorage.getItem(STORAGE_KEY);
      logDebug('Stored language preference', storedLang || 'None');
      
      const allStorage = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        allStorage[key] = localStorage.getItem(key);
      }
      logDebug('All localStorage items', allStorage);
    } catch (e) {
      logDebug('Error accessing localStorage', e.message);
    }
    
    // Log cookies
    logDebug('Cookies', document.cookie || 'None');
    
    // Log meta tags
    const langMeta = document.querySelector('meta[name="page-ref"]');
    logDebug('Page ref meta tag', langMeta ? langMeta.getAttribute('content') : 'None');
    
    // Log HTML lang attribute
    logDebug('HTML lang attribute', document.documentElement.lang || 'None');
    
    // Log routes data
    const routesElement = document.getElementById('site-routes-data');
    if (routesElement) {
      try {
        const routes = JSON.parse(routesElement.textContent);
        logDebug('Routes data loaded', routes);
      } catch (e) {
        logDebug('Error parsing routes data', e.message);
      }
    } else {
      logDebug('No routes data element found');
    }
  }
  
  // Get language elements
  const languageTrigger = document.querySelector('.language-trigger');
  const languageDropdown = document.querySelector('.language-dropdown');
  const languageOptions = document.querySelectorAll('.language-option');
  
  // Toggle dropdown 
  if (languageTrigger) {
    languageTrigger.addEventListener('click', function(e) {
      e.preventDefault();
      languageDropdown.classList.toggle('open');
      if (DEBUG) logDebug('Language dropdown toggled');
    });
  }
  
  // Handle language selection and store preference
  languageOptions.forEach(option => {
    option.addEventListener('click', function(e) {
      // Get the selected language and target URL
      const selectedLang = this.getAttribute('data-lang');
      const targetUrl = this.getAttribute('href');
      
      // Store in localStorage
      try {
        localStorage.setItem(STORAGE_KEY, selectedLang);
        if (DEBUG) logDebug('Language preference saved', { lang: selectedLang, url: targetUrl });
      } catch (e) {
        if (DEBUG) logDebug('Error saving language preference', e.message);
      }
      
      // Add debugging to URL if debug mode is on
      if (DEBUG) {
        const separator = targetUrl.includes('?') ? '&' : '?';
        this.href = `${targetUrl}${separator}debug=true`;
        logDebug('Modified link with debug parameter', this.href);
      }
    });
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.language-switcher-container')) {
      languageDropdown.classList.remove('open');
    }
  });
  
  // Verify links are correctly set up - important for debugging
  if (DEBUG) {
    // Check language options
    const optionsInfo = [];
    languageOptions.forEach(option => {
      optionsInfo.push({
        lang: option.getAttribute('data-lang'),
        href: option.getAttribute('href')
      });
    });
    logDebug('Language options', optionsInfo);
    
    // Check all navigation links 
    const navLinks = document.querySelectorAll('.nav-links a');
    const navInfo = [];
    navLinks.forEach(link => {
      navInfo.push({
        text: link.textContent.trim(),
        href: link.getAttribute('href')
      });
    });
    logDebug('Navigation links', navInfo);
  }
});