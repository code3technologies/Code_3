import { chromium } from 'playwright'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } })
await page.goto('http://localhost:3001/', { waitUntil: 'networkidle' })
await page.evaluate(() => {
  document.querySelectorAll('[id*="siqembed"], [id*="zsiq"]').forEach(el => el.style.display = 'none')
})
await page.evaluate(async () => {
  const distance = 400
  let total = 0
  while (total < document.body.scrollHeight) {
    window.scrollBy(0, distance)
    total += distance
    await new Promise((r) => setTimeout(r, 100))
  }
  window.scrollTo(0, 0)
})
await page.waitForTimeout(600)
await page.screenshot({ path: 'C:/Users/acer/AppData/Local/Temp/claude/c--Users-acer-Downloads-Code-3-main--3--Code-3-main/e2c1e27c-3632-4320-a96d-884d8d70c82a/scratchpad/home-full2.png', fullPage: true })
await browser.close()
