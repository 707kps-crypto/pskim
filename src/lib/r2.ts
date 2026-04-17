import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'

export function getS3Client() {
  const accountId = process.env.R2_ACCOUNT_ID
  const accessKeyId = process.env.R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error('R2 환경변수가 설정되지 않았습니다.')
  }

  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  })
}

/**
 * R2에서 이미지를 삭제합니다.
 * URL에서 R2 키를 추출하여 삭제합니다.
 * R2 URL이 아니거나 빈 값이면 무시합니다.
 */
export async function deleteR2Image(url: string): Promise<boolean> {
  if (!url) return false

  const publicUrl = process.env.R2_PUBLIC_URL || ''
  if (!publicUrl || !url.startsWith(publicUrl)) return false

  const baseUrl = publicUrl.endsWith('/') ? publicUrl : publicUrl + '/'
  const key = url.replace(baseUrl, '')

  if (!key || key === url) return false

  try {
    const s3 = getS3Client()
    const bucketName = process.env.R2_BUCKET_NAME

    if (!bucketName) {
      console.error('[JNI] R2_BUCKET_NAME not configured')
      return false
    }

    await s3.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      })
    )
    console.log(`[JNI] Deleted R2 image: ${key}`)
    return true
  } catch (error) {
    console.error('[JNI] Failed to delete R2 image:', error)
    return false
  }
}
