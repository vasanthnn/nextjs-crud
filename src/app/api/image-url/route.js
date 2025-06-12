import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({
  region: 'us-east-1',
});

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');

  if (!key) {
    return new Response(JSON.stringify({ error: 'Missing key' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const command = new GetObjectCommand({
      Bucket: 'vasanthan-bucket-20250611-u8c9p7q2m1vzxk',
      Key: key.replace(/^https:\/\/[^/]+\/?/, ''), 
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 300 });

    return new Response(JSON.stringify({ url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error generating signed URL:', err);
    return new Response(JSON.stringify({ error: 'Failed to generate signed URL' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
