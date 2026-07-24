import { chromium } from 'playwright'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } })
const errors = []
page.on('pageerror', (err) => errors.push(err.message))
await page.goto('http://localhost:3001/', { waitUntil: 'networkidle' })
await page.evaluate(() => {
  document.querySelectorAll('[id*="siqembed"], [id*="zsiq"]').forEach(el => el.style.display = 'none')
})
await page.waitForTimeout(500)
await page.screenshot({ path: 'C:/Users/acer/AppData/Local/Temp/claude/c--Users-acer-Downloads-Code-3-main--3--Code-3-main/e2c1e27c-3632-4320-a96d-884d8d70c82a/scratchpad/home-full.png', fullPage: true })
console.log('errors:', errors.length)
await browser.close()
