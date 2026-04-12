#!/bin/bash

FILE="$1"
OUT="${FILE%.*}_GPM_BRANDED.mp4"
LOGO="$(cd "$(dirname "$0")" && pwd)/gpm_logo.png"

if ffmpeg -hide_banner -filters 2>/dev/null | grep -q " drawtext "; then
	ffmpeg -y -i "$FILE" -t 15 -vf "drawtext=text='G PUTNAM MUSIC':fontcolor='#FFBF00':fontsize=24:x=(w-text_w)/2:y=H-60,drawtext=text='IN-PIX / I-K-KUT':fontcolor='#F5DEB3':fontsize=18:x=(w-text_w)/2:y=H-30" -c:v libx264 -c:a aac "$OUT"
elif [[ -f "$LOGO" ]]; then
	ffmpeg -y -i "$FILE" -i "$LOGO" -t 15 -filter_complex "[1:v]scale=220:-1[wm];[0:v][wm]overlay=W-w-24:H-h-24" -c:v libx264 -c:a aac "$OUT"
else
	ffmpeg -y -i "$FILE" -t 15 -c:v libx264 -c:a aac "$OUT"
fi
