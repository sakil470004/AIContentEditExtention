// content.js
const header = 'test header. ';
const footer = '. test footer.';

let isProcessing = false;

function modifyText() {
    if (isProcessing) return;
    isProcessing = true;
    
    const editor = document.querySelector('#prompt-textarea');
    if (!editor) return;

    // Get raw text without any HTML tags
    const rawText = editor.innerText.trim();
    
    // Clear existing content properly
    editor.innerHTML = '';
    
    // Create new content with single header/footer
    const newContent = document.createElement('p');
    newContent.textContent = `${header}${rawText}${footer}`;
    
    // Insert new content
    editor.appendChild(newContent);
    
    // Create proper input events
    const inputEvent = new Event('input', { bubbles: true });
    const changeEvent = new Event('change', { bubbles: true });
    
    editor.dispatchEvent(inputEvent);
    editor.dispatchEvent(changeEvent);
    
    // Reset processing flag after DOM updates
    setTimeout(() => {
        isProcessing = false;
    }, 100);
}

function handleSubmit(event) {
    if (isProcessing) return;
    
    event.preventDefault();
    event.stopImmediatePropagation();
    
    modifyText();
    
    // Trigger submit after modification
    setTimeout(() => {
        document.querySelector('button[data-testid="send-button"]').click();
    }, 150);
}

const observer = new MutationObserver((mutations) => {
    const editor = document.querySelector('#prompt-textarea');
    const sendButton = document.querySelector('button[data-testid="send-button"]');
    
    if (editor && sendButton) {
        // Clean up existing listeners
        editor.removeEventListener('keydown', handleSubmit);
        sendButton.removeEventListener('click', handleSubmit);
        
        // Add new listeners with proper options
        editor.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) handleSubmit(e);
        }, { once: true, capture: true });
        
        sendButton.addEventListener('click', handleSubmit, { once: true, capture: true });
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true,
    childList: true
});

// Initial setup in case elements already exist
setTimeout(() => observer.observe(document.body, {
    childList: true,
    subtree: true
}), 1000);