import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { deleteR2Image } from '@/lib/r2'

const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN
const AIRTABLE_BASE_ID = 'appxU3n3KqoUr3l9e'
const BOARD_TABLE_ID = 'tbl70mSCu4sicfZa5'

// 필드 ID 매핑 (Airtable 인코딩 이슈 방지)
const FIELD_IDS: Record<string, string> = {
  제목: 'fldZ7fwbfxuSB8h1e',
  요약: 'fldFM2SrXA57YVpDh',
  내용: 'fldizthhl55jka0iX',
  카테고리: 'fldONH3XMUJsVB8UO',
  금액: 'fldzGiDfPJcb2qmnF',
  작성일: 'fldiiS0vSWHqMVTNw',
  공개여부: 'fldM7DjMJMKLrCnV8',
  썸네일: 'fldTdp4fSsnGkSl68',
}

// 카테고리 Select Option ID → 이름
const CATEGORY_NAMES: Record<string, string> = {
  selM4ZDRvm8PMBpBV: '성공사례',
  selvmPChs5uR3tLAQ: '정책자금',
  selfHlxsrswu3QAzO: '인증지원',
}

// 카테고리 이름 → Select Option ID
const CATEGORY_IDS: Record<string, string> = {
  성공사례: 'selM4ZDRvm8PMBpBV',
  정책자금: 'selvmPChs5uR3tLAQ',
  인증지원: 'selfHlxsrswu3QAzO',
}

interface AirtableField {
  id?: string
  name?: string
}

function getFieldById(fields: Record<string, unknown>, koreanName: string): unknown {
  const fieldId = FIELD_IDS[koreanName]
  if (!fieldId) return undefined
  const value = fields[fieldId]
  if (koreanName === '카테고리' && value && typeof value === 'object') {
    const v = value as AirtableField
    return CATEGORY_NAMES[v.id || ''] || v.name || v.id
  }
  return value
}

function getKSTDateString(): string {
  const now = new Date()
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  return kst.toISOString().split('T')[0]
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  try {
    if (id) {
      const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${BOARD_TABLE_ID}/${id}?returnFieldsByFieldId=true`
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
        next: { tags: ['board'], revalidate: 10 },
      })
      if (!response.ok) {
        if (response.status === 404) return NextResponse.json({ success: false, error: '게시글을 찾을 수 없습니다' }, { status: 404 })
        throw new Error(`Airtable Error: ${response.status}`)
      }
      const record = await response.json()
      const f = record.fields
      return NextResponse.json({
        success: true,
        post: {
          id: record.id,
          제목: getFieldById(f, '제목') || '',
          요약: getFieldById(f, '요약') || '',
          내용: getFieldById(f, '내용') || '',
          카테고리: getFieldById(f, '카테고리') || '',
          금액: getFieldById(f, '금액') || '',
          작성일: getFieldById(f, '작성일') || record.createdTime,
          공개여부: getFieldById(f, '공개여부') !== false,
          썸네일: getFieldById(f, '썸네일') || '',
        },
      })
    }

    // 목록 조회
    const params = new URLSearchParams({ maxRecords: '100', returnFieldsByFieldId: 'true' })
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${BOARD_TABLE_ID}?${params}`
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
      next: { tags: ['board'], revalidate: 10 },
    })
    if (!response.ok) throw new Error(`Airtable Error: ${response.status}`)
    const data = await response.json()

    const posts = data.records.map((record: { id: string; fields: Record<string, unknown>; createdTime: string }) => {
      const f = record.fields
      return {
        id: record.id,
        제목: getFieldById(f, '제목') || '',
        요약: getFieldById(f, '요약') || '',
        카테고리: getFieldById(f, '카테고리') || '',
        금액: getFieldById(f, '금액') || '',
        작성일: getFieldById(f, '작성일') || record.createdTime,
        공개여부: getFieldById(f, '공개여부') !== false,
        썸네일: getFieldById(f, '썸네일') || '',
      }
    })

    return NextResponse.json({ success: true, posts })
  } catch (error) {
    console.error('Board API Error:', error)
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 제목, 요약, 내용, 카테고리, 금액, 공개여부, 썸네일 } = body

    if (!제목) {
      return NextResponse.json({ success: false, error: '제목은 필수입니다.' }, { status: 400 })
    }

    // 필드ID 기반으로 데이터 구성
    const fields: Record<string, unknown> = {
      [FIELD_IDS.제목]: 제목,
      [FIELD_IDS.작성일]: getKSTDateString(),
    }

    if (요약) fields[FIELD_IDS.요약] = 요약
    if (내용) fields[FIELD_IDS.내용] = 내용
    if (카테고리) {
      const categoryId = CATEGORY_IDS[카테고리]
      if (categoryId) {
        fields[FIELD_IDS.카테고리] = { id: categoryId }
      }
    }
    if (금액) fields[FIELD_IDS.금액] = 금액
    if (공개여부 !== undefined) fields[FIELD_IDS.공개여부] = 공개여부
    if (썸네일) fields[FIELD_IDS.썸네일] = 썸네일

    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${BOARD_TABLE_ID}?returnFieldsByFieldId=true`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields }),
    })

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      console.error('Board POST Airtable Error:', errData)
      throw new Error(`Airtable Error: ${response.status}`)
    }

    const record = await response.json()
    revalidateTag('board')
    return NextResponse.json({ success: true, id: record.id })
  } catch (error) {
    console.error('Board POST Error:', error)
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, 제목, 요약, 내용, 카테고리, 금액, 공개여부, 썸네일 } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID가 필요합니다.' }, { status: 400 })
    }

    // 썸네일이 변경된 경우, 기존 썸네일을 R2에서 삭제
    if (썸네일 !== undefined) {
      try {
        const oldUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${BOARD_TABLE_ID}/${id}?returnFieldsByFieldId=true`
        const oldRes = await fetch(oldUrl, {
          headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
        })
        if (oldRes.ok) {
          const oldRecord = await oldRes.json()
          const oldThumbnail = oldRecord.fields?.[FIELD_IDS.썸네일] as string | undefined
          if (oldThumbnail && oldThumbnail !== 썸네일) {
            await deleteR2Image(oldThumbnail)
          }
        }
      } catch (e) {
        console.error('[JNI] Failed to cleanup old thumbnail:', e)
      }
    }

    // 수정할 필드만 포함
    const fields: Record<string, unknown> = {}

    if (제목 !== undefined) fields[FIELD_IDS.제목] = 제목
    if (요약 !== undefined) fields[FIELD_IDS.요약] = 요약
    if (내용 !== undefined) fields[FIELD_IDS.내용] = 내용
    if (카테고리 !== undefined) {
      const categoryId = CATEGORY_IDS[카테고리]
      if (categoryId) {
        fields[FIELD_IDS.카테고리] = { id: categoryId }
      }
    }
    if (금액 !== undefined) fields[FIELD_IDS.금액] = 금액
    if (공개여부 !== undefined) fields[FIELD_IDS.공개여부] = 공개여부
    if (썸네일 !== undefined) fields[FIELD_IDS.썸네일] = 썸네일

    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${BOARD_TABLE_ID}/${id}?returnFieldsByFieldId=true`
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields }),
    })

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      console.error('Board PUT Airtable Error:', errData)
      throw new Error(`Airtable Error: ${response.status}`)
    }

    const record = await response.json()
    revalidateTag('board')
    return NextResponse.json({ success: true, id: record.id })
  } catch (error) {
    console.error('Board PUT Error:', error)
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ success: false, error: 'ID가 필요합니다.' }, { status: 400 })
  }

  try {
    // 삭제 전 기존 썸네일 URL을 가져와서 R2에서 삭제
    try {
      const getUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${BOARD_TABLE_ID}/${id}?returnFieldsByFieldId=true`
      const getRes = await fetch(getUrl, {
        headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
      })
      if (getRes.ok) {
        const record = await getRes.json()
        const thumbnail = record.fields?.[FIELD_IDS.썸네일] as string | undefined
        if (thumbnail) {
          await deleteR2Image(thumbnail)
        }
      }
    } catch (e) {
      console.error('[JNI] Failed to cleanup thumbnail on delete:', e)
    }

    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${BOARD_TABLE_ID}/${id}`
    const response = await fetch(url, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
    })

    if (!response.ok) throw new Error(`Airtable Error: ${response.status}`)

    revalidateTag('board')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Board DELETE Error:', error)
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}
