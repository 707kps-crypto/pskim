import { NextRequest, NextResponse } from 'next/server'
import Airtable, { FieldSet } from 'airtable'
import { deleteR2Image } from '@/lib/r2'

const AIRTABLE_BASE_ID = 'appxU3n3KqoUr3l9e'
const POPUPS_TABLE_ID = 'tblR8MQ99w26nBHJN'

function getBase() {
  const token = process.env.AIRTABLE_TOKEN
  if (!token) throw new Error('AIRTABLE_TOKEN not configured')
  return new Airtable({ apiKey: token }).base(AIRTABLE_BASE_ID)
}

function getKSTDateString(): string {
  const now = new Date()
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  return kst.toISOString().split('T')[0]
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const all = searchParams.get('all')

    const base = getBase()
    const records: Record<string, unknown>[] = []

    const today = getKSTDateString()

    await new Promise<void>((resolve, reject) => {
      const queryOptions: Record<string, unknown> = {
        sort: [{ field: '순서', direction: 'asc' }],
      }

      // all=true면 전체 목록 (관리자용), 아니면 공개용 필터
      if (!all) {
        queryOptions.filterByFormula =
          `AND({활성여부} = TRUE(), OR({시작일} = '', {시작일} <= '${today}'), OR({종료일} = '', {종료일} >= '${today}'))`
      }

      base(POPUPS_TABLE_ID)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .select(queryOptions as any)
        .eachPage(
          (pageRecords, fetchNextPage) => {
            pageRecords.forEach((record) => {
              records.push({
                id: record.id,
                제목: record.get('제목') || '',
                ALT텍스트: record.get('ALT텍스트') || '',
                이미지URL: record.get('이미지URL') || '',
                링크URL: record.get('링크URL') || '',
                링크타겟: record.get('링크타겟') || '_blank',
                순서: record.get('순서') || 0,
                활성여부: record.get('활성여부') === true,
                시작일: record.get('시작일') || '',
                종료일: record.get('종료일') || '',
              })
            })
            fetchNextPage()
          },
          (err) => {
            if (err) reject(err)
            else resolve()
          }
        )
    })

    return NextResponse.json({ success: true, popups: records })
  } catch (error) {
    console.error('[JNI] Popups GET error:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 제목, ALT텍스트, 이미지URL, 링크URL, 링크타겟, 순서, 활성여부, 시작일, 종료일 } = body

    if (!제목 || !이미지URL) {
      return NextResponse.json(
        { success: false, error: '제목과 이미지URL은 필수입니다.' },
        { status: 400 }
      )
    }

    const base = getBase()
    const fields: Record<string, unknown> = {
      제목,
      이미지URL,
    }

    if (ALT텍스트) fields['ALT텍스트'] = ALT텍스트
    if (링크URL) fields['링크URL'] = 링크URL
    if (링크타겟) fields['링크타겟'] = 링크타겟
    if (순서 !== undefined) fields['순서'] = Number(순서)
    if (활성여부 !== undefined) fields['활성여부'] = 활성여부
    if (시작일) fields['시작일'] = 시작일
    if (종료일) fields['종료일'] = 종료일

    const record = await base(POPUPS_TABLE_ID).create(fields as Partial<FieldSet>)

    return NextResponse.json({ success: true, id: record.id })
  } catch (error) {
    console.error('[JNI] Popups POST error:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID가 필요합니다.' },
        { status: 400 }
      )
    }

    const base = getBase()

    // 이미지URL이 변경된 경우, 기존 이미지를 R2에서 삭제
    if (updateData.이미지URL !== undefined) {
      try {
        const oldRecord = await base(POPUPS_TABLE_ID).find(id)
        const oldImageUrl = oldRecord.get('이미지URL') as string | undefined
        if (oldImageUrl && oldImageUrl !== updateData.이미지URL) {
          await deleteR2Image(oldImageUrl)
        }
      } catch (e) {
        console.error('[JNI] Failed to cleanup old popup image:', e)
      }
    }

    const fields: Record<string, unknown> = {}

    if (updateData.제목 !== undefined) fields['제목'] = updateData.제목
    if (updateData.ALT텍스트 !== undefined) fields['ALT텍스트'] = updateData.ALT텍스트
    if (updateData.이미지URL !== undefined) fields['이미지URL'] = updateData.이미지URL
    if (updateData.링크URL !== undefined) fields['링크URL'] = updateData.링크URL
    if (updateData.링크타겟 !== undefined) fields['링크타겟'] = updateData.링크타겟
    if (updateData.순서 !== undefined) fields['순서'] = Number(updateData.순서)
    if (updateData.활성여부 !== undefined) fields['활성여부'] = updateData.활성여부
    if (updateData.시작일 !== undefined) fields['시작일'] = updateData.시작일
    if (updateData.종료일 !== undefined) fields['종료일'] = updateData.종료일

    await base(POPUPS_TABLE_ID).update(id, fields)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[JNI] Popups PUT error:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID가 필요합니다.' },
        { status: 400 }
      )
    }

    const base = getBase()

    // 삭제 전 기존 이미지 URL을 가져와서 R2에서 삭제
    try {
      const record = await base(POPUPS_TABLE_ID).find(id)
      const imageUrl = record.get('이미지URL') as string | undefined
      if (imageUrl) {
        await deleteR2Image(imageUrl)
      }
    } catch (e) {
      console.error('[JNI] Failed to cleanup popup image on delete:', e)
    }

    await base(POPUPS_TABLE_ID).destroy(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[JNI] Popups DELETE error:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
