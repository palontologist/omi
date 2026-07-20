import { create } from 'zustand';
import { DeepgramStream, TranscriptSegment } from '@/services/stt';
import { createVoiceprint, Voiceprint } from '@/services/voiceprint';

interface CaptureState {
  recording: boolean;
  segments: TranscriptSegment[];
  voiceprint: Voiceprint;
  stream: DeepgramStream | null;
  start: () => void;
  stop: () => void;
  pushSegment: (seg: TranscriptSegment) => void;
}

export const useCaptureStore = create<CaptureState>((set, get) => ({
  recording: false,
  segments: [],
  voiceprint: createVoiceprint(),
  stream: null,
  start: () => {
    const vp = get().voiceprint;
    const stream = new DeepgramStream((seg) => {
      if (!vp.isEnrolled()) vp.enroll(seg.speaker);
      const { label, isUser } = vp.labelForSpeaker(seg.speaker);
      get().pushSegment({ ...seg, speaker: label });
      void isUser;
    });
    stream.connect();
    set({ recording: true, stream });
  },
  stop: () => {
    get().stream?.close();
    set({ recording: false, stream: null });
  },
  pushSegment: (seg) => set({ segments: [...get().segments, seg] }),
}));
