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

  // Create the footer element (footer text will be generated dynamically)
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

  // Wrap original body content in a new container
  const originalContent = document.createElement('div');
  originalContent.id = 'original-content';
  while (document.body.firstChild) {
    originalContent.appendChild(document.body.firstChild);
  }
  // Add padding so content isn't hidden by fixed header/footer
  originalContent.style.paddingTop = '60px';
  originalContent.style.paddingBottom = '60px';

  // Create the chat container for system messages (if needed)
  const chatContainer = document.createElement('div');
  chatContainer.id = 'chat-container';
  Object.assign(chatContainer.style, {
    position: 'fixed',
    top: '60px',
    bottom: '60px',
    left: '0',
    right: '0',
    zIndex: '10000',
    overflowY: 'auto',
    padding: '20px',
    backgroundColor: 'rgba(255,255,255,0.95)'
  });
  const conversation = document.createElement('div');
  conversation.id = 'conversation';
  chatContainer.appendChild(conversation);

  // Create input form for user messages
  const form = document.createElement('form');
  form.id = 'chat-form';
  Object.assign(form.style, {
    position: 'fixed',
    bottom: '70px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: '10001',
    display: 'flex',
    alignItems: 'center'
  });
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Type your message...';
  Object.assign(input.style, {
    width: '300px',
    padding: '10px',
    fontSize: '16px'
  });
  const sendBtn = document.createElement('button');
  sendBtn.type = 'submit';
  sendBtn.textContent = 'Send';
  Object.assign(sendBtn.style, {
    marginLeft: '10px',
    padding: '10px 20px',
    fontSize: '16px'
  });
  form.appendChild(input);
  form.appendChild(sendBtn);

  // Append the created elements to the body
  document.body.appendChild(header);
  document.body.appendChild(footer);
  document.body.appendChild(originalContent);
  document.body.appendChild(chatContainer);
  document.body.appendChild(form);

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

  // Handle submission by modifying text and then triggering submit event
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
