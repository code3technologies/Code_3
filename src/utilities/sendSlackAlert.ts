export async function sendSlackAlert(title: string, details: Record<string, string>) {
  const webhookUrl = process.env.SLACK_ALERT_WEBHOOK_URL
  if (!webhookUrl) return

  const detailLines = Object.entries(details)
    .map(([key, value]) => `*${key}:* ${value}`)
    .join('\n')

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `:rotating_light: *${title}*\n${detailLines}`,
      }),
      signal: AbortSignal.timeout(8000),
    })
  } catch (err) {
    console.error('Error sending Slack alert:', err)
  }
}
