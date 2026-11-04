// Uses CallMeBot's free WhatsApp API (callmebot.com) - no Meta Business
// verification needed, just a phone number + API key obtained once by
// messaging their bot contact from WhatsApp.
export async function sendWhatsAppAlert(title: string, details: Record<string, string>) {
  const phone = process.env.WHATSAPP_ALERT_PHONE
  const apiKey = process.env.WHATSAPP_ALERT_APIKEY
  if (!phone || !apiKey) return

  const detailLines = Object.entries(details)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n')
  const text = `🚨 ${title}\n${detailLines}`

  const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(apiKey)}`

  try {
    await fetch(url, { method: 'GET', signal: AbortSignal.timeout(8000) })
  } catch (err) {
    console.error('Error sending WhatsApp alert:', err)
  }
}
