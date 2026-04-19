import { getImageStream } from '@/utils/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    const { id } = params;
    const stream = await getImageStream(id);
    if (!stream) return new Response('Image not found', { status: 404 });

    // Определяем contentType из метаданных
    const bucket = (await import('@/utils/db')).getGridFSBucket();
    const files = await (await import('@/lib/mongodb')).default.db().collection('product_images.files').findOne({ _id: new ObjectId(id) });
    const contentType = files?.contentType || 'image/jpeg';

    return new Response(stream, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    console.error('Image serve error:', error);
    return new Response('Internal error', { status: 500 });
  }
}