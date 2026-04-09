'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { usePlayer } from '@/components/PlayerContext';
import { resolveAudioUrl } from '@/lib/audio/resolveAudioUrl';
import { safePlay } from '@/lib/audio/safePlay';
import { AUDIO_UI_MESSAGES } from '@/lib/audio/messages';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function PersistentPlayer() {
  const { isPlaying, currentTrack, togglePlay, nextTrack, prevTrack } = usePlayer() as any;
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const recognitionRef = useRef<any>(null);

  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [botStatus, setBotStatus] = useState<string>('');
  const [playbackStatus, setPlaybackStatus] = useState<string>('');

  const handleVoiceCommand = useCallback((command: string) => {
    setBotStatus(`Cmd: "${command}"`);
    setTimeout(() => setBotStatus(''), 2000); 

    if (command.includes('play') || command.includes('start')) {
      if (!isPlaying) togglePlay();
    } 
    else if (command.includes('pause') || command.includes('stop')) {
      if (isPlaying) togglePlay();
    } 
    else if (command.includes('next') || command.includes('skip')) {
      if (nextTrack) nextTrack();
    }
    else if (command.includes('back') || command.includes('previous')) {
      if (prevTrack) prevTrack();
    }
    else if (command.includes('mute')) setIsMuted(true);
    else if (command.includes('unmute')) setIsMuted(false);
    else if (command.includes('volume max')) { setVolume(1.0); setIsMuted(false); }
    else if (command.includes('volume low')) { setVolume(0.2); setIsMuted(false); }
  }, [isPlaying, togglePlay, nextTrack, prevTrack]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition && !recognitionRef.current) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true; 
      recognition.lang = 'en-US';
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
        console.log("🎤 Voice Command:", transcript);
        handleVoiceCommand(transcript);
      };

      recognition.onerror = (event: any) => {
        if (event.error === 'not-allowed') {
          setIsListening(false);
          setBotStatus('Mic Blocked');
        }
      };

      recognition.onend = () => {
        if (isListening) {
          try { recognition.start(); } catch (e) { }
        }
      };

      recognitionRef.current = recognition;
    }
  }, [handleVoiceCommand, isListening]);

  useEffect(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (isListening) {
      try { recognition.start(); } catch (e) { /**/ }
      setBotStatus('Listening...');
    } else {
      recognition.stop();
      setBotStatus('');
    }

    return () => { recognition.stop(); };
  }, [isListening]);

  const toggleVoiceControl = () => {
    if (!recognitionRef.current) {
      alert("Voice control is not supported in this browser (Use Chrome).");
      return;
    }
    setIsListening(!isListening);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      safePlay(audio, 'PersistentPlayer', {
        track: currentTrack?.title,
        url: currentTrack?.url,
      }).then((result) => {
        if (!result.ok) {
          setPlaybackStatus(AUDIO_UI_MESSAGES.playbackBlocked);
          setTimeout(() => setPlaybackStatus(''), 2500);
        }
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 h-24 flex items-center justify-between gap-4 relative">
      {isListening && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500/90 text-black text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg z-50 animate-pulse">
          {botStatus}
        </div>
      )}
      {playbackStatus && (
        <div className="absolute -top-4 right-4 bg-red-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg z-50">
          {playbackStatus}
        </div>
      )}
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-amber-500 font-bold tracking-widest text-xs uppercase">Now Streaming</span>
          <div className={`flex items-end gap-[2px] h-3 ${isPlaying ? 'animate-pulse' : 'opacity-50'}`}>
            <div className={`w-1 bg-amber-500 rounded-t-sm ${isPlaying ? 'h-3' : 'h-1'} transition-all duration-300`}></div>
            <div className={`w-1 bg-amber-500 rounded-t-sm ${isPlaying ? 'h-4' : 'h-2'} transition-all duration-500`}></div>
            <div className={`w-1 bg-amber-500 rounded-t-sm ${isPlaying ? 'h-2' : 'h-1'} transition-all duration-200`}></div>
          </div>
        </div>
        <div>
          <span className="text-lg text-white font-medium truncate block">{currentTrack?.title || 'Live Stream'}</span>
          <p className="text-sm text-neutral-400 truncate">{currentTrack?.artist || 'G Putnam Music'}</p>
        </div>
      </div>
      <div className="flex-none flex items-center gap-4">
        <button onClick={toggleVoiceControl} className={`p-3 rounded-full transition-all duration-300 ${isListening ? 'bg-red-500/20 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'}`}>
          {isListening ? (
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" /><path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5zM19.5 10.5a.75.75 0 00-1.5 0v1.5a6.75 6.75 0 01-13.5 0v-1.5a.75.75 0 00-1.5 0v1.5a8.25 8.25 0 005.174 7.653 2.25 2.25 0 105.152 0A8.25 8.25 0 0019.5 12v-1.5z" /></svg>
          )}
        </button>
        <button onClick={togglePlay} className="h-14 w-14 flex items-center justify-center rounded-full bg-amber-500 hover:bg-amber-400 text-black transition-all hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/20">
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 ml-1"><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" /></svg>
          )}
        </button>
      </div>
      <div className="flex-1 flex justify-end items-center gap-3 min-w-0">
        <button onClick={() => setIsMuted(!isMuted)} className="text-gray-400 hover:text-white">{isMuted || volume === 0 ? "🔇" : "🔊"}</button>
        <input type="range" min="0" max="1" step="0.01" value={isMuted ? 0 : volume} onChange={(e) => { setVolume(parseFloat(e.target.value)); setIsMuted(false); }} className="w-24 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500" />
      </div>
      <audio ref={audioRef} src={currentTrack?.url ? (resolveAudioUrl(currentTrack.url) || undefined) : undefined} preload="metadata" crossOrigin="anonymous" onEnded={nextTrack} />
    </div>
  );
}
