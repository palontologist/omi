import Constants from 'expo-constants';

/**
 * Runtime configuration for the Omi RN (Expo) app.
 * Values come from app.json `expo.extra` (overridable via EAS secrets).
 * Mirrors the env contract used by the Flutter app and the desktop/linux port.
 */
const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, string>;

export const ENV = {
  apiBaseUrl: extra.apiBaseUrl ?? 'https://api.omi.me',
  listenWsUrl: extra.listenWsUrl ?? 'wss://api.omi.me/v4/listen',
  agentProxyWsUrl: extra.agentProxyWsUrl ?? 'wss://api.omi.me/v1/agent/chat',
  deepgramApiKey: extra.deepgramApiKey ?? '',
  deepgramWsUrl:
    extra.deepgramWsUrl ??
    'wss://api.deepgram.com/v1/listen?model=nova-2&diarize=true&smart_format=true&interim_results=true',
} as const;

export type Env = typeof ENV;
