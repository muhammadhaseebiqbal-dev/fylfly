# FylFly

FylFly is a lightweight file-sharing web app built with Next.js.  
Users can drag and drop a file, upload it to GoFile, and instantly get a direct download link they can copy or share on messaging platforms.

## Features

- Drag-and-drop and click-to-select file upload
- Real-time upload progress with status messages
- Direct download link generation after successful upload
- One-click copy to clipboard with fallback behavior
- Quick sharing actions for WhatsApp, Telegram, Signal, and Slack
- Animated success popup and error toast feedback
- Responsive dark-themed UI

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript + React 19
- **Styling:** Tailwind CSS 4 + custom global styles
- **HTTP client:** Axios
- **Icons:** lucide-react + react-icons
- **Animations:** motion

## How It Works

1. User selects or drops a file in the upload area.
2. The app sends the file to `https://upload.gofile.io/uploadfile` using `multipart/form-data`.
3. Upload progress is tracked through Axios progress events.
4. On success, response metadata is used to build a direct download URL:
   - `https://{server}.gofile.io/download/{fileId}/{filename}`
5. The app shows a popup with:
   - Generated direct link
   - Copy button
   - Social-sharing shortcuts

## Project Structure

```text
src/
  app/
    globals.css      # Global styles and theme variables
    layout.tsx       # Root layout, metadata, top nav/logo
    page.tsx         # Main upload UI and client-side logic
```

## Getting Started

### Prerequisites

- Node.js 18+ (recommended LTS)
- npm

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Open `http://localhost:3000`.

## Available Scripts

- `npm run dev` – Start development server
- `npm run build` – Build the production app
- `npm run start` – Run the production server
- `npm run lint` – Run ESLint checks

## Deployment

This project is ready for Vercel deployment.  
`vercel.json` pins deployment region to `iad1`.

## Notes and Limitations

- Uploads are handled by GoFile; this app does not run its own storage backend.
- Maximum upload body/content length in client config is set to **5 GB**.
- Slack shortcut opens Slack but does not prefill a message URL like the other share options.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Run `npm run lint`
5. Open a pull request
