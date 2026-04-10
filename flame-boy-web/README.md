# FlameBoy Web - Free Open Source Game Boy Emulator 🎮

A React-based web version of the FlameBoy Game Boy emulator with a built-in library of **free, open source games**. No ROM downloads required - all games are legally available and bundled!

## ✨ Features

### 📚 Built-in Game Library
- **12+ open source games** ready to play instantly
- Search and filter by genre
- Featured games section
- Game details with descriptions and ratings
- No copyright issues - all games are free

### 🕹️ Full Emulator Features
- **WasmBoy WebAssembly core** for accurate Game Boy emulation
- Touch-optimized controls for mobile
- Keyboard controls for desktop
- Save states (auto-save every 10 minutes)
- Screen filters (None, Scanlines, CRT, GB Classic)
- FPS counter
- Sound support

### 🎮 Controls

**On-Screen:**
- D-Pad for movement
- A/B action buttons
- START/SELECT buttons

**Keyboard:**
- Arrow Keys = D-Pad
- Z = B button
- X = A button
- Enter = START
- Shift = SELECT

## 🚀 Quick Start

### Development

```bash
cd flame-boy-web
npm install
npm run dev
```

This starts a development server at `http://localhost:3000`

### Download Open Source ROMs

```bash
npm run download-roms
```

This script downloads freely available homebrew ROMs from their official GitHub repositories.

### Production Build

```bash
npm run build
```

Built files will be in the `dist/` directory.

## 🌐 Deployment

The app is configured for easy deployment to:

### Vercel
```bash
vercel deploy
```

### Netlify
```bash
netlify deploy --prod
```

### Static Hosting
Just serve the `dist/` folder with any static file server:
```bash
npm run preview
# or
npx serve dist
```

## 📦 Project Structure

```
flame-boy-web/
├── public/
│   └── roms/                  # Bundled game ROMs
├── src/
│   ├── components/
│   │   ├── Emulator.jsx       # Main emulator with WasmBoy
│   │   ├── GameLibrary.jsx    # Game browser with search/filter
│   │   ├── GameDetails.jsx    # Game info page
│   │   ├── MainMenu.jsx       # Home screen
│   │   └── Settings.jsx       # User settings
│   ├── data/
│   │   └── games.js           # Game metadata library
│   ├── utils/
│   │   └── emulator.js        # WasmBoy integration utility
│   ├── App.jsx                # Main app router
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles
├── scripts/
│   └── download-roms.sh       # ROM download script
├── vercel.json                # Vercel deployment config
├── netlify.toml               # Netlify deployment config
└── package.json
```

## 🎮 Included Games

All games are **100% free and open source**:

| Game | Genre | Developer |
|------|-------|-----------|
| Tobu Tobu Girl | Action/Platformer | Tangram Games |
| Petris | Puzzle | bbbr |
| GB Wordle | Puzzle/Word | chrismaltby |
| GB Snake | Arcade/Classic | Community |
| Flappy Boy | Arcade/Casual | Community |
| Mini Dungeon | RPG/Adventure | Community |
| Brick Breaker | Arcade/Action | Community |
| Space Defenders | Action/Shooter | Community |
| And more... | | |

## 🔧 Adding New Games

To add a new open source game to the library:

1. Add game metadata to `src/data/games.js`
2. Place the `.gb` or `.gbc` ROM file in `public/roms/`
3. That's it! The game will appear in the library automatically

Example entry:
```javascript
{
  id: 'my-game',
  name: 'My Game',
  slug: 'my-game',
  genre: ['Action'],
  year: 2024,
  developer: 'Developer Name',
  description: 'Game description...',
  romPath: '/roms/my-game.gb',
  icon: '🎮',
  color: '#ff6b6b',
  featured: false,
  rating: 4.0
}
```

## 🎨 Color Palette

The app uses the classic Game Boy color scheme:
- Dark Green: `#0f380f`
- Medium Dark: `#306230`
- Medium Light: `#8bac0f`
- Light Green: `#9bbc0f`

## 📱 Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

Works on both desktop and mobile devices!

## 📄 License

This project is for educational purposes. All bundled games are open source and freely available.

Game Boy is a registered trademark of Nintendo. This project is not affiliated with or endorsed by Nintendo.

## 🆕 What's New in v2.0

- ✅ **WasmBoy integration** - Real Game Boy emulation!
- ✅ **Built-in game library** - 12+ free games ready to play
- ✅ **Game details page** - Descriptions, ratings, controls info
- ✅ **Search & filtering** - Find games by name, genre, or developer
- ✅ **Featured games** - Curated highlights
- ✅ **One-click play** - No ROM downloads needed
- ✅ **Deployment configs** - Vercel & Netlify ready
- ✅ **ROM download script** - Fetch open source games automatically

## 🔗 Resources

- [WasmBoy GitHub](https://github.com/torch2424/wasmBoy)
- [Homebrew Game Sources](https://github.com/TangramGames/TobuTobuGirl)
- [GBJam Community](https://gbjam.wordpress.com/)

## Version

**Version 2.0** - Open Source Games Library Edition
