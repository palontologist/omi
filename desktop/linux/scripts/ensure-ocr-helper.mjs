// Postinstall step for the Linux port. On Linux the screen-OCR helper is the
// Tesseract-backed Node script (resources/linux-ocr-helper/omi-ocr-helper) — it
// needs no compilation, only the system `tesseract` binary at runtime. This step
// is a no-op on Linux (the helper is plain JS) and remains a no-op off the
// supported platform. NON-FATAL: it must never break `npm install`.
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const linuxHelper = join(root, 'resources', 'linux-ocr-helper', 'omi-ocr-helper')

if (process.platform !== 'linux') {
  console.log('[ensure-ocr-helper] not Linux — skipping (this is the Linux port).')
  process.exit(0)
}
if (existsSync(linuxHelper)) {
  console.log('[ensure-ocr-helper] Linux OCR helper present at', linuxHelper, '— skipping.')
} else {
  console.warn(
    '[ensure-ocr-helper] Linux OCR helper missing at', linuxHelper,
    '— screen-reading will be disabled until it is added.'
  )
}
process.exit(0)
