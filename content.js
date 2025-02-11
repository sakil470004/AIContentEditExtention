// Updated content.js
const header = 'test header. ';
const footer = '. test footer.';

function modifyText() {
    // Target the textarea using placeholder attribute
    const textarea = document.querySelector('textarea[placeholder="Message ChatGPT"]');
    if (textarea && textarea.value) {
        textarea.value = `${header}${textarea.value.trim()}${footer}`;
    }
}

function handleSubmit(event) {
    // Handle both Enter key and button click
    if ((event.type === 'keydown' && event.key === 'Enter' && !event.shiftKey) || 
        (event.type === 'click')) {
        setTimeout(modifyText, 50); // Small delay to ensure modification happens before submission
    }
}

// Observe DOM changes
const observer = new MutationObserver(() => {
    const textarea = document.querySelector('textarea[placeholder="Message ChatGPT"]');
    const sendButton = document.querySelector('button[data-testid="send-button"]');
    
    if (textarea && sendButton) {
        // Add event listeners
        textarea.addEventListener('keydown', handleSubmit);
        sendButton.addEventListener('click', handleSubmit);
        observer.disconnect();
    }
});

// Start observing
observer.observe(document.body, {
    childList: true,
    subtree: true
});