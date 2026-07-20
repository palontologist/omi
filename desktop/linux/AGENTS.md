# Omi Desktop — Linux Port

This subtree (`desktop/linux`) is the **Linux** Electron build of the Omi desktop app.
It shares the same renderer and main-process feature set as the Windows build
(`desktop/windows`) but uses Linux-native capture/automation backends.

## What is supported on Linux

- **Screen + system-audio capture**: PipeWire (`WebRTCPipeWireCapturer`) on Wayland,
  X11 via XWayland by default (`OMI_OZONE=wayland` override). See `rewind/`.
- **Foreground/app-usage monitor**: `usage/foregroundMonitor.ts` shelling out to
  `xprop` + `/proc` (X11). Wayland degrades gracefully (see `nativeForeground`).
- **OCR**: Tesseract helper (`resources/linux-ocr-helper/omi-ocr-helper`), speaking the
  win-ocr-helper stdio protocol so the rest of the code is platform-agnostic.
- **Sign-language avatar**: bundled `pose-viewer` dependency (`SignAvatar`), no iframe/CDN.
- **Automation bridge**: `automation/bridge.ts` for real Linux UI actions (opt-out via
  `OMI_AUTOMATION=0`).

## What is NOT included on Linux

- The Windows-only OCR/automation helpers (`resources/win-ocr-helper`,
  `resources/win-automation-helper`) are not bundled here.
- `userAssistRegistry` (Windows UserAssist registry seeding) is a no-op off-Windows;
  its `require('koffi')` is lazily loaded so the module stays importable on Linux.

## Security model (reviewed before merge)

- `webSecurity` is **enabled**. Omi API CORS is handled at the `session` layer
  (`onBeforeSendHeaders` strips `Origin`; `onHeadersReceived` injects `ACAO`) — scoped to
  `api.omi.me` and the desktop backend, not a global disable.
- Permission grants (`microphone`, `media`, `display-capture`) are scoped to the app's
  own trusted origins (`http://localhost`, `file://`) and denied for any other origin.
- The Deepgram Voice Agent's `write_file` tool is confined to a sandbox directory
  (`Documents/OmiAgent`, overridable via `OMI_AGENT_SANDBOX_DIR`); absolute paths
  outside it are refused. `open_url` only allows `http(s)`/`mailto` schemes.

## Build

```bash
pnpm install
pnpm build            # electron-vite build
pnpm run dist:linux   # AppImage (+ deb)
```

See `README.md` for full setup, dependencies (tesseract-ocr, libxss1, libnotify4),
and Wayland/XWayland notes.
