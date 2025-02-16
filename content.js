// content.js

(function() {
  // Define static header part and dynamic footer base text
  const staticHeader = "Introduction: Hi, mynul. ";
  const footerBase = " Summery Section:";

  // Default selected prompt (can be updated via modal)
  let selectedFooterPrompt = " Provide technical insight.";

  // Utility: escape regex special characters
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Create header with fixed boundaries ("walls")
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

  // Create an avatar (optional, for visual feedback)
  const avatarImg = document.createElement('img');
  avatarImg.src = "neutral.png"; // Ensure this file exists in your extension folder
  avatarImg.alt = "Neutral";
  avatarImg.style.width = "30px";
  avatarImg.style.height = "30px";
  avatarImg.style.marginLeft = "20px";
  avatarImg.style.verticalAlign = "middle";
  header.appendChild(avatarImg);

  // Health indicator in header (for future use)
  const healthSpan = document.createElement('span');
  healthSpan.id = "health-status";
  healthSpan.textContent = " | System Status: NEUTRAL";
  healthSpan.style.marginLeft = "20px";
  healthSpan.style.color = "lightgreen";
  header.appendChild(healthSpan);

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

  // Create footer with fixed boundaries
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

  // Insert header and footer without disturbing the rest of the page layout
  document.body.insertBefore(header, document.body.firstChild);
  document.body.appendChild(footer);

  // Modal for prompt selection
  function showSelectionModal() {
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

    const modalContent = document.createElement('div');
    modalContent.id = 'selection-modal';
    Object.assign(modalContent.style, {
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 0 10px rgba(0,0,0,0.3)',
      textAlign: 'center'
    });

    const title = document.createElement('h2');
    title.textContent = 'Select a Prompt Option';
    modalContent.appendChild(title);

    const options = [
      { value: " Enhance creativity in responses.", label: "Creative" },
      { value: " Provide technical insight.", label: "Technical" },
      { value: " Offer motivational advice.", label: "Motivational" }
    ];

    options.forEach(option => {
      const btn = document.createElement('button');
      btn.textContent = option.label;
      btn.style.margin = '5px';
      btn.style.padding = '8px 12px';
      btn.addEventListener('click', function() {
        selectedFooterPrompt = option.value;
        modalBg.remove();
        footer.textContent = footerBase + selectedFooterPrompt;
      });
      modalContent.appendChild(btn);
    });

    modalBg.appendChild(modalContent);
    document.body.appendChild(modalBg);
  }

  // Function to modify the prompt textarea text
  function modifyText() {
    const editor = document.querySelector('#prompt-textarea');
    if (!editor) return;
    
    let currentText = editor.textContent.trim()
      .replace(new RegExp(`^${escapeRegExp(staticHeader)}`), '')
      .replace(new RegExp(`${escapeRegExp(footerBase)}.*$`), '');
    
    const newText = `${staticHeader}${currentText}${footerBase}${selectedFooterPrompt}`;
    editor.textContent = newText;
    
    const inputEvent = new InputEvent('input', {
      bubbles: true,
      composed: true,
      data: newText
    });
    editor.dispatchEvent(inputEvent);
  }

  // Handling submission events
  function handleSubmission() {
    modifyText();
    setTimeout(() => {
      const formEl = document.querySelector('form[type="button"]');
      if (formEl) {
        formEl.dispatchEvent(new Event('submit', { bubbles: true }));
      }
    }, 100);
  }

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

  const observer = new MutationObserver(() => {
    const editor = document.querySelector('#prompt-textarea');
    const sendButton = document.querySelector('button[data-testid="send-button"]');
    if (editor && sendButton) {
      editor.removeEventListener('keydown', handleKeyPress);
      sendButton.removeEventListener('click', handleClick);
      
      editor.addEventListener('keydown', handleKeyPress, { capture: true });
      sendButton.addEventListener('click', handleClick, { capture: true });
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  document.addEventListener('submit', () => {
    setTimeout(() => {
      const editor = document.querySelector('#prompt-textarea');
      if (editor) editor.textContent = '';
    }, 300);
  }, true);
})();
