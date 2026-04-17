export const GA_MEASUREMENT_ID = 'G-SFN8R0VMMR'

type GtagEvent = {
  action: string
  params?: Record<string, string | number>
}

function sendEvent({ action, params }: GtagEvent) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, params)
  }
}

export function trackCtaClick(pagePath: string, ctaText: string) {
  sendEvent({ action: 'cta_click', params: { page_path: pagePath, cta_text: ctaText } })
}

export function trackPhoneClick(pagePath: string, phoneNumber: string) {
  sendEvent({ action: 'phone_click', params: { page_path: pagePath, phone_number: phoneNumber } })
}

export function trackFormVisible(pagePath: string) {
  sendEvent({ action: 'form_visible', params: { page_path: pagePath } })
}

export function trackFormStart(pagePath: string, firstField: string) {
  sendEvent({ action: 'form_start', params: { page_path: pagePath, first_field: firstField } })
}

export function trackFormSubmit(pagePath: string) {
  sendEvent({ action: 'form_submit', params: { page_path: pagePath } })
}

export function trackScrollDepth(pagePath: string, depthThreshold: number) {
  sendEvent({ action: 'scroll_depth', params: { page_path: pagePath, depth_threshold: depthThreshold } })
}
