# RetroBoy - Game Boy Emulator for Android

A mobile Android Game Boy emulator app with support for classic games and homebrew ROMs.

## Features

### 🎮 Classic Games Library
Includes information for 10 classic Game Boy titles:
- **Pokémon Red/Blue** (1996) - ~46 million copies
- **Tetris** (1989) - 35+ million copies
- **The Legend of Zelda: Link's Awakening** (1993)
- **Metroid II: Return of Samus** (1991)
- **Super Mario Land** (1989)
- **Kirby's Dream Land** (1992)
- **Wario Land: Super Mario Land 3** (1994)
- **Final Fantasy Adventure** (1991)
- **Donkey Kong** (1994)
- **Dr. Mario** (1990)

### 🏠 Homebrew Games Support
Support for 5 free homebrew games:
- **Tobu Tobu Girl** - Fast-paced action game
- **Petris** - Tetris-like puzzle game with pets
- **GB Wordle** - Word guessing game
- **Flappy Boy** - Flappy Bird clone
- **GB Snake** - Classic Snake game

### 🎯 Emulator Features
- Touch-optimized D-Pad and A/B buttons
- Start/Select buttons
- Save state functionality (9 slots per game)
- Auto-save every 10 minutes
- Screen filter options (None, Scanlines, CRT, GB Classic)
- FPS counter display
- Vibration feedback (haptic)
- Sound emulation support

### ⚙️ Settings
- Sound toggle
- Vibration toggle
- Auto-save toggle
- FPS counter toggle
- Screen filter selection

## Building the App

### Prerequisites
- Android Studio Arctic Fox or later
- JDK 11 or later
- Android SDK 34
- Minimum SDK: 24 (Android 7.0)

### Build Instructions

1. **Clone or open the project** in Android Studio

2. **Sync Gradle files**
   ```
   File → Sync Project with Gradle Files
   ```

3. **Build the project**
   ```bash
   ./gradlew assembleDebug
   ```

4. **Install on device**
   ```bash
   ./gradlew installDebug
   ```

### Build Variants
- `assembleDebug` - Debug build with logging
- `assembleRelease` - Release build for distribution

## Project Structure

```
flame-boy/
├── app/
│   ├── src/main/
│   │   ├── java/com/retroboy/emulator/
│   │   │   ├── MainActivity.kt          # Main menu activity
│   │   │   ├── EmulatorActivity.kt      # Emulator with controls
│   │   │   ├── GameLibraryActivity.kt   # Game library browser
│   │   │   ├── SettingsActivity.kt      # Settings screen
│   │   │   ├── GamesAdapter.kt          # RecyclerView adapter
│   │   │   └── GameLibrary.kt           # Game data models
│   │   ├── res/
│   │   │   ├── layout/                  # XML layouts
│   │   │   ├── drawable/                # Vector icons
│   │   │   ├── values/                  # Colors, strings, themes
│   │   │   └── xml/                     # File paths config
│   │   └── AndroidManifest.xml
│   └── build.gradle
├── build.gradle
├── settings.gradle
└── gradle.properties
```

## Usage

### Loading Games

1. **From Game Library:**
   - Open the app
   - Tap "Game Library"
   - Select a game
   - Tap "Load ROM" to select your ROM file

2. **Direct Load:**
   - From main menu, tap "Load ROM"
   - Select a .gb or .gbc file from your device

### Controls

| Button | Action |
|--------|--------|
| D-Pad | Directional input |
| A | Confirm/Action |
| B | Cancel/Back |
| START | Start game |
| SELECT | Open library/menu |

### Keyboard Controls (Desktop Testing)
- Arrow Keys = D-Pad
- Z = B button
- X = A button
- Enter = START
- Shift = SELECT

## Legal Notice

⚠️ **Important:** This emulator does not include any game ROMs. Users must provide their own legally obtained ROM files.

- Only use ROMs for games you physically own
- Homebrew games are available from their official sources
- Respect copyright laws in your jurisdiction

## Homebrew ROM Sources

- **Tobu Tobu Girl**: https://github.com/TangramGames/TobuTobuGirl
- **Petris**: https://github.com/bbbbbr/petris
- **GB Wordle**: https://github.com/chrismaltby/gb-wordle

## Technologies Used

- **Language**: Kotlin
- **UI**: Material Design Components
- **Emulation**: WebView-based (WasmBoy compatible)
- **Storage**: Internal storage for ROMs and save states
- **Min SDK**: Android 7.0 (API 24)

## Future Enhancements

- [ ] Integrate WasmBoy WebAssembly core for full emulation
- [ ] Add cheat code support
- [ ] Implement save state sharing
- [ ] Add Bluetooth controller support
- [ ] Cloud save synchronization
- [ ] Achievement system

## License

This project is for educational purposes. Game Boy is a registered trademark of Nintendo.

## Version

**Version 1.0** - Initial release
