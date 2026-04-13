import { uploadImage } from '@/lib/blob';

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('file');
  if (!file) return new Response('No file', { status: 400 });

  try {
    const imageUrl = await uploadImage(file);
    return new Response(JSON.stringify({ url: imageUrl }), { status: 200 });
  } catch (error) {
    console.error('Upload error:', error);
    return new Response('Upload failed', { status: 500 });
  }
}