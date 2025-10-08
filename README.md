# Swedish to English Translator

A web application that translates Swedish text to English using Google Translate API, with translation history tracking.

## Features

- 🌐 Real-time Swedish to English translation
- 📝 Translation history with timestamps
- 💾 Persistent storage of translations
- 🎨 Beautiful, responsive UI
- 🚀 Fast and reliable Google Translate integration

## Prerequisites

- Node.js (v14 or higher)
- Google Cloud account with Translation API enabled
- Google Cloud service account credentials

## Setup Instructions

### 1. Clone the Repository

```bash
cd /Users/kunwu/Workspace/playground/Claude/helloOSC
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Google Cloud Translation API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Cloud Translation API:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Cloud Translation API"
   - Click "Enable"
4. Create a service account:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Fill in the details and click "Create"
   - Grant the role "Cloud Translation API User"
   - Click "Done"
5. Create and download credentials:
   - Click on the service account you just created
   - Go to "Keys" tab
   - Click "Add Key" > "Create new key"
   - Choose JSON format
   - Save the file as `google-credentials.json` in the project root

### 4. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and set:

```
GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json
PORT=3000
```

### 5. Run the Application

Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Enter Swedish text in the input area
3. Click "Translate" or press Ctrl+Enter
4. View the English translation in the output area
5. All translations are automatically saved to history
6. Click "Clear History" to remove all saved translations

## API Endpoints

### POST `/api/translate`
Translate Swedish text to English

**Request:**
```json
{
  "text": "Hej världen"
}
```

**Response:**
```json
{
  "success": true,
  "original": "Hej världen",
  "translated": "Hello world"
}
```

### GET `/api/history`
Get translation history

**Response:**
```json
{
  "success": true,
  "history": [
    {
      "id": 1234567890,
      "timestamp": "2025-10-08T10:30:00.000Z",
      "original": "Hej världen",
      "translated": "Hello world",
      "from": "sv",
      "to": "en"
    }
  ]
}
```

### DELETE `/api/history`
Clear translation history

**Response:**
```json
{
  "success": true,
  "message": "History cleared"
}
```

## Project Structure

```
helloOSC/
├── server.js              # Express server and API endpoints
├── package.json           # Node.js dependencies
├── .env                   # Environment variables (not in git)
├── .env.example           # Example environment variables
├── .gitignore            # Git ignore file
├── README.md             # This file
├── google-credentials.json # Google Cloud credentials (not in git)
├── translations-history.json # Translation history storage (not in git)
└── public/
    ├── index.html        # Main HTML page
    ├── styles.css        # Styles
    └── app.js            # Frontend JavaScript
```

## Deployment to OpenSourceCloud

To deploy this application to OpenSourceCloud:

1. Ensure your `google-credentials.json` is properly configured
2. Set environment variables in your OpenSourceCloud dashboard
3. Deploy using your preferred method (Docker, direct upload, etc.)
4. Make sure the PORT environment variable is set correctly

## Troubleshooting

### Translation API Error
- Verify your Google Cloud credentials are correct
- Ensure Translation API is enabled in Google Cloud Console
- Check that your service account has proper permissions

### History Not Saving
- Check write permissions in the project directory
- Verify the application has permission to create `translations-history.json`

### Port Already in Use
- Change the PORT in `.env` to a different value
- Stop any other applications using port 3000

## License

MIT

## Contributing

Feel free to submit issues and enhancement requests!
