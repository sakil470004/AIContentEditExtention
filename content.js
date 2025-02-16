// content.js

(function() {
  // Define static header part and dynamic footer base text
  const staticHeader = "Introduction: Hi , mynul. ";
  const footerBase = " Summery Section:";

  // Variable to store the user-selected prompt (initially default to Technical)
  let selectedFooterPrompt = " Provide technical insight.";

  // Utility function to escape regex special characters
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Function to show a modal selection box with prompt options
  function showSelectionModal() {
    // Create modal background overlay
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

    // Modal title
    const title = document.createElement('h2');
    title.textContent = 'Select a Prompt Option';
    modalContent.appendChild(title);

    // Define options for prompts
    const options = [
      { value: " Enhance creativity in responses.", label: "Creative" },
      { value: " Provide technical insight.", label: "Technical" },
      { value: " Offer motivational advice.", label: "Motivational" }
    ];

    // Create buttons for each option
    options.forEach(option => {
      const btn = document.createElement('button');
      btn.textContent = option.label;
      btn.style.margin = '5px';
      btn.style.padding = '8px 12px';
      btn.addEventListener('click', function() {
        selectedFooterPrompt = option.value;
        modalBg.remove();
        // Update footer text immediately after selection
        footer.textContent = footerBase + selectedFooterPrompt;
      });
      modalContent.appendChild(btn);
    });

    modalBg.appendChild(modalContent);
    document.body.appendChild(modalBg);
  }

  // Create the header element with a "Select Prompt" button
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

  // Add a button to the header for prompt selection
  const promptButton = document.createElement('button');
  promptButton.textContent = "Select Prompt";
  promptButton.style.marginLeft = "20px";
  promptButton.style.padding = "5px 10px";
  promptButton.addEventListener('click', function(e) {
    e.stopPropagation();
    showSelectionModal();
  });
  header.appendChild(promptButton);

  // Create the footer element (dynamic footer text)
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

  // Instead of re-parenting all content, simply insert header and footer
  document.body.insertBefore(header, document.body.firstChild);
  document.body.appendChild(footer);

  // Function to modify text in the prompt textarea with header and dynamic footer
  function modifyText() {
    const editor = document.querySelector('#prompt-textarea');
    if (!editor) return;
    
    // Remove previous header/footer if present
    let currentText = editor.textContent.trim()
      .replace(new RegExp(`^${escapeRegExp(staticHeader)}`), '')
      .replace(new RegExp(`${escapeRegExp(footerBase)}.*$`), '');
    
    // Construct new text
    const newText = `${staticHeader}${currentText}${footerBase}${selectedFooterPrompt}`;
    editor.textContent = newText;
    
    // Dispatch input event for state updates
    const inputEvent = new InputEvent('input', {
      bubbles: true,
      composed: true,
      data: newText
    });
    editor.dispatchEvent(inputEvent);
  }

  // Handle submission by modifying text then triggering submit event
  function handleSubmission() {
    modifyText();
    setTimeout(() => {
      const formEl = document.querySelector('form[type="button"]');
      if (formEl) {
        formEl.dispatchEvent(new Event('submit', { bubbles: true }));
      }
    }, 100);
  }

  // Event listeners for key press and click
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

  // MutationObserver to attach event listeners when the editor and send button exist
  const observer = new MutationObserver(() => {
    const editor = document.querySelector('#prompt-textarea');
    const sendButton = document.querySelector('button[data-testid="send-button"]');
    
    if (editor && sendButton) {
      // Remove existing listeners
      editor.removeEventListener('keydown', handleKeyPress);
      sendButton.removeEventListener('click', handleClick);
      
      // Attach fresh listeners
      editor.addEventListener('keydown', handleKeyPress, { capture: true });
      sendButton.addEventListener('click', handleClick, { capture: true });
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // Clear input after submission
  document.addEventListener('submit', () => {
    setTimeout(() => {
      const editor = document.querySelector('#prompt-textarea');
      if (editor) editor.textContent = '';
    }, 300);
  }, true);
})();
