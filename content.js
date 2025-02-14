// content.js

// Define dynamic header/footer values
let dynamicHeader = "Introduction: ";
let dynamicFooter = " Summery Section:";

let isProcessing = false;

function modifyText() {
  if (isProcessing) return;
  isProcessing = true;

  const editor = document.querySelector('#prompt-textarea');
  if (!editor) {
    isProcessing = false;
    return;
  }

  // Get current text and remove existing dynamic header/footer if present
  let currentText = editor.textContent.trim()
    .replace(new RegExp(`^${escapeRegExp(dynamicHeader)}`), '')
    .replace(new RegExp(`${escapeRegExp(dynamicFooter)}$`), '');

  // Set new text content wrapped with dynamic header/footer
  const newText = `${dynamicHeader}${currentText}${dynamicFooter}`;
  editor.textContent = newText;

  // Create an input event to trigger any framework listeners
  const inputEvent = new InputEvent('input', {
    bubbles: true,
    composed: true,
    data: newText
  });
  editor.dispatchEvent(inputEvent);

  isProcessing = false;
}

function handleSubmission() {
  if (isProcessing) return;
  
  modifyText();
  
  // Wait a short period before triggering the form submission (for state update)
  setTimeout(() => {
    const form = document.querySelector('form[type="button"]');
    if (form) {
      form.dispatchEvent(new Event('submit', { bubbles: true }));
    }
  }, 100);
}

// Utility function to escape special regex characters in a string
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
    // Remove any existing listeners to avoid duplicates
    editor.removeEventListener('keydown', handleKeyPress);
    sendButton.removeEventListener('click', handleClick);
    
    // Add fresh listeners with capture option
    editor.addEventListener('keydown', handleKeyPress, { capture: true });
    sendButton.addEventListener('click', handleClick, { capture: true });
  }
});

// Initialize the MutationObserver to monitor DOM changes
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Clear input after submission
document.addEventListener('submit', () => {
  setTimeout(() => {
    const editor = document.querySelector('#prompt-textarea');
    if (editor) editor.textContent = '';
  }, 300);
}, true);
