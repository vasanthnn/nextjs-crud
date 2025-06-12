// lib/s3.js
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid';

const s3 = new S3Client({
  region: "us-east-1", 
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

export async function uploadImageToS3(fileBuffer, fileName, mimeType) {
  const uniqueName = `${uuidv4()}-${fileName}`;
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: uniqueName,
    Body: fileBuffer,
    ContentType: mimeType,
    ACL: 'public-read' 
  });

  await s3.send(command);
  return `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${uniqueName}`;
}
