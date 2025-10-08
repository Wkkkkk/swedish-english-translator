// DOM elements
const swedishTextArea = document.getElementById('swedish-text');
const englishTextArea = document.getElementById('english-text');
const translateBtn = document.getElementById('translate-btn');
const clearHistoryBtn = document.getElementById('clear-history-btn');
const historyList = document.getElementById('history-list');
const errorMessage = document.getElementById('error-message');

// Load history on page load
document.addEventListener('DOMContentLoaded', () => {
    loadHistory();
});

// Translate button click handler
translateBtn.addEventListener('click', async () => {
    const text = swedishTextArea.value.trim();

    if (!text) {
        showError('Please enter some Swedish text to translate');
        return;
    }

    // Disable button and show loading state
    translateBtn.disabled = true;
    translateBtn.textContent = 'Translating...';
    hideError();

    try {
        const response = await fetch('/api/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text })
        });

        const data = await response.json();

        if (data.success) {
            englishTextArea.value = data.translated;
            loadHistory(); // Refresh history
        } else {
            showError(data.error || 'Translation failed');
        }
    } catch (error) {
        showError('Network error. Please check your connection and try again.');
        console.error('Translation error:', error);
    } finally {
        // Re-enable button
        translateBtn.disabled = false;
        translateBtn.textContent = 'Translate';
    }
});

// Clear history button click handler
clearHistoryBtn.addEventListener('click', async () => {
    if (!confirm('Are you sure you want to clear all translation history?')) {
        return;
    }

    try {
        const response = await fetch('/api/history', {
            method: 'DELETE'
        });

        const data = await response.json();

        if (data.success) {
            loadHistory();
        } else {
            showError('Failed to clear history');
        }
    } catch (error) {
        showError('Network error. Please try again.');
        console.error('Clear history error:', error);
    }
});

// Load and display translation history
async function loadHistory() {
    try {
        const response = await fetch('/api/history');
        const data = await response.json();

        if (data.success) {
            displayHistory(data.history);
        } else {
            showError('Failed to load history');
        }
    } catch (error) {
        console.error('Load history error:', error);
        historyList.innerHTML = '<div class="empty-history">Failed to load history</div>';
    }
}

// Display history items
function displayHistory(history) {
    if (!history || history.length === 0) {
        historyList.innerHTML = '<div class="empty-history">No translation history yet</div>';
        return;
    }

    historyList.innerHTML = history.map(item => `
        <div class="history-item">
            <div class="history-timestamp">${formatTimestamp(item.timestamp)}</div>
            <div class="history-text">
                <span class="history-label">Swedish:</span>
                <span class="history-content">${escapeHtml(item.original)}</span>
            </div>
            <div class="history-text">
                <span class="history-label">English:</span>
                <span class="history-content">${escapeHtml(item.translated)}</span>
            </div>
        </div>
    `).join('');
}

// Format timestamp to readable format
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
}

// Hide error message
function hideError() {
    errorMessage.classList.remove('show');
}

// Allow Enter key to submit (Ctrl+Enter for new line)
swedishTextArea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
        translateBtn.click();
    }
});
