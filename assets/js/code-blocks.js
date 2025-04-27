// assets/js/code-blocks.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all code blocks
    initCodeBlocks();
    
    // Initialize Mermaid diagrams with custom config
    initMermaidDiagrams();
  });
  
  /**
   * Initialize all code blocks with collapsible functionality and copy button
   */
  /**
 * Initialize all code blocks with collapsible functionality and copy button
 */
function initCodeBlocks() {
    // Find all code blocks
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach((codeBlock, index) => {
      const pre = codeBlock.parentNode;
      const id = `code-block-${index}`;
      pre.id = id;
      
      // Set language attribute for styling
      const language = getLanguageFromClass(codeBlock.className);
      if (language) {
        pre.setAttribute('data-lang', language);
      }
      
      // Create action buttons container
      const actionsContainer = document.createElement('div');
      actionsContainer.className = 'code-actions';
      pre.appendChild(actionsContainer);
      
      // Add copy button
      addCopyButton(actionsContainer, codeBlock);
      
      // Make collapsible if code is long
      if (codeBlock.textContent.split('\n').length > 10) {
        makeCollapsible(pre, actionsContainer);
      }
      
      // Format special languages
      formatSpecialLanguages(codeBlock, language);
    });
  }
  
  /**
   * Extract language from code block class
   */
  function getLanguageFromClass(className) {
    // Extract language from class like "language-csharp"
    const match = className.match(/language-(\w+(-\w+)?)/);
    if (match) {
      return match[1];
    }
    return null;
  }
  
/**
 * Add copy button to code block
 */
function addCopyButton(container, codeBlock) {
    const copyBtn = document.createElement('button');
    copyBtn.className = 'code-copy-btn';
    copyBtn.innerHTML = '<i class="fa fa-copy"></i>'; // Font Awesome copy icon
    copyBtn.title = 'Copy to clipboard';
    
    copyBtn.addEventListener('click', () => {
      // Get text and copy to clipboard
      const text = codeBlock.textContent;
      navigator.clipboard.writeText(text).then(() => {
        // Show copied feedback
        copyBtn.innerHTML = '<i class="fa fa-check"></i>'; // Change to checkmark icon
        copyBtn.classList.add('copied');
        
        // Reset after 2 seconds
        setTimeout(() => {
          copyBtn.innerHTML = '<i class="fa fa-copy"></i>';
          copyBtn.classList.remove('copied');
        }, 2000);
      });
    });
    
    container.appendChild(copyBtn);
  }
  
  /**
   * Make a code block collapsible if it's long
   */
/**
 * Make a code block collapsible if it's long
 */
function makeCollapsible(pre, actionsContainer) {
    // Start collapsed
    pre.classList.add('collapsed');
    
    // Add collapsed indicator
    const indicator = document.createElement('div');
    indicator.className = 'collapsed-indicator';
    indicator.innerHTML = '<i class="fa fa-ellipsis-h"></i> <span>Code collapsed</span>';
    pre.appendChild(indicator);
    
    // Add toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'collapse-toggle';
    toggleBtn.innerHTML = '<i class="fa fa-chevron-down"></i>'; // Down arrow icon
    toggleBtn.title = 'Expand code';
    
    toggleBtn.addEventListener('click', () => {
      pre.classList.toggle('collapsed');
      
      if (pre.classList.contains('collapsed')) {
        toggleBtn.innerHTML = '<i class="fa fa-chevron-down"></i>'; // Down arrow icon
        toggleBtn.title = 'Expand code';
      } else {
        toggleBtn.innerHTML = '<i class="fa fa-chevron-up"></i>'; // Up arrow icon
        toggleBtn.title = 'Collapse code';
      }
    });
    
    actionsContainer.appendChild(toggleBtn);
  }
  
  /**
   * Format special languages with specific styling
   */
  function formatSpecialLanguages(codeBlock, language) {
    if (!language) return;
    
    // Handle line numbers for certain languages
    if (['csharp', 'cs', 'javascript', 'js', 'typescript', 'ts', 'cshtml', 'razor'].includes(language)) {
      addLineNumbers(codeBlock);
    }
    
    // Format HTTP headers specially
    if (language === 'http' || language === 'http-headers') {
      formatHttpHeaders(codeBlock);
    }
    
    // Format email headers specially
    if (language === 'email' || language === 'email-header') {
      formatEmailHeaders(codeBlock);
    }
    
    // Format command line specially
    if (language === 'cmd' || language === 'powershell') {
      formatCommandLine(codeBlock);
    }
    
    // Format Razor/CSHTML specially
    if (language === 'cshtml' || language === 'razor') {
      formatRazorSyntax(codeBlock);
    }
  }
  
  /**
   * Add line numbers to code
   */
  function addLineNumbers(codeBlock) {
    // Add line numbers container class
    codeBlock.parentNode.classList.add('has-line-numbers');
    
    // Split code by lines and wrap each in a span
    const lines = codeBlock.innerHTML.split('\n');
    const wrappedLines = lines.map(line => 
      `<span class="code-line">${line}</span>`
    ).join('\n');
    
    codeBlock.innerHTML = wrappedLines;
  }
  
  /**
   * Format HTTP headers with colorized parts
   */
  function formatHttpHeaders(codeBlock) {
    const text = codeBlock.textContent;
    const lines = text.split('\n');
    
    const formattedLines = lines.map(line => {
      // Format method and URL
      if (line.match(/^(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)/)) {
        return line.replace(/^(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)(\s+)([^\s]+)(\s+)(HTTP\/[\d.]+)/, 
          '<span style="color:#f92672">$1</span>$2<span style="color:#a6e22e">$3</span>$4<span style="color:#66d9ef">$5</span>');
      }
      
      // Format header name and value
      if (line.match(/^[\w-]+:/)) {
        return line.replace(/^([\w-]+)(:)(.*)/, 
          '<span style="color:#a6e22e">$1</span><span style="color:#f8f8f2">$2</span><span style="color:#e6db74">$3</span>');
      }
      
      return line;
    });
    
    codeBlock.innerHTML = formattedLines.join('\n');
  }
  
  /**
   * Format email headers with colorized parts
   */
  function formatEmailHeaders(codeBlock) {
    const text = codeBlock.textContent;
    const lines = text.split('\n');
    let inBody = false;
    
    const formattedLines = lines.map(line => {
      // Detect empty line that separates headers from body
      if (line.trim() === '') {
        inBody = true;
        return '<div class="email-body">';
      }
      
      if (inBody) {
        return line;
      }
      
      // Format specific common headers with distinct colors
      if (line.match(/^From:/i)) {
        return line.replace(/^(From:)(.*)/, 
          '<span class="email-from"><span class="email-header-name">$1</span><span class="email-header-value">$2</span></span>');
      }
      
      if (line.match(/^To:/i)) {
        return line.replace(/^(To:)(.*)/, 
          '<span class="email-to"><span class="email-header-name">$1</span><span class="email-header-value">$2</span></span>');
      }
      
      if (line.match(/^Cc:/i) || line.match(/^Bcc:/i)) {
        return line.replace(/^(Cc:|Bcc:)(.*)/, 
          '<span class="email-cc"><span class="email-header-name">$1</span><span class="email-header-value">$2</span></span>');
      }
      
      if (line.match(/^Subject:/i)) {
        return line.replace(/^(Subject:)(.*)/, 
          '<span class="email-subject"><span class="email-header-name">$1</span><span class="email-header-value">$2</span></span>');
      }
      
      if (line.match(/^Date:/i)) {
        return line.replace(/^(Date:)(.*)/, 
          '<span class="email-date"><span class="email-header-name">$1</span><span class="email-header-value">$2</span></span>');
      }
      
      // Format any other headers
      if (line.match(/^[\w-]+:/i)) {
        return line.replace(/^([\w-]+:)(.*)/, 
          '<span class="email-header-name">$1</span><span class="email-header-value">$2</span>');
      }
      
      return line;
    });
    
    // Close the email body div if we found a body
    let content = formattedLines.join('\n');
    if (inBody) {
      content += '</div>';
    }
    
    codeBlock.innerHTML = content;
  }
  
  /**
   * Format command line with prompt styling
   */
  function formatCommandLine(codeBlock) {
    const text = codeBlock.textContent;
    const lines = text.split('\n');
    
    const formattedLines = lines.map(line => {
      // Style command prompt
      if (line.match(/^[\$>]/)) {
        return line.replace(/^([\$>])(.*)/, 
          '<span style="color:#f92672">$1</span><span style="color:#f8f8f2">$2</span>');
      }
      
      // Style output differently
      return `<span style="color:#a6a6a6">${line}</span>`;
    });
    
    codeBlock.innerHTML = formattedLines.join('\n');
  }
  
  /**
   * Format Razor/CSHTML syntax with special highlighting
   */
  function formatRazorSyntax(codeBlock) {
    let html = codeBlock.innerHTML;
    
    // Highlight Razor directives (@model, @using, etc.)
    html = html.replace(/(@(?:model|using|inherits|inject|implements|namespace|page|functions|section|addTagHelper)[\s\w.,&lt;&gt;]*)/g, 
      '<span class="razor-directive">$1</span>');
    
    // Highlight Razor code blocks (@{...})
    html = html.replace(/(@\{(?:.|\s)*?\})/g, 
      '<span class="razor-code-block">$1</span>');
    
    // Highlight Razor expressions (@Model.Property, @item, etc.)
    html = html.replace(/(@[\w.()[\]]+)/g, function(match) {
      // Don't re-highlight things already highlighted as directives or code blocks
      if (match.match(/^@(?:model|using|inherits|inject|implements|namespace|page|functions|section|addTagHelper)/)) {
        return match;
      }
      if (match.match(/^@\{/)) {
        return match;
      }
      return '<span class="razor-expression">' + match + '</span>';
    });
    
    // Highlight the @ symbol itself
    html = html.replace(/(@)(?=[\w{])/g, 
      '<span class="razor-at-symbol">$1</span>');
    
    codeBlock.innerHTML = html;
  }
  
  /**
   * Initialize Mermaid diagrams with custom configuration
   */
  function initMermaidDiagrams() {
    // Configure Mermaid with custom settings
    if (typeof mermaid !== 'undefined') {
      mermaid.initialize({
        startOnLoad: true,
        theme: document.body.classList.contains('dark-mode') ? 'dark' : 'default',
        flowchart: {
          curve: 'basis',
          htmlLabels: true
        },
        sequence: {
          diagramMarginX: 50,
          diagramMarginY: 10,
          boxTextMargin: 5,
          noteMargin: 10,
          messageMargin: 35
        },
        gantt: {
          titleTopMargin: 25,
          barHeight: 20,
          barGap: 4,
          topPadding: 50,
          leftPadding: 75
        }
      });
      
      // Listen for theme changes to update diagrams
      const themeToggle = document.getElementById('darkModeToggle');
      if (themeToggle) {
        themeToggle.addEventListener('click', () => {
          // Wait for theme change to complete
          setTimeout(() => {
            // Re-render all diagrams with new theme
            mermaid.init(undefined, document.querySelectorAll('.mermaid'));
          }, 300);
        });
      }
    }
  }