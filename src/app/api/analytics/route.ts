import { NextRequest, NextResponse } from 'next/server'
import { BetaAnalyticsDataClient } from '@google-analytics/data'

const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')

function getClient() {
  if (!GA4_PROPERTY_ID || !GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY) {
    throw new Error('GA4 환경변수 미설정')
  }
  return new BetaAnalyticsDataClient({
    credentials: {
      client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: GOOGLE_PRIVATE_KEY,
    },
  })
}

function calcPercent(count: number, total: number) {
  return total > 0 ? Math.round((count / total) * 1000) / 10 : 0
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function val(row: any, idx: number): number {
  return parseInt(row?.metricValues?.[idx]?.value || '0', 10)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dim(row: any, idx = 0): string {
  const v = row?.dimensionValues?.[idx]?.value || ''
  return v === '(not set)' ? '기타' : v
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const days = Math.min(parseInt(searchParams.get('days') || '7', 10), 90)

    const client = getClient()
    const property = `properties/${GA4_PROPERTY_ID}`
    const dateRanges = [{ startDate: `${days}daysAgo`, endDate: 'today' }]

    // Realtime reports (last 30 min)
    let realtimeUsers = 0
    let realtimePages: { path: string; users: number }[] = []
    try {
      const [rtSummary, rtPages] = await Promise.all([
        client.runRealtimeReport({
          property,
          metrics: [{ name: 'activeUsers' }],
        }),
        client.runRealtimeReport({
          property,
          dimensions: [{ name: 'unifiedScreenName' }],
          metrics: [{ name: 'activeUsers' }],
          orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
          limit: 5,
        }),
      ])
      realtimeUsers = val(rtSummary[0]?.rows?.[0], 0)
      realtimePages = (rtPages[0]?.rows || []).map((r) => ({
        path: dim(r),
        users: val(r, 0),
      }))
    } catch {
      // Realtime report failure - silent
    }

    // Batch 1: summary, daily, sources, referrers, devices (5 reports)
    const [batch1] = await client.batchRunReports({
      property,
      requests: [
        {
          dateRanges,
          metrics: [
            { name: 'totalUsers' },
            { name: 'screenPageViews' },
            { name: 'averageSessionDuration' },
            { name: 'bounceRate' },
          ],
        },
        {
          dateRanges,
          dimensions: [{ name: 'date' }],
          metrics: [{ name: 'totalUsers' }],
          orderBys: [{ dimension: { dimensionName: 'date' } }],
        },
        {
          dateRanges,
          dimensions: [{ name: 'sessionDefaultChannelGroup' }],
          metrics: [{ name: 'sessions' }],
          orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
          limit: 10,
        },
        {
          dateRanges,
          dimensions: [{ name: 'sessionSource' }],
          metrics: [{ name: 'sessions' }],
          orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
          limit: 10,
        },
        {
          dateRanges,
          dimensions: [{ name: 'deviceCategory' }],
          metrics: [{ name: 'sessions' }],
          orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        },
      ],
    })

    // Batch 2: pages, regions, event counts, page flow, page conversions (5 reports)
    const [batch2] = await client.batchRunReports({
      property,
      requests: [
        {
          dateRanges,
          dimensions: [{ name: 'pagePath' }],
          metrics: [{ name: 'screenPageViews' }],
          orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
          limit: 10,
        },
        {
          dateRanges,
          dimensions: [{ name: 'city' }],
          metrics: [{ name: 'sessions' }],
          orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
          limit: 10,
        },
        // Event counts for funnel + conversions
        {
          dateRanges,
          dimensions: [{ name: 'eventName' }],
          metrics: [{ name: 'eventCount' }],
          dimensionFilter: {
            filter: {
              fieldName: 'eventName',
              inListFilter: {
                values: [
                  'cta_click',
                  'phone_click',
                  'form_visible',
                  'form_start',
                  'form_submit',
                  'scroll_depth',
                ],
              },
            },
          },
        },
        // Page flow: pagePath with sessions for flow visualization
        {
          dateRanges,
          dimensions: [{ name: 'pagePath' }, { name: 'pageReferrer' }],
          metrics: [{ name: 'sessions' }],
          orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
          limit: 20,
        },
        // Page conversions: events per page
        {
          dateRanges,
          dimensions: [{ name: 'pagePath' }, { name: 'eventName' }],
          metrics: [{ name: 'eventCount' }],
          dimensionFilter: {
            filter: {
              fieldName: 'eventName',
              inListFilter: {
                values: ['cta_click', 'phone_click', 'form_submit'],
              },
            },
          },
          orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
          limit: 20,
        },
      ],
    })

    const reports1 = batch1?.reports || []
    const reports2 = batch2?.reports || []

    // Batch 1 results
    const summary = reports1[0]
    const daily = reports1[1]
    const sources = reports1[2]
    const referrers = reports1[3]
    const devices = reports1[4]

    // Batch 2 results
    const pages = reports2[0]
    const regions = reports2[1]
    const eventCounts = reports2[2]
    const pageFlowReport = reports2[3]
    const pageConversions = reports2[4]

    // Summary
    const sRow = summary?.rows?.[0]
    const visitors = val(sRow, 0)
    const pageviews = val(sRow, 1)
    const avgDurationSec = parseFloat(sRow?.metricValues?.[2]?.value || '0')
    const bounceRateRaw = parseFloat(sRow?.metricValues?.[3]?.value || '0')

    // Daily visitors
    const dailyVisitors = (daily?.rows || []).map((row) => {
      const d = row.dimensionValues?.[0]?.value || ''
      return {
        date: d.length === 8 ? `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}` : d,
        count: val(row, 0),
      }
    })

    // Traffic sources
    const srcRows = sources?.rows || []
    const srcTotal = srcRows.reduce((s, r) => s + val(r, 0), 0)
    const trafficSources = srcRows.map((r) => {
      const count = val(r, 0)
      return { source: dim(r), count, percent: calcPercent(count, srcTotal) }
    })

    // Referrers
    const refRows = referrers?.rows || []
    const referrerList = refRows.map((r) => ({
      url: dim(r),
      count: val(r, 0),
    }))

    // Devices
    const devRows = devices?.rows || []
    const devTotal = devRows.reduce((s, r) => s + val(r, 0), 0)
    const deviceList = devRows.map((r) => {
      const count = val(r, 0)
      const label = dim(r)
      const labelMap: Record<string, string> = { desktop: '데스크톱', mobile: '모바일', tablet: '태블릿' }
      return { type: labelMap[label] || label, count, percent: calcPercent(count, devTotal) }
    })

    // Top pages
    const pageRows = pages?.rows || []
    const topPages = pageRows.map((r) => ({
      path: dim(r),
      views: val(r, 0),
    }))

    // Regions
    const regRows = regions?.rows || []
    const regTotal = regRows.reduce((s, r) => s + val(r, 0), 0)
    const regionList = regRows.map((r) => {
      const count = val(r, 0)
      return { name: dim(r), count, percent: calcPercent(count, regTotal) }
    })

    // Event counts → conversions map
    const eventMap: Record<string, number> = {}
    for (const row of eventCounts?.rows || []) {
      eventMap[dim(row)] = val(row, 0)
    }

    const conversions = {
      phone_click: eventMap['phone_click'] || 0,
      cta_click: eventMap['cta_click'] || 0,
      form_submit: eventMap['form_submit'] || 0,
      form_visible: eventMap['form_visible'] || 0,
      form_start: eventMap['form_start'] || 0,
      scroll_depth: eventMap['scroll_depth'] || 0,
    }

    // Funnel: visitors → cta_click → form_visible → form_start → form_submit
    const funnel = [
      { label: '방문자', value: visitors, eventName: 'session_start' },
      { label: 'CTA 클릭', value: conversions.cta_click, eventName: 'cta_click' },
      { label: '폼 노출', value: conversions.form_visible, eventName: 'form_visible' },
      { label: '입력 시작', value: conversions.form_start, eventName: 'form_start' },
      { label: '폼 제출', value: conversions.form_submit, eventName: 'form_submit' },
    ]

    // Page flow
    const flowNodes: { page: string; views: number }[] = topPages.slice(0, 8).map((p) => ({
      page: p.path,
      views: p.views,
    }))

    const flowLinks: { from: string; to: string; count: number }[] = []
    for (const row of pageFlowReport?.rows || []) {
      const toPage = dim(row, 0)
      let fromPage = dim(row, 1)
      const count = val(row, 0)
      if (fromPage && fromPage !== '기타' && toPage) {
        // Clean referrer to path only
        try {
          const url = new URL(fromPage, 'https://placeholder.com')
          fromPage = url.pathname
        } catch {
          // keep as is
        }
        flowLinks.push({ from: fromPage, to: toPage, count })
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        realtime: { activeUsers: realtimeUsers, pages: realtimePages },
        visitors,
        pageviews,
        avgDuration: Math.round(avgDurationSec),
        bounceRate: Math.round(bounceRateRaw * 1000) / 10,
        dailyVisitors,
        trafficSources,
        referrers: referrerList,
        devices: deviceList,
        topPages,
        regions: regionList,
        conversions,
        funnel,
        pageFlow: { nodes: flowNodes, links: flowLinks.slice(0, 15) },
      },
    })
  } catch (error) {
    console.error('[JNI] GA4 Analytics API error:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
