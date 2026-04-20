import { getImageStream } from '@/utils/db';

export async function GET(req, { params }) {
  const { id } = await params;
  try {
    const stream = await getImageStream(id);
    if (!stream) {
      return new Response('Image not found', { status: 404 });
    }
    return new Response(stream, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    console.error('Image serve error:', error);
    return new Response('Internal error', { status: 500 });
  }
}