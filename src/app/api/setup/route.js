import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  const client = await clientPromise;
  const db = client.db();

  await db.createCollection('products');
  await db.createCollection('categories');
  await db.createCollection('pages');
  await db.createCollection('site_settings');

  await db.collection('products').createIndex({ sku: 1 }, { unique: true, sparse: true });
  await db.collection('products').createIndex({ visible: 1 });
  await db.collection('products').createIndex({ categoryIds: 1 });

  await db.collection('categories').createIndex({ 'slug.uk': 1 }, { unique: true });
  await db.collection('categories').createIndex({ 'slug.en': 1 }, { unique: true });

  await db.collection('pages').createIndex({ 'slug.uk': 1 }, { unique: true });
  await db.collection('pages').createIndex({ 'slug.en': 1 }, { unique: true });

  await db.collection('site_settings').updateOne(
    { _id: 'main' },
    {
      $setOnInsert: {
        siteName: { uk: '', en: '' },
        description: { uk: '', en: '' },
        keywords: { uk: [], en: [] },
        metaTitle: { uk: '', en: '' },
        metaDescription: { uk: '', en: '' },
        logoUrl: '',
        faviconUrl: '',
        contactEmail: '',
        socialLinks: {}
      }
    },
    { upsert: true }
  );

  return NextResponse.json({ ok: true, message: 'Мультимовна база даних створена' });
}