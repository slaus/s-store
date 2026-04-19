import { getProducts, createProduct, updateProduct, deleteProduct, uploadImage, deleteImage } from '@/utils/db';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

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
    headers: {
      'Cache-Control': 'no-store, no-cache, max-age=0, must-revalidate',
    },
  });
}

function textResponse(message, status) {
  return new Response(message, { status });
}

export async function GET(req) {
  if (!checkToken(req)) return textResponse('Неавторизовано', 401);
  try {
    const products = await getProducts({}, { limit: 1000 });
    return jsonResponse(products);
  } catch (error) {
    console.error('GET admin error:', error);
    return textResponse('Помилка читання даних', 500);
  }
}

export async function POST(req) {
  if (!checkToken(req)) return textResponse('Неавторизовано', 401);
  try {
    const newProduct = await req.json();
    // Генерируем id, если нет (раньше было Date.now())
    if (!newProduct.id) newProduct.id = Date.now().toString();
    const result = await createProduct(newProduct);
    return jsonResponse(result, 201);
  } catch (error) {
    console.error('POST admin error:', error);
    return textResponse('Помилка додавання', 500);
  }
}

export async function PUT(req) {
  if (!checkToken(req)) return textResponse('Неавторизовано', 401);

  const url = new URL(req.url);
  const action = url.searchParams.get('action');

  try {
    if (action === 'reorder') {
      // Для сортировки – можно обновлять порядок товаров (если нужно)
      const { products: newProducts } = await req.json();
      if (!newProducts || !Array.isArray(newProducts)) {
        return textResponse('Некоректний масив товарів', 400);
      }
      // Обновляем порядок (например, поле order)
      const collection = (await import('@/utils/db')).then(m => m.getCollection('products'));
      for (let i = 0; i < newProducts.length; i++) {
        await (await collection).updateOne(
          { _id: new ObjectId(newProducts[i]._id) },
          { $set: { order: i } }
        );
      }
      return jsonResponse({ success: true });
    }

    const updatedProduct = await req.json();
    const { _id, id, img: newImg, ...updateData } = updatedProduct;
    if (!_id && !id) return textResponse('Відсутній id', 400);

    // Получаем старый товар, чтобы удалить старое изображение
    const oldProduct = await (await import('@/utils/db')).getProductById(_id || id);
    if (!oldProduct) return textResponse('Товар не знайдено', 404);

    // Если изображение изменилось, удаляем старое из GridFS
    if (oldProduct.img && newImg && oldProduct.img !== newImg) {
      await deleteImage(oldProduct.img);
    }

    // Обновляем
    await updateProduct(_id || id, { ...updateData, img: newImg });
    return jsonResponse({ success: true });
  } catch (error) {
    console.error('PUT admin error:', error);
    return textResponse('Помилка оновлення', 500);
  }
}

export async function DELETE(req) {
  if (!checkToken(req)) return textResponse('Неавторизовано', 401);

  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) return textResponse('Відсутній id', 400);

  try {
    await deleteProduct(id);
    return jsonResponse({ success: true });
  } catch (error) {
    console.error('DELETE admin error:', error);
    return textResponse('Помилка видалення', 500);
  }
}