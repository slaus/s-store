import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  
  // Создаём коллекции (они создадутся автоматически при вставке, но можно явно)
  await db.createCollection('products');
  await db.createCollection('categories');
  await db.createCollection('pages');
  await db.createCollection('site_settings');
  
  // Индексы для товаров
  await db.collection('products').createIndex({ sku: 1 }, { unique: true, sparse: true });
  await db.collection('products').createIndex({ visible: 1 });
  await db.collection('products').createIndex({ categoryIds: 1 });
  
  // Индексы для категорий
  await db.collection('categories').createIndex({ slug: 1 }, { unique: true });
  
  // Индексы для страниц
  await db.collection('pages').createIndex({ slug: 1 }, { unique: true });
  
  // Настройки сайта – один документ
  await db.collection('site_settings').updateOne(
    { _id: 'main' },
    { $setOnInsert: { siteName: 'Мій магазин', description: '', keywords: [], logoUrl: '' } },
    { upsert: true }
  );
  
  return NextResponse.json({ ok: true, message: 'База даних ініціалізована' });
}