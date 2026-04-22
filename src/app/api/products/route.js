import { getProducts } from '@/utils/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('lang') || 'uk';
  const limit = parseInt(searchParams.get('limit') || '100');
  const skip = parseInt(searchParams.get('skip') || '0');
  const visibleOnly = searchParams.get('visible') !== 'false';

  try {
    const filters = visibleOnly ? { visible: true } : {};
    const options = { limit, skip, sort: { order: 1, createdAt: -1 } };
    const products = await getProducts(locale, filters, options);
    const withImg = products.map(p => ({
      ...p,
      img: p.images?.[0] || ''
    }));
    return NextResponse.json(withImg, {
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to load products' }, { status: 500 });
  }
}