# AURA Care - Video Advertisement

A 60-second emotional technology advertisement for AURA Care, created with Remotion.

## 🎬 Video Overview

This video showcases the AURA Care app - an AI-powered digital guardian for senior citizens. The advertisement follows an emotional narrative that highlights the app's key features.

### Scenes (60 seconds total):

1. **Opening (0-6s)**: Elderly parent alone at home - establishing the emotional need
2. **Medication Reminder (6-12s)**: Smart medication reminder on phone
3. **OCR Scan (12-18s)**: Prescription scanned with OCR auto-detection
4. **Voice Assistant (18-23s)**: AI voice assistant interaction
5. **Caregiver Dashboard (23-29s)**: Caregiver dashboard with alerts
6. **Video Call (29-35s)**: Remote video call between parent and daughter
7. **Features (35-43s)**: Clean modern UI with large buttons showcase
8. **Emotional Moment (43-50s)**: Warm lighting and hopeful atmosphere
9. **Outro (50-60s)**: Logo and tagline - "Intelligent Support for Independent Living"

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or bun

### Installation

```bash
cd video
npm install
```

### Development

Start the Remotion Studio to preview and edit the video:

```bash
npm start
```

This opens the Remotion Studio at `http://localhost:3000` where you can:
- Preview all scenes
- Adjust timing and animations
- Debug compositions
- Export individual frames

### Rendering

Render the final video:

```bash
npm run build
```

Or:

```bash
npm run render
```

Output will be saved to `out/aura-care-ad.mp4`

## 🎨 Customization

### Video Settings
Edit `src/Root.tsx` to change:
- Resolution (default: 1920x1080)
- Frame rate (default: 30fps)
- Duration (default: 1800 frames / 60 seconds)

### Scene Timing
Edit the `SCENES` object in `src/AuraCareAd.tsx` to adjust scene durations:

```typescript
const SCENES = {
  intro: { start: 0, duration: 180 },      // 0-6s
  medication: { start: 180, duration: 180 }, // 6-12s
  // ... etc
};
```

### Colors
Modify the `COLORS` object to match your brand:

```typescript
const COLORS = {
  primary: "#6366f1",      // Indigo
  secondary: "#f59e0b",    // Amber
  accent: "#10b981",       // Emerald
  // ... etc
};
```

## 📦 Project Structure

```
video/
├── src/
│   ├── index.ts          # Entry point
│   ├── Root.tsx          # Composition definitions
│   └── AuraCareAd.tsx    # Main video with all scenes
├── remotion.config.ts    # Remotion configuration
├── tsconfig.json         # TypeScript config
└── package.json          # Dependencies
```

## 🎯 Features Highlighted

1. **Smart Medication Reminders** - Never miss a dose
2. **OCR Prescription Scanner** - Auto-extract medication details
3. **AI Voice Assistant** - Hindi & English support
4. **Caregiver Dashboard** - Complete visibility
5. **Video Calls** - Stay connected
6. **Health Analytics** - Track wellness trends
7. **Bilingual Support** - Hindi & English

## 📝 Video Style

- **Cinematic** quality
- **Soft background music** (add your own audio track)
- **Modern minimal UI** overlays
- **Professional healthcare** technology aesthetic
- **Warm lighting** and hopeful atmosphere
- **Emotional but futuristic** tone

## 🎵 Adding Audio

To add background music or voiceover:

1. Place audio file in `public/` folder
2. Import and use in `AuraCareAd.tsx`:

```typescript
import { Audio } from "remotion";

// In your component:
<Audio src="/background-music.mp3" />
```

## 📄 License

© 2026 AURA Care. Made with ❤️ for India's elderly.