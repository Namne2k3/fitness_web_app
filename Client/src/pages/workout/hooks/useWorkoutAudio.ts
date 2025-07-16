import { useState, useCallback, useRef, useEffect } from 'react';
import { UseWorkoutAudioReturn, AudioConfig, SoundType } from '../types/workoutSession.types';

/**
 * Custom hook for managing workout audio functionality
 */
export const useWorkoutAudio = (): UseWorkoutAudioReturn => {
  // Audio configuration
  const [config, setConfig] = useState<AudioConfig>({
    soundEnabled: true,
    volume: 0.5,
    sounds: {
      start: '/sounds/start.mp3',
      complete: '/sounds/complete.mp3',
      rest: '/sounds/rest.mp3',
      warning: '/sounds/warning.mp3',
    },
  });

  // Audio states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState<string | null>(null);

  // Audio refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const soundCache = useRef<Map<string, HTMLAudioElement>>(new Map());

  /**
   * Initialize audio elements and cache them
   */
  useEffect(() => {
    // Preload all sounds
    Object.entries(config.sounds).forEach(([key, url]) => {
      const audio = new Audio(url);
      audio.preload = 'auto';
      audio.volume = config.volume;
      soundCache.current.set(key, audio);
    });

    // Cleanup on unmount
    return () => {
      soundCache.current.forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
      });
      soundCache.current.clear();
    };
  }, [config.sounds, config.volume]);

  /**
   * Update volume for all cached sounds
   */
  useEffect(() => {
    soundCache.current.forEach((audio) => {
      audio.volume = config.volume;
    });
  }, [config.volume]);

  /**
   * Play a specific sound
   */
  const playSound = useCallback((soundType: SoundType) => {
    if (!config.soundEnabled) return;

    const audio = soundCache.current.get(soundType);
    if (!audio) {
      console.warn(`Sound not found: ${soundType}`);
      return;
    }

    try {
      // Stop current sound if playing
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      // Set current audio reference
      audioRef.current = audio;
      setCurrentSound(soundType);
      setIsPlaying(true);

      // Reset audio to beginning
      audio.currentTime = 0;

      // Play the sound
      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Sound started playing successfully
            console.log(`Playing sound: ${soundType}`);
          })
          .catch((error) => {
            console.error(`Error playing sound ${soundType}:`, error);
            setIsPlaying(false);
            setCurrentSound(null);
          });
      }

      // Handle sound end
      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentSound(null);
        audio.removeEventListener('ended', handleEnded);
      };

      audio.addEventListener('ended', handleEnded);
    } catch (error) {
      console.error(`Error playing sound ${soundType}:`, error);
      setIsPlaying(false);
      setCurrentSound(null);
    }
  }, [config.soundEnabled]);

  /**
   * Toggle sound on/off
   */
  const toggleSound = useCallback(() => {
    setConfig(prev => ({
      ...prev,
      soundEnabled: !prev.soundEnabled,
    }));

    // Stop current sound if disabling
    if (config.soundEnabled && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentSound(null);
    }
  }, [config.soundEnabled]);

  /**
   * Set volume (0-1)
   */
  const setVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    setConfig(prev => ({
      ...prev,
      volume: clampedVolume,
    }));
  }, []);

  /**
   * Update sound URLs
   */
  const updateSounds = useCallback((newSounds: Partial<AudioConfig['sounds']>) => {
    setConfig(prev => ({
      ...prev,
      sounds: {
        ...prev.sounds,
        ...newSounds,
      },
    }));
  }, []);

  /**
   * Stop current sound
   */
  const stopSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentSound(null);
    }
  }, []);

  /**
   * Check if sound is supported
   */
  const isSoundSupported = useCallback((soundType: SoundType): boolean => {
    return soundCache.current.has(soundType);
  }, []);

  /**
   * Get sound duration
   */
  const getSoundDuration = useCallback((soundType: SoundType): number => {
    const audio = soundCache.current.get(soundType);
    return audio ? audio.duration || 0 : 0;
  }, []);

  /**
   * Convenience methods for specific sounds
   */
  const playStartSound = useCallback(() => playSound('start'), [playSound]);
  const playCompleteSound = useCallback(() => playSound('complete'), [playSound]);
  const playRestSound = useCallback(() => playSound('rest'), [playSound]);
  const playWarningSound = useCallback(() => playSound('warning'), [playSound]);

  /**
   * Handle workout events with appropriate sounds
   */
  const handleWorkoutEvent = useCallback((eventType: string) => {
    switch (eventType) {
      case 'workout-start':
      case 'exercise-start':
        playStartSound();
        break;
      case 'set-complete':
      case 'exercise-complete':
        playCompleteSound();
        break;
      case 'rest-start':
        playRestSound();
        break;
      case 'rest-warning':
        playWarningSound();
        break;
      default:
        // Do nothing for unknown events
        break;
    }
  }, [playStartSound, playCompleteSound, playRestSound, playWarningSound]);

  return {
    // Configuration
    config,

    // Actions
    playSound,
    toggleSound,
    setVolume,
    updateSounds,
    stopSound,

    // State
    isPlaying,
    currentSound,

    // Utility methods
    isSoundSupported,
    getSoundDuration,

    // Convenience methods
    playStartSound,
    playCompleteSound,
    playRestSound,
    playWarningSound,
    handleWorkoutEvent,
  };
};
