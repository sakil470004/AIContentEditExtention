// content.js
const header = '';
const footer ="In response, start with '[HEADER:Introduction]' and end with '[FOOTER:Summery].";
let isProcessing = false;

function modifyText() {
  if (isProcessing) return;
  isProcessing = true;

  const editor = document.querySelector('#prompt-textarea');
  if (!editor) return;

  // Get current text and remove existing headers/footers
  let currentText = editor.textContent.trim()
    .replace(new RegExp(`^${header}`), '')
    .replace(new RegExp(`${footer}$`), '');

  // Set new text content
  editor.textContent = `${header}${currentText}${footer}`;

  // Create proper input event
  const inputEvent = new InputEvent('input', {
    bubbles: true,
    composed: true,
    data: `${header}${currentText}${footer}`
  });
  
  editor.dispatchEvent(inputEvent);
  isProcessing = false;
}

function handleSubmission() {
  if (isProcessing) return;
  
  modifyText();
  
  // Wait for React state update before submitting
  setTimeout(() => {
    const form = document.querySelector('form[type="button"]');
    if (form) {
      form.dispatchEvent(new Event('submit', { bubbles: true }));
    }
  }, 100);
}

const observer = new MutationObserver(() => {
  const editor = document.querySelector('#prompt-textarea');
  const sendButton = document.querySelector('button[data-testid="send-button"]');
  
  if (editor && sendButton) {
    // Clean up existing listeners
    editor.removeEventListener('keydown', handleKeyPress);
    sendButton.removeEventListener('click', handleClick);
    
    // Add fresh listeners
    editor.addEventListener('keydown', handleKeyPress, { capture: true });
    sendButton.addEventListener('click', handleClick, { capture: true });
  }
});

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

// Initialize observer
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Clear input after successful submission
document.addEventListener('submit', () => {
  setTimeout(() => {
    const editor = document.querySelector('#prompt-textarea');
    if (editor) editor.textContent = '';
  }, 300);
}, true);