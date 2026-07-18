# Omi React Native App — Build Plan

A from-scratch **React Native** port of the Omi mobile app (currently Flutter, in `app/`),
targeting **Android first**, with **Firebase Auth** (same approach as the `desktop/linux` port).
This directory (`app/react-native/`) is the new app tree and is intended to be submitted as a
PR to `BasedHardware/omi` (mirroring the `desktop/linux` addition in PR #9963).

> Status: PLAN + scaffold. No `npm install` / Android build has been run yet (heavy toolchain
> deferred). This document defines the full scope; implementation lands in follow-up commits.

## Why React Native (not Flutter)
The Flutter app is ~566 Dart files / ~627k LOC with 15+ integration services, BLE devices,
real-time STT, and agent chat. Building/iterating on Flutter here consumed 10GB+ of toolchain
(Flutter + Android SDK + iOS). RN shares the same Omi backend REST/WebSocket contracts the
desktop/Linux port already uses, so most client logic ports cleanly to TypeScript.

## Backend contracts (reuse as-is from desktop/linux)
The RN app talks to the **same** Omi backend the Linux port uses:
- Auth: Firebase (`firebase_auth`) — Android first.
- Conversations: `GET/POST /v1/conversations`, `GET /v1/conversations/{id}`
- Memories: `GET/POST /v3/memories`
- Goals: `POST /v1/goals`, `GET /v1/goals`
- Action items: `GET/POST /v1/action-items`
- Knowledge graph: `GET/POST/DELETE /v1/knowledge-graph`, `POST /v1/knowledge-graph/rebuild`
- Live transcription: WebSocket `/v4/listen` (mic → transcript) or Deepgram `nova-2`+diarize
  (same path as `desktop/linux` `voiceprint.ts` for speaker ID).
- TTS: Web Speech API / Deepgram Aura (`ttsService` pattern from `desktop/linux`).

## Tech stack (Android-first)
- React Native (CLI) + TypeScript
- State: Zustand (lightweight; Flutter uses Provider)
- Navigation: React Navigation (stack + bottom tabs)
- Networking: `axios` + a WebSocket client (native WebSocket for `/v4/listen`)
- Firebase: `@react-native-firebase/auth` (Android)
- BLE (Omi device): `react-native-ble-plx`
- STT: mic → Deepgram (`nova-2` + `diarize`) reusing the Linux voiceprint enrollment
- TTS: Web Speech / Deepgram Aura
- Maps (location memories): `react-native-maps` (optional, phase 2)

## Feature surface to port (from `app/lib/pages`)
| Flutter page | RN screen | Phase |
|---|---|---|
| `home` | Home (device, captures feed) | 1 |
| `capture` / `conversation_capturing` | Capture / Live recording | 1 |
| `conversations` | Conversations list + detail | 1 |
| `conversation_detail` | Conversation detail (transcript, share) | 1 |
| `memories` | Memories list + categories | 1 |
| `chat` | Agent chat | 2 |
| `goals` (Goals/Tasks) | Goals/Tasks | 2 |
| `apps` / `action_items` | Apps + Action items + MCP | 2 |
| `people` (providers) | People | 2 |
| `onboarding` | Onboarding (auth, device, permissions) | 1 |
| `settings` | Settings | 1 |
| `speech_profile` | Speech profile (voiceprint enroll) | 2 |
| `phone_calls` | Phone calls (Twilio) | 3 |
| `payments` | Payments (Stripe/PayPal) | 3 |
| `announcements` | Announcements/changelog | 3 |
| `referral` | Referral | 3 |
| `sdcard` | Local storage / dev | 3 |

Integrations (Flutter `lib/services`): Google Calendar/Tasks, Todoist, Asana, ClickUp,
Notion, Gmail, Apple (Health/Reminders — iOS only, skip on Android), Stripe, PayPal.
These map to the same backend APIs; most are server-side and need only a thin RN client.

## Native bridges needed (Android)
- Microphone capture → PCM stream → `/v4/listen` or Deepgram (reuse Linux `liveMicSession` logic).
- BLE for Omi device pairing (`react-native-ble-plx`).
- TTS playback.
- (iOS later) same bridges + signing.

## Proposed structure
```
app/react-native/
  PLAN.md                # this file
  README.md
  package.json
  tsconfig.json
  app.json
  index.js
  android/               # RN Android shell (added at build time)
  src/
    api/                 # omiApi client (axios + ws), endpoints above
    auth/                # Firebase login (Android)
    state/               # Zustand stores (conversations, memories, goals, ...)
    navigation/          # React Navigation
    screens/             # Home, Conversations, ConversationDetail, Memories,
                         #   Capture, Chat, Goals, Apps, Settings, Onboarding
    services/            # stt (Deepgram), tts, ble, integrations
    components/          # shared UI
    theme/
  AGENTS.md              # build/run notes for contributors
```

## Phasing
- **Phase 1 — SCAFFOLDED (this tree):** project skeleton, Firebase auth, navigation shell,
  Zustand stores, API client, Deepgram STT + voiceprint, TTS stub, and screens
  (Onboarding, Home, Conversations, ConversationDetail, Memories, Capture, Settings).
  `npm install` / Android build deferred; `tsc --noEmit` pending `node_modules`.
- **Phase 2:** Goals/Tasks, People, Agent chat (WS `Env.agentProxyWsUrl`), Apps/Action-items/MCP,
  Onboarding completion (Google sign-in wiring), Settings depth, speech-profile enroll screen.
- **Phase 3:** Phone calls (Twilio), Payments (Stripe/PayPal), Announcements, Referral,
  BLE Omi device pairing (`react-native-ble-plx`), iOS shell + signing.

## Disk / toolchain note
RN Android needs Android SDK (~5–8GB) + node_modules (~1–2GB) — lighter than Flutter+iOS.
iOS build requires macOS + Xcode (phase 3).

## Relationship to other ports
- Shares Omi backend contracts with `desktop/windows` and `desktop/linux`.
- Reuses `desktop/linux` patterns: `voiceprint.ts` (speaker ID), `ttsService`,
  `liveMicSession` (mic→transcript), memory read/write.
- Syncs portable features from `desktop/windows` over time (Notion/Obsidian export, KG worker,
  settings search) where applicable to mobile.
