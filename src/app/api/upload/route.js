import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('file');
  if (!file) return new Response('No file', { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = path.extname(file.name);
  const filename = `${Date.now()}${ext}`;
  const uploadDir = path.join(process.cwd(), 'public', 'images');
  await mkdir(uploadDir, { recursive: true });
  const filepath = path.join(uploadDir, filename);
  await writeFile(filepath, buffer);
  return new Response(JSON.stringify({ filename }), { status: 200 });
}