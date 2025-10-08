require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs').promises;
const { Translate } = require('@google-cloud/translate').v2;

const app = express();
const PORT = process.env.PORT || 3000;
const HISTORY_FILE = 'translations-history.json';

// Initialize Google Translate
const translate = new Translate();

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Load translation history
async function loadHistory() {
  try {
    const data = await fs.readFile(HISTORY_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Save translation history
async function saveHistory(history) {
  await fs.writeFile(HISTORY_FILE, JSON.stringify(history, null, 2));
}

// API endpoint: Translate text
app.post('/api/translate', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Translate from Swedish to English
    const [translation] = await translate.translate(text, {
      from: 'sv',
      to: 'en'
    });

    // Save to history
    const history = await loadHistory();
    const entry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      original: text,
      translated: translation,
      from: 'sv',
      to: 'en'
    };
    history.unshift(entry);

    // Keep only last 100 translations
    if (history.length > 100) {
      history.pop();
    }

    await saveHistory(history);

    res.json({
      success: true,
      original: text,
      translated: translation
    });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({
      error: 'Translation failed',
      details: error.message
    });
  }
});

// API endpoint: Get translation history
app.get('/api/history', async (req, res) => {
  try {
    const history = await loadHistory();
    res.json({ success: true, history });
  } catch (error) {
    console.error('History retrieval error:', error);
    res.status(500).json({
      error: 'Failed to retrieve history',
      details: error.message
    });
  }
});

// API endpoint: Clear history
app.delete('/api/history', async (req, res) => {
  try {
    await saveHistory([]);
    res.json({ success: true, message: 'History cleared' });
  } catch (error) {
    console.error('History clear error:', error);
    res.status(500).json({
      error: 'Failed to clear history',
      details: error.message
    });
  }
});

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Swedish-English Translator running on http://localhost:${PORT}`);
});
