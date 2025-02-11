// content.js
const header = 'test header. ';
const footer = '. test footer.';
let isProcessing = false;

function getTextContent() {
  const editor = document.querySelector('#prompt-textarea');
  return editor?.textContent?.trim() || '';
}

function setTextContent(text) {
  const editor = document.querySelector('#prompt-textarea');
  if (!editor) return;

  // Create new text node instead of HTML
  const selection = window.getSelection();
  const range = document.createRange();
  editor.textContent = text;
  
  // Move cursor to end
  range.selectNodeContents(editor);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}

function modifyText() {
  if (isProcessing) return;
  isProcessing = true;

  const originalText = getTextContent()
    .replace(new RegExp(`^${header}`), '')
    .replace(new RegExp(`${footer}$`), '');

  setTextContent(`${header}${originalText}${footer}`);

  // Trigger proper input events
  const inputEvent = new InputEvent('input', {
    bubbles: true,
    composed: true,
    data: `${header}${originalText}${footer}`
  });
  
  const changeEvent = new Event('change', { bubbles: true });
  document.querySelector('#prompt-textarea').dispatchEvent(inputEvent);
  document.querySelector('#prompt-textarea').dispatchEvent(changeEvent);

  isProcessing = false;
}

const observer = new MutationObserver((mutations) => {
  if (isProcessing) return;

  const editor = document.querySelector('#prompt-textarea');
  const sendButton = document.querySelector('button[data-testid="send-button"]');

  if (editor && sendButton) {
    // Clean existing listeners
    editor.removeEventListener('keydown', handleKeyPress);
    sendButton.removeEventListener('click', handleClick);

    // Add new listeners
    editor.addEventListener('keydown', handleKeyPress, { once: true, capture: true });
    sendButton.addEventListener('click', handleClick, { once: true, capture: true });
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

function handleSubmission() {
  modifyText();
  
  setTimeout(() => {
    const btn = document.querySelector('button[data-testid="send-button"]');
    if (btn) {
      btn.click();
      // Clear input after submission
      setTimeout(() => setTextContent(''), 300);
    }
  }, 200);
}

// Initialize
observer.observe(document.body, {
  childList: true,
  subtree: true,
  characterData: true
});

// Handle initial load
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => observer.observe(document.body, {
    childList: true,
    subtree: true
  }), 2000);
});