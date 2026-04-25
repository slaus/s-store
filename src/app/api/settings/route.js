import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const ADMIN_TOKEN = process.env.ADMIN_SECRET_TOKEN;

export async function GET(req) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token');
  if (token !== ADMIN_TOKEN) {
    return new Response('Неавторизовано', { status: 401 });
  }
  try {
    const client = await clientPromise;
    const db = client.db();
    const settings = await db.collection('site_settings').findOne({ _id: 'main' });
    if (!settings) {
      return NextResponse.json({});
    }
    // Возвращаем сырой документ (с объектами для языков)
    return NextResponse.json(settings);
  } catch (error) {
    console.error('GET admin settings error:', error);
    return new Response('Помилка отримання налаштувань', { status: 500 });
  }
}

export async function PUT(req) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token');
  if (token !== ADMIN_TOKEN) {
    return new Response('Неавторизовано', { status: 401 });
  }
  try {
    const updates = await req.json();
    const client = await clientPromise;
    const db = client.db();
    await db.collection('site_settings').updateOne(
      { _id: 'main' },
      { $set: { ...updates, updatedAt: new Date() } },
      { upsert: true }
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PUT admin settings error:', error);
    return new Response('Помилка оновлення', { status: 500 });
  }
}