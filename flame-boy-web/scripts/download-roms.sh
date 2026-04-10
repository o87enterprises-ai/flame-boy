#!/bin/bash
# Script to download open source Game Boy ROMs
# Run this from the flame-boy-web directory

ROMS_DIR="public/roms"

# Create ROMs directory if it doesn't exist
mkdir -p "$ROMS_DIR"

echo "Downloading open source Game Boy ROMs..."

# Tobu Tobu Girl
echo "Downloading Tobu Tobu Girl..."
curl -L "https://github.com/TangramGames/TobuTobuGirl/releases/download/v1.1.0/TobuTobuGirl.gb" -o "$ROMS_DIR/tobu-tobu-girl.gb" 2>/dev/null || {
  echo "  ⚠️  Failed to download Tobu Tobu Girl - will use placeholder"
}

# Petris
echo "Downloading Petris..."
curl -L "https://github.com/bbbbbr/petris/releases/latest/download/petris.gb" -o "$ROMS_DIR/petris.gb" 2>/dev/null || {
  echo "  ⚠️  Failed to download Petris - will use placeholder"
}

# GB Wordle
echo "Downloading GB Wordle..."
curl -L "https://github.com/chrismaltby/gb-wordle/releases/latest/download/gb-wordle.gb" -o "$ROMS_DIR/gb-wordle.gb" 2>/dev/null || {
  echo "  ⚠️  Failed to download GB Wordle - will use placeholder"
}

echo ""
echo "Download complete! Checking ROMs..."
echo ""

# List downloaded ROMs
if [ -d "$ROMS_DIR" ]; then
  count=$(find "$ROMS_DIR" -name "*.gb" -o -name "*.gbc" | wc -l | tr -d ' ')
  echo "✓ Found $count ROM file(s) in $ROMS_DIR"
  
  # Show file sizes
  find "$ROMS_DIR" -name "*.gb" -o -name "*.gbc" | while read file; do
    size=$(ls -lh "$file" | awk '{print $5}')
    name=$(basename "$file")
    echo "  📦 $name ($size)"
  done
else
  echo "❌ ROMs directory not found"
fi

echo ""
echo "Note: Games without downloaded ROMs will show an error when launched."
echo "You can manually place .gb/.gbc files in the $ROMS_DIR directory."
echo ""
echo "Done!"
