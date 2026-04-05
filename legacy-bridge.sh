#!/bin/bash
IMAGE="$1"
VOICE="/Users/gregoryputnam/gputnam-music-final-site/New Recording 85.m4a"
S1="/Users/gregoryputnam/gputnam-music-final-site/public/pix/kleigh--reflections.mp3"
S2="/Users/gregoryputnam/gputnam-music-final-site/public/pix/bought-into-your-game.mp3"

if [ -z "$IMAGE" ]; then
    echo "❌ ERROR: You must drag the photo into the command."
    exit 1
fi

echo "Step 1: Creating visual from $IMAGE..."
ffmpeg -y -loop 1 -i "$IMAGE" -t 60 -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2" -c:v libx264 -pix_fmt yuv420p v_bg.mp4

echo "Step 2: Scissoring the K-KUTs..."
ffmpeg -y -i "$S1" -ss 00:45 -t 30 -vn -acodec pcm_s16le m1.wav
ffmpeg -y -i "$S2" -ss 03:15 -t 30 -vn -acodec pcm_s16le m2.wav

echo "Step 3: Mixing your voice over the tracks..."
ffmpeg -y -i m1.wav -i m2.wav -i "$VOICE" -filter_complex "[0:a][1:a]concat=n=2:v=0:a=1[bg];[bg]volume=0.2[lowbg];[2:a]volume=1.5[v];[lowbg][v]amix=inputs=2:duration=longest" l_audio.wav

echo "Step 4: Final Assembly..."
ffmpeg -y -i v_bg.mp4 -i l_audio.wav -c:v copy -c:a aac -shortest The_Grandpa_Bridge.mp4
echo "🚀 SUCCESS: Open The_Grandpa_Bridge.mp4"
