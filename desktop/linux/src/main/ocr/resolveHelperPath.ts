import { app } from 'electron'
import { join } from 'path'
import { existsSync } from 'fs'

/**
 * Resolve the on-disk path to the OCR helper.
 *
 * On Linux this port uses the Tesseract-backed Node helper
 * (resources/linux-ocr-helper/omi-ocr-helper). On Windows the bundled
 * win-ocr-helper.exe is used. Locations, in priority order:
 *
 * Linux:
 * 1. Packaged via `asarUnpack: resources/**`:
 *    `<resourcesPath>/app.asar.unpacked/resources/linux-ocr-helper/omi-ocr-helper`
 * 2. Packaged via extraResources:
 *    `<resourcesPath>/linux-ocr-helper/omi-ocr-helper`
 * 3. Dev (electron-vite): `<appPath>/resources/linux-ocr-helper/omi-ocr-helper`
 *
 * Windows:
 * 1. Packaged via `asarUnpack: resources/**`:
 *    `<resourcesPath>/app.asar.unpacked/resources/win-ocr-helper/win-ocr-helper.exe`
 * 2. Packaged via extraResources:
 *    `<resourcesPath>/win-ocr-helper/win-ocr-helper.exe`
 * 3. Dev (electron-vite): `<appPath>/resources/win-ocr-helper/win-ocr-helper.exe`
 */
export function resolveHelperPath(): string {
  const isWin = process.platform === 'win32'
  const exe = isWin ? 'win-ocr-helper.exe' : 'omi-ocr-helper'
  const dir = isWin ? 'win-ocr-helper' : 'linux-ocr-helper'
  const candidates = [
    join(process.resourcesPath, 'app.asar.unpacked', 'resources', dir, exe),
    join(process.resourcesPath, dir, exe),
    join(app.getAppPath(), 'resources', dir, exe)
  ]
  for (const c of candidates) {
    if (existsSync(c)) return c
  }
  // Return the dev path so the supervisor surfaces a clear "helper not found"
  // error rather than spawning a nonexistent path.
  return candidates[candidates.length - 1]
}

