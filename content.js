(function() {
  // Define static parts for header and footer.
  const staticHeader = "Introduction: Hi, mynul. ";
  const footerBase = " Summery Section:";

  // Default prompt value (will be updated via the modal).
  let selectedFooterPrompt = " Provide technical insight.";

  // --- Helper Function: Escape special regex characters ---
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // --- Function: Show the prompt selection modal ---
  function showSelectionModal() {
    // Create modal overlay
    const modalBg = document.createElement('div');
    modalBg.id = 'selection-modal-bg';
    Object.assign(modalBg.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: '20000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    });

    // Create modal content container
    const modalContent = document.createElement('div');
    modalContent.id = 'selection-modal';
    Object.assign(modalContent.style, {
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 0 10px rgba(0,0,0,0.3)',
      textAlign: 'center'
    });

    // Title for the modal
    const title = document.createElement('h2');
    title.textContent = 'Select a Prompt Option';
    modalContent.appendChild(title);

    // Options for prompt selection
    const options = [
      { value: " Enhance creativity in responses.", label: "Creative" },
      { value: " Provide technical insight.", label: "Technical" },
      { value: " Offer motivational advice.", label: "Motivational" }
    ];

    // Create a button for each option
    options.forEach(option => {
      const btn = document.createElement('button');
      btn.textContent = option.label;
      btn.style.margin = '5px';
      btn.style.padding = '8px 12px';
      btn.addEventListener('click', function() {
        // Update selected prompt and update footer text
        selectedFooterPrompt = option.value;
        footer.textContent = footerBase + selectedFooterPrompt;
        modalBg.remove();
      });
      modalContent.appendChild(btn);
    });

    modalBg.appendChild(modalContent);
    document.body.appendChild(modalBg);
  }

  // --- Create the header ---
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
  header.innerHTML = staticHeader;

  // Add a "Select Prompt" button to the header
  const promptButton = document.createElement('button');
  promptButton.textContent = "Select Prompt";
  promptButton.style.marginLeft = "20px";
  promptButton.style.padding = "5px 10px";
  promptButton.addEventListener('click', function(e) {
    e.stopPropagation();
    showSelectionModal();
  });
  header.appendChild(promptButton);

  // --- Create the footer ---
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
  footer.textContent = footerBase + selectedFooterPrompt;

  // --- Insert header and footer into the page ---
  document.body.insertBefore(header, document.body.firstChild);
  document.body.appendChild(footer);

  // --- Function: Modify the prompt textarea text ---
  function modifyText() {
    const editor = document.querySelector('#prompt-textarea');
    if (!editor) return;
    
    // Remove previous header and footer if present in the editor
    let currentText = editor.textContent.trim()
      .replace(new RegExp(`^${escapeRegExp(staticHeader)}`), '')
      .replace(new RegExp(`${escapeRegExp(footerBase)}.*$`), '');
    
    // Construct the new text with header and footer
    const newText = `${staticHeader}${currentText}${footerBase}${selectedFooterPrompt}`;
    editor.textContent = newText;
    
    // Create and dispatch an input event (useful for React-based pages)
    const inputEvent = new InputEvent('input', {
      bubbles: true,
      composed: true,
      data: newText
    });
    editor.dispatchEvent(inputEvent);
  }

  // --- Handle submission of a prompt ---
  function handleSubmission() {
    modifyText();
    // Delay submission to allow UI state to update
    setTimeout(() => {
      const formEl = document.querySelector('form[type="button"]');
      if (formEl) {
        formEl.dispatchEvent(new Event('submit', { bubbles: true }));
      }
    }, 100);
  }

  // --- Event listeners for key press and click on send button ---
  function handleKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.stopImmediatePropagation();
      handleSubmission();
    }
  }
  function handleClick(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    handleSubmission();
  }

  // --- MutationObserver to attach listeners when the editor and send button are available ---
  const observer = new MutationObserver(() => {
    const editor = document.querySelector('#prompt-textarea');
    const sendButton = document.querySelector('button[data-testid="send-button"]');
    
    if (editor && sendButton) {
      // Remove existing listeners to avoid duplicates
      editor.removeEventListener('keydown', handleKeyPress);
      sendButton.removeEventListener('click', handleClick);
      
      // Attach listeners
      editor.addEventListener('keydown', handleKeyPress, { capture: true });
      sendButton.addEventListener('click', handleClick, { capture: true });
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // --- Clear prompt textarea after submission ---
  document.addEventListener('submit', () => {
    setTimeout(() => {
      const editor = document.querySelector('#prompt-textarea');
      if (editor) editor.textContent = '';
    }, 300);
  }, true);
})();
