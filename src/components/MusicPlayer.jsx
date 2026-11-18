import React, { useState, useRef, useEffect } from 'react';
import { Music, VolumeX, Sparkles } from 'lucide-react';
import { siteConfig } from '../config';

// Helper: Extract YouTube 11-char Video ID
function extractYouTubeId(urlOrId) {
  if (!urlOrId || typeof urlOrId !== 'string') return null;
  const trimmed = urlOrId.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const match = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

export function MusicPlayer({ musicSettings }) {
  const isEnabled = musicSettings?.enabled ?? true;
  const [isPlaying, setIsPlaying] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState(musicSettings?.youtubeUrl || siteConfig.music?.youtubeUrl || '');
  const [isYtReady, setIsYtReady] = useState(false);

  const ytPlayerRef = useRef(null);
  const audioRef = useRef(null);
  const removeListenersRef = useRef(null);

  const defaultVolume = musicSettings?.defaultVolume ?? siteConfig.music?.defaultVolume ?? 0.4;
  const audioSrc = siteConfig.music?.src || '/music/bg.mp3';

  // Sync with musicSettings prop
  useEffect(() => {
    if (musicSettings?.youtubeUrl) {
      setYoutubeUrl(musicSettings.youtubeUrl);
    }
  }, [musicSettings]);

  // 1. Fetch current background music from Backend API (/api/music)
  useEffect(() => {
    async function fetchBackendMusic() {
      try {
        const res = await fetch('/api/music');
        if (res.ok) {
          const data = await res.json();
          if (data.youtubeUrl) {
            setYoutubeUrl(data.youtubeUrl);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch music from backend, falling back to config:', err);
      }
    }
    fetchBackendMusic();
  }, []);

  // 2. Initialize YouTube Iframe Player
  useEffect(() => {
    const videoId = extractYouTubeId(youtubeUrl);
    if (!videoId) return;

    let destroyed = false;

    // Load YouTube IFrame API script if not present
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      if (destroyed || !window.YT || !window.YT.Player) return;

      try {
        if (ytPlayerRef.current && ytPlayerRef.current.destroy) {
          ytPlayerRef.current.destroy();
        }

        ytPlayerRef.current = new window.YT.Player('pattan-yt-player', {
          height: '1',
          width: '1',
          videoId: videoId,
          playerVars: {
            autoplay: 1,
            controls: 0,
            loop: 1,
            playlist: videoId,
            playsinline: 1,
            origin: window.location.origin,
          },
          events: {
            onReady: (event) => {
              if (destroyed) return;
              try {
                event.target.setVolume(Math.round(defaultVolume * 100));
                setIsYtReady(true);
                // Attempt direct autoplay on ready
                event.target.playVideo();
              } catch (e) {
                console.warn('Autoplay on ready blocked:', e);
              }
            },
            onStateChange: (event) => {
              if (destroyed) return;
              // 1 = PLAYING, 2 = PAUSED, 0 = ENDED
              if (event.data === 1) {
                setIsPlaying(true);
                if (removeListenersRef.current) {
                  removeListenersRef.current();
                  removeListenersRef.current = null;
                }
              } else if (event.data === 2 || event.data === 0) {
                setIsPlaying(false);
              }
            },
            onError: (err) => {
              console.warn('YouTube Player Error:', err);
              setIsPlaying(false);
            },
          },
        });
      } catch (e) {
        console.warn('Error initializing YouTube player:', e);
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      destroyed = true;
      if (ytPlayerRef.current && ytPlayerRef.current.destroy) {
        try {
          ytPlayerRef.current.destroy();
        } catch (e) {}
      }
    };
  }, [youtubeUrl, defaultVolume]);

  // 3. Fallback HTML5 Audio for local MP3
  useEffect(() => {
    const audio = new Audio();
    audio.src = audioSrc;
    audio.loop = true;
    audio.volume = defaultVolume;

    audio.onerror = () => {
      // Ignore if using YouTube
    };

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [audioSrc, defaultVolume]);

  // 4. Reliable Autoplay on mount + User first-interaction fallback (for browser autoplay policies)
  useEffect(() => {
    const attemptAutoPlay = (isUserGesture = false) => {
      const videoId = extractYouTubeId(youtubeUrl);
      if (
        videoId &&
        ytPlayerRef.current &&
        typeof ytPlayerRef.current.playVideo === 'function'
      ) {
        try {
          if (isUserGesture) {
            if (typeof ytPlayerRef.current.unMute === 'function') {
              ytPlayerRef.current.unMute();
            }
            ytPlayerRef.current.setVolume(Math.round(defaultVolume * 100));
          }
          ytPlayerRef.current.playVideo();
        } catch (e) {
          // Browser policy blocked, will retry on user gesture
        }
      } else if (audioRef.current) {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            if (removeListenersRef.current) {
              removeListenersRef.current();
              removeListenersRef.current = null;
            }
          })
          .catch(() => {
            // Browser blocked, will retry on user gesture
          });
      }
    };

    const handleFirstInteraction = () => {
      attemptAutoPlay(true);
    };

    const removeListeners = () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('scroll', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
    removeListenersRef.current = removeListeners;

    // Attach interaction listeners for mobile/desktop first touch/scroll/click
    window.addEventListener('click', handleFirstInteraction, { passive: true });
    window.addEventListener('touchstart', handleFirstInteraction, { passive: true });
    window.addEventListener('pointerdown', handleFirstInteraction, { passive: true });
    window.addEventListener('scroll', handleFirstInteraction, { passive: true });
    window.addEventListener('keydown', handleFirstInteraction, { passive: true });

    // Attempt direct autoplay on load
    attemptAutoPlay(false);
    const timer = setTimeout(() => attemptAutoPlay(false), 800);

    return () => {
      clearTimeout(timer);
      removeListeners();
    };
  }, [youtubeUrl, defaultVolume]);

  // Toggle Play / Pause
  const togglePlay = async () => {
    const videoId = extractYouTubeId(youtubeUrl);

    // Case A: Play via YouTube Player
    if (videoId && ytPlayerRef.current) {
      try {
        if (isPlaying) {
          ytPlayerRef.current.pauseVideo();
          setIsPlaying(false);
        } else {
          if (typeof ytPlayerRef.current.unMute === 'function') {
            ytPlayerRef.current.unMute();
          }
          ytPlayerRef.current.setVolume(Math.round(defaultVolume * 100));
          ytPlayerRef.current.playVideo();
          setIsPlaying(true);
          showToast('กำลังเล่นเพลงพื้นหลังค่ะ 🎵✨');
        }
        return;
      } catch (err) {
        console.warn('YouTube playback failed, trying fallback:', err);
      }
    }

    // Case B: Fallback HTML5 Audio
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
        showToast('กำลังเล่นเพลงพื้นหลังค่ะ 🎵');
      } catch (err) {
        console.warn('Audio play error:', err.message);
        setIsPlaying(false);
      }
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 4500);
  };

  if (!isEnabled) return null;

  return (
    <>
      {/* Hidden YouTube IFrame Container */}
      <div
        className="fixed -left-[9999px] -top-[9999px] w-1 h-1 opacity-0 pointer-events-none"
        aria-hidden="true"
      >
        <div id="pattan-yt-player" />
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-28 sm:bottom-24 right-4 sm:right-6 z-50 max-w-xs p-3.5 rounded-2xl bg-slate-900/90 text-white text-xs backdrop-blur-md shadow-2xl border border-pattan-pink/40 animate-bounce">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pattan-yellow shrink-0" />
            <span className="font-medium">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Floating Music Controls Container */}
      <div className="fixed bottom-24 sm:bottom-6 right-4 sm:right-6 z-40 flex items-center group">
        {/* Main Floating Play/Pause Button */}
        <button
          onClick={togglePlay}
          type="button"
          className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-jelly border-2 transition-all duration-300 active:scale-90 focus:outline-none focus:ring-4 focus:ring-pattan-blue/30 ${
            isPlaying
              ? 'bg-gradient-to-tr from-pattan-pink to-[#FFA3C9] border-white text-white shadow-jelly-pink scale-105'
              : 'bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-pattan-blue/30 text-pattan-blue dark:text-pattan-blue-light hover:scale-105'
          }`}
          aria-label={isPlaying ? 'ปิดเสียงเพลงพื้นหลัง' : 'เปิดเสียงเพลงพื้นหลัง'}
          title={isPlaying ? 'คลิกเพื่อปิดเพลง' : 'คลิกเพื่อเปิดเพลงพื้นหลัง'}
        >
          {/* Animated floating musical notes when playing */}
          {isPlaying && (
            <div className="absolute -top-3.5 -right-2 pointer-events-none select-none text-xs font-bold text-pattan-pink animate-bounce">
              🎵
            </div>
          )}

          {isPlaying ? (
            <div className="relative flex items-center justify-center">
              <Music className="w-5 h-5 sm:w-6 sm:h-6 animate-spin [animation-duration:5s]" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-pattan-yellow animate-ping" />
            </div>
          ) : (
            <VolumeX className="w-5 h-5 sm:w-6 sm:h-6" />
          )}
        </button>
      </div>
    </>
  );
}
