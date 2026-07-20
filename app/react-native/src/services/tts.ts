/**
 * Text-to-speech. Uses the Web Speech API where available (Android WebView /
 * Hermes lacks it, so falls back to a no-op with a hook for Deepgram Aura).
 * Mirrors desktop/linux ttsService behaviour.
 */
export class TtsService {
  private synth: SpeechSynthesis | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  speak(text: string) {
    if (this.synth) {
      const u = new SpeechSynthesisUtterance(text);
      this.synth.cancel();
      this.synth.speak(u);
    }
    // TODO: Deepgram Aura fallback when window.speechSynthesis is absent.
  }

  stop() {
    this.synth?.cancel();
  }
}

export const tts = new TtsService();
