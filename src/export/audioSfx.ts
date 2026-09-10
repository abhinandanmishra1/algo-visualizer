/**
 * Audio SFX Manager for Algorithm Visualization Export
 *
 * Synthesizes real-time sound effects synced to algorithm step events
 * using the Web Audio API. Tones are mixed into a MediaStream for recording.
 */

export interface AudioSfxManager {
  context: AudioContext;
  destination: MediaStreamAudioDestinationNode;
  playBeep(freq: number, durationMs: number): void;
  playCompare(): void; // dual-freq beep on array/list comparison
  playSwap(): void; // tone on swap/move operation
  playFound(): void; // upbeat ding on match/target found
  playComplete(): void; // success sequence at algorithm end
  getAudioStream(): MediaStream; // return audio track for recording
}

/**
 * Create a new AudioSfxManager instance with Web Audio API synthesis.
 * Connect oscillators to a MediaStreamDestination for seamless recording.
 */
export function createAudioSfxManager(): AudioSfxManager {
  // Initialize Web Audio API context with MediaStreamDestination for recording
  const audioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  const context = new audioContextClass() as AudioContext;
  const destination = context.createMediaStreamDestination();

  /**
   * Play a single sine wave beep at the given frequency and duration.
   * Uses exponential ramp to create a natural decay envelope.
   */
  function playBeep(freq: number, durationMs: number): void {
    const osc = context.createOscillator();
    const gain = context.createGain();

    osc.connect(gain);
    gain.connect(destination);

    osc.frequency.value = freq;
    osc.type = 'sine';

    const startTime = context.currentTime;
    const duration = durationMs / 1000;

    gain.gain.setValueAtTime(0.1, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  /**
   * Play a dual-frequency beep for array/list comparisons.
   * Creates a chord-like effect by mixing 800Hz and 1000Hz simultaneously.
   * Duration: 80ms with natural decay.
   */
  function playCompare(): void {
    const osc1 = context.createOscillator();
    const osc2 = context.createOscillator();
    const gain = context.createGain();

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(destination);

    osc1.frequency.value = 800;
    osc2.frequency.value = 1000;
    osc1.type = 'sine';
    osc2.type = 'sine';

    const startTime = context.currentTime;
    const duration = 0.08; // 80ms

    gain.gain.setValueAtTime(0.05, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + duration);
    osc2.stop(startTime + duration);
  }

  /**
   * Play a swap/move tone at 600Hz.
   * Duration: 100ms.
   */
  function playSwap(): void {
    playBeep(600, 100);
  }

  /**
   * Play an upbeat ding tone for target found.
   * Single 1200Hz sine wave, ~150ms duration.
   */
  function playFound(): void {
    playBeep(1200, 150);
  }

  /**
   * Play a success sequence: ascending arpeggio.
   * Three tones (1000Hz → 1200Hz → 1400Hz) with brief pauses.
   * Total duration: ~360ms.
   */
  function playComplete(): void {
    const tones = [
      { freq: 1000, delay: 0, duration: 0.1 },
      { freq: 1200, delay: 0.12, duration: 0.1 },
      { freq: 1400, delay: 0.24, duration: 0.12 }
    ];

    tones.forEach(({ freq, delay, duration }) => {
      const osc = context.createOscillator();
      const gain = context.createGain();

      osc.connect(gain);
      gain.connect(destination);

      osc.frequency.value = freq;
      osc.type = 'sine';

      const startTime = context.currentTime + delay;

      gain.gain.setValueAtTime(0.1, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  }

  /**
   * Get the audio stream for recording.
   * Contains the audio track from all synthesized sound effects.
   */
  function getAudioStream(): MediaStream {
    return destination.stream;
  }

  return {
    context,
    destination,
    playBeep,
    playCompare,
    playSwap,
    playFound,
    playComplete,
    getAudioStream
  };
}
