// content.js
const header = 'test header. ';
const footer = '. test footer.';

function modifyText() {
    const editor = document.querySelector('#prompt-textarea');
    if (editor) {
        const currentText = editor.innerText.trim();
        editor.innerHTML = `<p>${header}${currentText}${footer}</p>`;
        
        // Trigger input event for React
        const event = new Event('input', { bubbles: true });
        editor.dispatchEvent(event);
    }
}

function handleSubmit(event) {
    if ((event.key === 'Enter' && !event.shiftKey) || event.type === 'click') {
        event.preventDefault();
        event.stopImmediatePropagation();
        
        modifyText();
        
        // Allow native submission
        setTimeout(() => {
            document.querySelector('button[data-testid="send-button"]').click();
        }, 50);
    }
}

const observer = new MutationObserver(() => {
    const editor = document.querySelector('#prompt-textarea');
    const sendButton = document.querySelector('button[data-testid="send-button"]');
    
    if (editor && sendButton) {
        // Remove existing listeners to prevent duplicates
        editor.removeEventListener('keydown', handleSubmit);
        sendButton.removeEventListener('click', handleSubmit);
        
        // Add new listeners with capture phase
        editor.addEventListener('keydown', handleSubmit, { capture: true });
        sendButton.addEventListener('click', handleSubmit, { capture: true });
    }
});

// Start observing
observer.observe(document.body, {
    childList: true,
    subtree: true
});