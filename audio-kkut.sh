#!/bin/bash

normalize_input() {
	local value="$1"
	value="${value#\"}"
	value="${value%\"}"
	value="${value#\'}"
	value="${value%\'}"
	printf '%s' "$value"
}

echo "=========================================="
echo " GPM SOVEREIGN: PURE AUDIO K-KUT EXTRACTOR"
echo "=========================================="
echo ""

echo "1. Drag the SONG FILE here and hit ENTER:"
read -r raw_file
FILE=$(normalize_input "$raw_file")

echo "2. Type the START TIME (e.g., 01:15 or 75 for seconds) and hit ENTER:"
read -r START

echo "3. Type the DURATION in seconds (e.g., 30) and hit ENTER:"
read -r DURATION

echo ""
echo "✂️ EXTRACTING K-KUT..."

# The Bulldozer: Strips video/art (-vn), sets 320kbps high-fidelity, and cuts the exact timeframe
ffmpeg -y -i "$FILE" -ss "$START" -t "$DURATION" -vn -c:a libmp3lame -b:a 320k "${FILE%.*}_K-KUT.mp3" -loglevel error

echo "✅ K-KUT SECURED: Look for the file ending in _K-KUT.mp3 in the same folder as the original."
