#!/bin/bash
# GPM Sovereign Asset Scissoring Engine
FILE="$1"
BRAND="$2"
LOGO="$(cd "$(dirname "$0")" && pwd)/gpm_logo.png"
# Logic: If user pastes too much, we only take the first letter of the second argument
B_TYPE=${BRAND:0:1}

if [[ "$B_TYPE" == "G" ]]; then
  TEXT="G PUTNAM MUSIC"; SUB="IN-PIX / I-K-KUT"; COLOR="#FFBF00"; SUBCOLOR="#F5DEB3"
elif [[ "$B_TYPE" == "K" ]]; then
  TEXT="KLEIGH"; SUB="GPM SOVEREIGN EXCERPT"; COLOR="#A52A2A"; SUBCOLOR="#D2B48C"
else
  echo "Usage: ./gpm-scissors.sh [FILE] [G or K]"; exit 1
fi

if ffmpeg -hide_banner -filters 2>/dev/null | grep -q " drawtext "; then
  ffmpeg -y -i "$FILE" -t 47 -vf "drawtext=text='$TEXT':fontcolor='$COLOR':fontsize=30:x=20:y=20,drawtext=text='$SUB':fontcolor='$SUBCOLOR':fontsize=20:x=20:y=60" -c:v libx264 -c:a aac "${FILE%.*}_BRANDED.mp4"
elif [[ -f "$LOGO" ]]; then
  ffmpeg -y -i "$FILE" -i "$LOGO" -t 47 -filter_complex "[1:v]scale=220:-1[wm];[0:v][wm]overlay=W-w-24:24" -c:v libx264 -c:a aac "${FILE%.*}_BRANDED.mp4"
else
  ffmpeg -y -i "$FILE" -t 47 -c:v libx264 -c:a aac "${FILE%.*}_BRANDED.mp4"
fi
