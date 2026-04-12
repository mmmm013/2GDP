#!/bin/bash

FILE="$1"
OUT="${FILE%.*}_BRANDED.mp4"
LOGO="$(cd "$(dirname "$0")" && pwd)/gpm_logo.png"

if ffmpeg -hide_banner -filters 2>/dev/null | grep -q " drawtext "; then
	ffmpeg -y -i "$FILE" -t 47 -vf "drawtext=text='KLEIGH':fontcolor='#A52A2A':fontsize=30:x=20:y=20,drawtext=text='GPM SOVEREIGN EXCERPT':fontcolor='#D2B48C':fontsize=20:x=20:y=60" -c:v libx264 -c:a aac "$OUT"
elif [[ -f "$LOGO" ]]; then
	ffmpeg -y -i "$FILE" -i "$LOGO" -t 47 -filter_complex "[1:v]scale=220:-1[wm];[0:v][wm]overlay=W-w-24:24" -c:v libx264 -c:a aac "$OUT"
else
	ffmpeg -y -i "$FILE" -t 47 -c:v libx264 -c:a aac "$OUT"
fi
