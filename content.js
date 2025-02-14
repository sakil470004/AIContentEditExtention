// content.js

(function() {
  // Define static header and footer parts
  const dynamicHeader = "Introduction: Hi , mynul. ";
  const dynamicFooter = " Summery Section:";

  // Variable to store the user-selected prompt (initially empty)
  let selectedFooterPrompt = "";

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
      btn.addEventListener('click', function() {
        selectedFooterPrompt = option.value;
        // Remove modal once an option is chosen
        modalBg.remove();
      });
      modalContent.appendChild(btn);
    });

    modalBg.appendChild(modalContent);
    document.body.appendChild(modalBg);
  }

  // Call the modal on extension load
  showSelectionModal();

  // Function to modify text in the prompt textarea with header, footer, and selected prompt
  function modifyText() {
    const editor = document.querySelector('#prompt-textarea');
    if (!editor) return;

    // Get current text and remove previous header/footer if present
    let currentText = editor.textContent.trim()
      .replace(new RegExp(`^${escapeRegExp(dynamicHeader)}`), '')
      .replace(new RegExp(`${escapeRegExp(dynamicFooter)}.*$`), '');

    // Construct the new text
    const newText = `${dynamicHeader}${currentText}${dynamicFooter}${selectedFooterPrompt}`;
    editor.textContent = newText;

    // Dispatch an input event (useful for React state updates)
    const inputEvent = new InputEvent('input', {
      bubbles: true,
      composed: true,
      data: newText
    });
    editor.dispatchEvent(inputEvent);
  }

  // Function to handle submission by modifying the text
  function handleSubmission() {
    modifyText();
    setTimeout(() => {
      const form = document.querySelector('form[type="button"]');
      if (form) {
        form.dispatchEvent(new Event('submit', { bubbles: true }));
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
      // Clean up any existing listeners to avoid duplicates
      editor.removeEventListener('keydown', handleKeyPress);
      sendButton.removeEventListener('click', handleClick);

      // Attach event listeners
      editor.addEventListener('keydown', handleKeyPress, { capture: true });
      sendButton.addEventListener('click', handleClick, { capture: true });
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Clear the input after submission
  document.addEventListener('submit', () => {
    setTimeout(() => {
      const editor = document.querySelector('#prompt-textarea');
      if (editor) editor.textContent = '';
    }, 300);
  }, true);
})();
