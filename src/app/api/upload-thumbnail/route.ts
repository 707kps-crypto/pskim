import { NextRequest, NextResponse } from 'next/server'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getS3Client, deleteR2Image } from '@/lib/r2'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { image, filename } = body

    if (!image) {
      return NextResponse.json(
        { success: false, error: '이미지 데이터가 필요합니다.' },
        { status: 400 }
      )
    }

    const bucketName = process.env.R2_BUCKET_NAME
    const publicUrl = process.env.R2_PUBLIC_URL

    if (!bucketName || !publicUrl) {
      throw new Error('R2_BUCKET_NAME 또는 R2_PUBLIC_URL이 설정되지 않았습니다.')
    }

    // base64 데이터 파싱 (data:image/xxx;base64,... 형태 지원)
    let base64Data = image
    let contentType = 'image/webp'

    if (image.startsWith('data:')) {
      const matches = image.match(/^data:(.+?);base64,(.+)$/)
      if (matches) {
        contentType = matches[1]
        base64Data = matches[2]
      }
    }

    const buffer = Buffer.from(base64Data, 'base64')

    // 파일명 생성: thumbnails/{timestamp}_{random}.webp
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    const ext = filename ? filename.split('.').pop() || 'webp' : 'webp'
    const key = `thumbnails/${timestamp}_${random}.${ext}`

    const s3 = getS3Client()
    await s3.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      })
    )

    // publicUrl 끝에 / 가 없으면 추가
    const baseUrl = publicUrl.endsWith('/') ? publicUrl : publicUrl + '/'
    const url = baseUrl + key

    return NextResponse.json({ success: true, url })
  } catch (error) {
    console.error('[JNI] Upload thumbnail error:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'URL이 필요합니다.' },
        { status: 400 }
      )
    }

    const deleted = await deleteR2Image(url)

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 R2 URL이거나 삭제에 실패했습니다.' },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[JNI] Delete thumbnail error:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
