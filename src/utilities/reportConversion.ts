/**
 * Fires the "Contact" conversion event GTM listens for (tag "Google Ads –
 * Contact Conversion", trigger "Contact Form Success" on this exact event
 * name) - keep this event name in sync with that GTM trigger.
 */
export function reportContactConversion(formType: string = 'contact_form') {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event: 'form_submission_success',
    form_type: formType,
    page_url: window.location.href,
  })
}

/**
 * Fires on click of the floating phone/WhatsApp buttons (present on every
 * page). These are a real conversion path for a local service business but
 * previously fired no event at all, so calls/chats started from organic
 * traffic were invisible to Ads/Analytics. Needs a matching GTM trigger on
 * each event name below (same pattern as "form_submission_success" above)
 * to actually count as a conversion goal.
 */
export function reportContactClickConversion(channel: 'phone' | 'whatsapp') {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event: channel === 'phone' ? 'phone_click_conversion' : 'whatsapp_click_conversion',
    channel,
    page_url: window.location.href,
  })
}

/**
 * Fires when someone joins the newsletter (footer / blog). Needs a matching
 * GTM trigger on "newsletter_signup" to count as a goal, same as the others.
 */
export function reportNewsletterSignup(source: string) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event: 'newsletter_signup',
    source,
    page_url: window.location.href,
  })
}
