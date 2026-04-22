import { getProductBySku, createProduct, updateProduct, deleteProduct, deleteImage } from '@/utils/db';
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const ADMIN_TOKEN = process.env.ADMIN_SECRET_TOKEN;

function checkToken(req) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token');
  return token === ADMIN_TOKEN;
}

function jsonResponse(data, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { 'Cache-Control': 'no-store, no-cache, max-age=0, must-revalidate' },
  });
}

function textResponse(message, status) {
  return new Response(message, { status });
}

// GET – получить все товары с сортировкой по order
export async function GET(req) {
  if (!checkToken(req)) return textResponse('Неавторизовано', 401);
  try {
    const client = await clientPromise;
    const db = client.db();
    const products = await db.collection('products').find({}).sort({ order: 1, createdAt: -1 }).toArray();
    const formatted = products.map(p => ({ ...p, _id: p._id.toString() }));
    return jsonResponse(formatted);
  } catch (error) {
    console.error('GET admin error:', error);
    return textResponse('Помилка читання даних', 500);
  }
}

// POST – создать товар
export async function POST(req) {
  if (!checkToken(req)) return textResponse('Неавторизовано', 401);
  try {
    const newProduct = await req.json();
    if (!newProduct.sku) newProduct.sku = Date.now().toString();
    const result = await createProduct(newProduct);
    return jsonResponse(result, 201);
  } catch (error) {
    console.error('POST admin error:', error);
    return textResponse('Помилка додавання', 500);
  }
}

// PUT – обновление или сортировка
export async function PUT(req) {
  if (!checkToken(req)) return textResponse('Неавторизовано', 401);
  const url = new URL(req.url);
  const action = url.searchParams.get('action');

  try {
    if (action === 'reorder') {
      const { products: newProducts } = await req.json();
      if (!newProducts || !Array.isArray(newProducts)) {
        return textResponse('Некоректний масив товарів', 400);
      }
      const client = await clientPromise;
      const db = client.db();
      const collection = db.collection('products');
      for (let i = 0; i < newProducts.length; i++) {
        const sku = newProducts[i].sku;
        if (sku) {
          await collection.updateOne({ sku }, { $set: { order: i } });
        }
      }
      return jsonResponse({ success: true });
    }

    const updatedProduct = await req.json();
    const { sku, img: newImg, ...updateData } = updatedProduct;
    if (!sku) return textResponse('Відсутній sku', 400);

    const oldProduct = await getProductBySku(sku);
    if (!oldProduct) return textResponse('Товар не знайдено', 404);

    if (oldProduct.images?.[0] && newImg && oldProduct.images[0] !== newImg) {
      const oldFileId = oldProduct.images[0].split('/').pop();
      await deleteImage(oldFileId);
    }

    const updatePayload = { ...updateData };
    if (newImg) updatePayload.images = [newImg];
    await updateProduct(sku, updatePayload);
    return jsonResponse({ success: true });
  } catch (error) {
    console.error('PUT admin error:', error);
    return textResponse('Помилка оновлення', 500);
  }
}

// DELETE – удалить товар по sku
export async function DELETE(req) {
  if (!checkToken(req)) return textResponse('Неавторизовано', 401);
  const url = new URL(req.url);
  const sku = url.searchParams.get('sku');
  if (!sku) return textResponse('Відсутній sku', 400);
  try {
    const deleted = await deleteProduct(sku);
    if (!deleted) return textResponse('Товар не знайдено', 404);
    return jsonResponse({ success: true });
  } catch (error) {
    console.error('DELETE admin error:', error);
    return textResponse('Помилка видалення', 500);
  }
}