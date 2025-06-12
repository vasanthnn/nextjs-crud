import { NextResponse } from 'next/server';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import crypto from 'crypto';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
});

const randomFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('file');

  if (!file) return NextResponse.json({ error: 'File missing' }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = randomFileName();
  const ext = file.name.split('.').pop();
  const key = `tasks/${fileName}.${ext}`;

await s3.send(new PutObjectCommand({
  Bucket: process.env.AWS_BUCKET_NAME,
  Key: key,
  Body: buffer,
  ContentType: file.type
}));



  const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

  return NextResponse.json({ url: imageUrl });
}
