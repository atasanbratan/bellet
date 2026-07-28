import { readFile } from 'fs/promises';
import { join } from 'path';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

/**
 * Uploads the demo cover images to MinIO and returns their public URLs, keyed
 * by filename. Files ship in `demo-assets/` rather than being fetched at seed
 * time, so seeding needs no internet and stays reproducible.
 *
 * Keys are stable, so re-seeding overwrites instead of piling up new objects.
 */
const ASSETS = [
  'classroom.jpg',
  'lobby.jpg',
  'computer-lab.jpg',
  'language-lab.jpg',
  'music-room.jpg',
  'art-studio.jpg',
  'study-desk.jpg',
  'seminar.jpg',
  'coding.jpg',
] as const;

export type DemoPhoto = (typeof ASSETS)[number];

export async function seedDemoPhotos(): Promise<Record<string, string>> {
  const endpoint = (process.env.S3_ENDPOINT ?? 'http://localhost:9000').replace(
    /\/$/,
    '',
  );
  const bucket = process.env.S3_BUCKET ?? 'bellet';
  const client = new S3Client({
    region: process.env.S3_REGION ?? 'us-east-1',
    endpoint,
    forcePathStyle: (process.env.S3_USE_PATH_STYLE ?? 'true') === 'true',
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY ?? 'minioadmin',
      secretAccessKey: process.env.S3_SECRET_KEY ?? 'minioadmin',
    },
  });

  const urls: Record<string, string> = {};
  for (const name of ASSETS) {
    const key = `businesses/demo/${name}`;
    const body = await readFile(join(__dirname, 'demo-assets', name));
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: 'image/jpeg',
      }),
    );
    urls[name] = `${endpoint}/${bucket}/${key}`;
  }
  return urls;
}
