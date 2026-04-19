import { uploadImage } from '@/utils/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    if (!file) return new Response('No file', { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileId = await uploadImage(buffer, file.name, file.type);
    return NextResponse.json({ url: `/api/images/${fileId}` }); // возвращаем URL для доступа
  } catch (error) {
    console.error('Upload error:', error);
    return new Response('Upload failed', { status: 500 });
  }
}