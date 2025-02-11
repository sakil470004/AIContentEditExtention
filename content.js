const header = 'test header. ';
const footer = '. test footer.';

function modifyText() {
    const textarea = document.querySelector('#prompt-textarea');
    if (textarea && textarea.value) {
        textarea.value = `${header}${textarea.value.trim()}${footer}`;
    }
}

function handleKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        modifyText();
    }
}

function handleButtonClick() {
    modifyText();
}

// Wait for ChatGPT interface to load
const observer = new MutationObserver(() => {
    const textarea = document.querySelector('#prompt-textarea');
    const sendButton = document.querySelector('button[data-testid="send-button"]');
    
    if (textarea && sendButton) {
        // Add event listeners
        textarea.addEventListener('keydown', handleKeyPress, { capture: true });
        sendButton.addEventListener('click', handleButtonClick, { capture: true });
        observer.disconnect();
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});