import { ENV } from '@/config/env';

export interface DeepgramMessage {
  channel?: { alternatives?: { transcript?: string; words?: { speaker?: number; word: string; start: number; end: number }[] }[] };
  is_final?: boolean;
}

export interface TranscriptSegment {
  text: string;
  speaker: string;
  start: number;
  end: number;
  isFinal: boolean;
}

type OnSegment = (seg: TranscriptSegment) => void;

/**
 * Streaming STT via Deepgram (nova-2 + diarize), matching the desktop/linux
 * deepgramListen.ts behaviour. PCM16/Opus audio is sent over the websocket;
 * speaker numbers are resolved to labels by the voiceprint module.
 */
export class DeepgramStream {
  private ws: WebSocket | null = null;
  private url: string;

  constructor(private onSegment: OnSegment, apiKey = ENV.deepgramApiKey) {
    this.url = `${ENV.deepgramWsUrl}&access_token=${apiKey}`;
  }

  connect() {
    this.ws = new WebSocket(this.url);
    this.ws.binaryType = 'arraybuffer';
    this.ws.onmessage = (ev) => this.handleMessage(ev.data);
  }

  private handleMessage(data: string) {
    try {
      const msg = JSON.parse(data) as DeepgramMessage;
      const alt = msg.channel?.alternatives?.[0];
      if (!alt?.transcript) return;
      const speaker = alt.words?.[0]?.speaker ?? 0;
      this.onSegment({
        text: alt.transcript,
        speaker: `speaker_${speaker}`,
        start: alt.words?.[0]?.start ?? 0,
        end: alt.words?.[alt.words.length - 1]?.end ?? 0,
        isFinal: Boolean(msg.is_final),
      });
    } catch {
      /* ignore malformed frames */
    }
  }

  sendAudio(chunk: ArrayBuffer) {
    this.ws?.readyState === WebSocket.OPEN && this.ws.send(chunk);
  }

  close() {
    this.ws?.close();
    this.ws = null;
  }
}
