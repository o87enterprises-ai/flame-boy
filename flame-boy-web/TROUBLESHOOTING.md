# Troubleshooting Guide

## Game Stuck on Loading Screen

### What Was Fixed:
1. ✅ Added 15-second timeout to prevent infinite loading
2. ✅ Added AudioContext autoplay policy handling
3. ✅ Added detailed console logging to track initialization
4. ✅ Improved error handling and display

### How to Debug:

1. **Open Browser Console** (F12 or Cmd+Option+I on Mac)
   
2. **Look for these log messages:**
   ```
   [Emulator] Starting initialization...
   [Emulator] Setting canvas...
   [Emulator] Configuring WasmBoy...
   [Emulator] Attempting to resume AudioContext...
   [Emulator] Initialization complete!
   [Emulator] Loading ROM...
   [Emulator] ROM buffer size: XXXXX bytes
   [Emulator] ROM loaded successfully!
   [Emulator] Starting emulation...
   [Emulator] Emulation started!
   ```

3. **Common Issues:**

   **Issue: "Failed to fetch ROM" error**
   - **Cause:** ROM file doesn't exist at the specified URL
   - **Fix:** Check that the ROM file exists in `public/roms/` folder
   
   **Issue: "Emulation timed out" error**
   - **Cause:** WasmBoy initialization hanging (rare)
   - **Fix:** Refresh the page and try again
   
   **Issue: AudioContext warning (yellow warning, not error)**
   - **Cause:** Browser blocking audio without user interaction
   - **Fix:** This is NORMAL - audio will work when you click/tap the screen
   
   **Issue: "Invalid ROM data format" error**
   - **Cause:** ROM data not loading correctly
   - **Fix:** Check ROM file is valid .gb or .gbc file

### Quick Fixes:

**Fix 1: Download the ROMs**
```bash
cd flame-boy-web
npm run download-roms
```

**Fix 2: Check if ROMs are in the right place**
```bash
ls -lh public/roms/
```
You should see .gb files there.

**Fix 3: Manually add a test ROM**
1. Download a free homebrew game (e.g., Tobu Tobu Girl)
2. Place it in `public/roms/tobu-tobu-girl.gb`
3. Restart dev server
4. Try loading the game again

**Fix 4: Check browser compatibility**
- Works best in Chrome/Edge
- Firefox may have stricter autoplay policies
- Safari requires user interaction for audio

### Testing if Emulator Works:

1. Start dev server: `npm run dev`
2. Open http://localhost:3000
3. Go to Game Library
4. Click on any game card
5. Click "Play Now"
6. Watch the console for logs
7. If it loads successfully, you'll see the game screen

### Still Not Working?

**Check these in order:**

1. ✅ Is the dev server running? (`npm run dev`)
2. ✅ Are there any errors in the console? (look for red errors)
3. ✅ Did the build complete successfully? (check for "✓ built in X.XXs")
4. ✅ Are ROM files present? (`ls public/roms/`)
5. ✅ Is your browser supported? (Chrome/Edge recommended)
6. ✅ Try a hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
7. ✅ Try clearing browser cache and reloading

### Audio Not Working:

The AudioContext warning is **completely normal** and won't prevent the game from running. Sound will work once you interact with the page (click or tap).

### Game Shows But No Emulation:

This means the ROM loaded but WasmBoy isn't rendering. Check:
- Canvas element exists and is visible
- No JavaScript errors in console
- WasmBoy initialized successfully (look for "Initialization complete!" log)

### Performance Issues:

If games run slowly:
1. Close other browser tabs
2. Check FPS counter (enable in Settings)
3. Try disabling screen filters
4. Use Chrome/Edge (best performance)
