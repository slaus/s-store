import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  
  await db.collection('products').drop().catch(() => {});
  await db.collection('categories').drop().catch(() => {});
  await db.collection('pages').drop().catch(() => {});
  await db.collection('site_settings').drop().catch(() => {});
  
  return NextResponse.json({ ok: true, message: 'Коллекции удалены' });
}