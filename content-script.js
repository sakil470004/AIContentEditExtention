document.addEventListener("DOMContentLoaded", function() {
    // Create the header element
    const header = document.createElement('div');
    header.id = 'custom-header';
    Object.assign(header.style, {
      backgroundColor: '#444',
      color: '#fff',
      padding: '10px',
      textAlign: 'center',
      fontSize: '18px',
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      zIndex: '10000'
    });
    header.textContent = 'HEADER: My Hard-Coded Header';
  
    // Create the footer element
    const footer = document.createElement('div');
    footer.id = 'custom-footer';
    Object.assign(footer.style, {
      backgroundColor: '#444',
      color: '#fff',
      padding: '10px',
      textAlign: 'center',
      fontSize: '18px',
      position: 'fixed',
      bottom: '0',
      left: '0',
      right: '0',
      zIndex: '10000'
    });
    footer.textContent = 'FOOTER: My Hard-Coded Footer';
  
    // To avoid overlap with header and footer, wrap the original body content
    const originalContent = document.createElement('div');
    originalContent.id = 'original-content';
    // Move existing body content into our wrapper
    while (document.body.firstChild) {
      originalContent.appendChild(document.body.firstChild);
    }
    // Optionally add some padding/margin so the content isn't hidden behind fixed elements
    originalContent.style.paddingTop = '60px';
    originalContent.style.paddingBottom = '60px';
  
    // Append the new elements to the body
    document.body.appendChild(header);
    document.body.appendChild(originalContent);
    document.body.appendChild(footer);
  });
  