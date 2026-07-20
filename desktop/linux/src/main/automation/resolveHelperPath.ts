import { app } from 'electron'
import { join } from 'path'
import { existsSync } from 'fs'

/**
 * Resolve the on-disk path to the bundled Windows automation helper (.exe).
 * This port targets Linux, where desktop automation uses the native
 * xdotool/accessibility path instead — so on non-Windows this returns a
 * sentinel that makes the bridge no-op rather than looking for a Windows exe.
 */
export function resolveHelperPath(): string {
  if (process.platform !== 'win32') {
    return ''
  }
  const exe = 'win-automation-helper.exe'
  const candidates = [
    join(process.resourcesPath, 'app.asar.unpacked', 'resources', 'win-automation-helper', exe),
    join(process.resourcesPath, 'win-automation-helper', exe),
    join(app.getAppPath(), 'resources', 'win-automation-helper', exe)
  ]
  for (const c of candidates) {
    if (existsSync(c)) return c
  }
  return candidates[candidates.length - 1]
}

