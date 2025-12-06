# intelliRDB - Personal Radio Database

A vintage CRT-style personal radio database featuring a retro 1990s terminal aesthetic with modern functionality. Stream your favorite radio stations with a nostalgic interface.

## Features

- **Vintage CRT Aesthetic**: Complete retro terminal styling with scanlines, flicker effects, and monochrome palette
- **Radio Database**: Curated collection of international radio stations
- **Firebase Analytics**: Track play counts for your favorite stations
- **Playlist Export**: Download your radio stations as `.pls` format
- **Retro Desktop Interface**: Iconic desktop icons with modal dialogs
- **Responsive Design**: Works on desktop and mobile devices

## Technologies

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom CRT effects
- **Animation**: Framer Motion
- **Analytics**: Firebase Realtime Database
- **Font**: Pixel Operator (monospace terminal font)

## Desktop Icons

- **Radio**: Browse and stream radio stations with play controls
- **Assets**: View additional media and resources
- **Watch**: Real-time digital clock display
- **Coinflip**: Random coin flip utility

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd intellirdb

# Install dependencies
npm install

# Setup environment variables
# Create a .env.local file with your Firebase configuration
```

### Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_database_url
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Deployment

### Vercel Deployment (Recommended)

Vercel is the official hosting platform for Next.js and provides the best experience for intelliRDB.

#### Steps:

1. **Prepare your repository**:
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub account
   - Import your repository
   - Vercel will auto-detect Next.js configuration

3. **Configure Environment Variables**:
   - In Vercel dashboard, go to Project Settings → Environment Variables
   - Add all Firebase credentials from `.env.local.example`:
     - `NEXT_PUBLIC_FIREBASE_API_KEY`
     - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
     - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
     - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
     - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
     - `NEXT_PUBLIC_FIREBASE_APP_ID`
     - `NEXT_PUBLIC_FIREBASE_DATABASE_URL`

4. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy automatically
   - Get your live URL

#### Using Vercel CLI:

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to your Vercel account
vercel login

# Deploy project
vercel

# Set environment variables via CLI
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
# ... (repeat for all env vars)
```

### Docker Deployment

```bash
# Build Docker image
docker build -t intellirdb .

# Run container
docker run -p 3000:3000 -e NEXT_PUBLIC_FIREBASE_API_KEY=... intellirdb
```

### Self-Hosted Deployment

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Start the server**:
   ```bash
   npm start
   ```

3. **Setup reverse proxy** (nginx example):
   ```nginx
   server {
     listen 80;
     server_name your-domain.com;
     
     location / {
       proxy_pass http://localhost:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_cache_bypass $http_upgrade;
     }
   }
   ```

## Performance & Optimization

- **Image Optimization**: All external images use Next.js Image component
- **Code Splitting**: Automatic code splitting with Next.js App Router
- **CRT Effects**: Hardware-accelerated CSS animations for authentic retro feel
- **Radio Streaming**: Direct stream URLs with CORS support

## Firebase Setup

### Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a new project"
3. Enable "Realtime Database"
4. Get your configuration from Project Settings
5. Copy credentials to `.env.local`

### Database Rules (Optional)

For public read/write (development only):

```json
{
  "rules": {
    "plays": {
      ".read": true,
      ".write": true
    }
  }
}
```

For production security:

```json
{
  "rules": {
    "plays": {
      ".read": true,
      ".write": "auth !== null"
    }
  }
}
```

## Troubleshooting

### Firebase not initializing
- Verify all environment variables are set correctly
- Check Firebase project credentials
- Ensure database URL includes `https://` protocol

### Radio stations not playing
- Verify CORS headers are enabled on stream URLs
- Check browser console for CORS errors
- Some streams may require VPN (like Moving 92.5)

### Build errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node.js version matches requirements



## Project Structure

```
intellirdb/
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout with metadata
│   │   ├── page.tsx         # Main page component
│   │   └── globals.css      # Global styles and CRT effects
│   ├── components/
│   │   ├── Navigation.tsx    # Top navigation bar
│   │   ├── DesktopIcons.tsx # Desktop icon grid
│   │   ├── Dialog.tsx        # Modal dialogs for each icon
│   │   └── Helper.tsx        # Help bubble component
│   └── data/
│       └── radio.json        # Radio station database
├── public/
└── package.json
```

## Radio Stations

The radio database includes international stations:
- BBC World Service
- Capital FM (UK and Uganda)
- Heart FM (Multiple decades)
- K105 Kampala
- And many more...

Special notes are included for stations requiring VPN access.

## Keyboard Shortcuts

- `Esc`: Close dialog
- Click desktop icons to open applications

## Contributing

This is a personal project but feel free to fork and customize for your needs.

## License

MIT License

## Credits

- Vintage aesthetic inspired by 1990s terminal interfaces
- Radio streaming via various international broadcast services
- Built with Next.js and Tailwind CSS

## Support

For issues, feature requests, or general questions, please open an issue in the repository.
