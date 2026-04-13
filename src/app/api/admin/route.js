import { getProducts, saveProducts, uploadImage, deleteImageByUrl } from '@/lib/blob';
import { NextResponse } from 'next/server';

// Забороняємо кешування на рівні Next.js
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const ADMIN_TOKEN = process.env.ADMIN_SECRET_TOKEN;

function checkToken(req) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token');
  return token === ADMIN_TOKEN;
}

// Допоміжні функції для додавання заголовків no-cache
function jsonResponse(data, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      'Cache-Control': 'no-store, no-cache, max-age=0, must-revalidate',
      'Pragma': 'no-cache',
    },
  });
}

function textResponse(message, status) {
  return new Response(message, {
    status,
    headers: {
      'Cache-Control': 'no-store, no-cache, max-age=0, must-revalidate',
      'Pragma': 'no-cache',
    },
  });
}

export async function GET(req) {
  if (!checkToken(req)) {
    return textResponse('Неавторизовано', 401);
  }
  try {
    const products = await getProducts();
    return jsonResponse(products);
  } catch (error) {
    console.error('GET помилка:', error);
    return textResponse('Помилка читання даних', 500);
  }
}

export async function POST(req) {
  if (!checkToken(req)) {
    return textResponse('Неавторизовано', 401);
  }
  try {
    const newProduct = await req.json();
    const products = await getProducts();
    if (!newProduct.id) newProduct.id = Date.now().toString();
    products.push(newProduct);
    await saveProducts(products);
    return jsonResponse(newProduct, 201);
  } catch (error) {
    console.error('POST помилка:', error);
    return textResponse('Помилка додавання', 500);
  }
}

export async function PUT(req) {
  if (!checkToken(req)) {
    return textResponse('Неавторизовано', 401);
  }

  const url = new URL(req.url);
  const action = url.searchParams.get('action');

  try {
    let products = await getProducts();

    if (action === 'reorder') {
      const { products: newProducts } = await req.json();
      if (!newProducts || !Array.isArray(newProducts)) {
        return textResponse('Відсутній або недійсний масив продуктів', 400);
      }
      await saveProducts(newProducts);
      return jsonResponse({ success: true });
    }

    const updatedProduct = await req.json();
    const { id } = updatedProduct;
    if (!id) return textResponse('Відсутній id', 400);

    const index = products.findIndex(p => p.id === id);
    if (index === -1) return textResponse('Не знайдено', 404);

    const oldProduct = products[index];
    const oldImg = oldProduct.img;
    const newImg = updatedProduct.img;

    if (oldImg && (newImg === undefined || newImg === "" || newImg !== oldImg)) {
      if (oldImg.startsWith('http')) {
        await deleteImageByUrl(oldImg);
      } else {
        console.warn(`Старе зображення "${oldImg}" не є Blob URL – не видаляємо автоматично`);
      }
    }

    const merged = { ...oldProduct, ...updatedProduct };
    if (merged.offerPrice === null) delete merged.offerPrice;

    products[index] = merged;
    await saveProducts(products);
    return jsonResponse(products[index]);
  } catch (error) {
    console.error('PUT помилка:', error);
    return textResponse('Помилка оновлення', 500);
  }
}

export async function DELETE(req) {
  if (!checkToken(req)) {
    return textResponse('Неавторизовано', 401);
  }

  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) return textResponse('Відсутній id', 400);

  try {
    let products = await getProducts();
    const productToDelete = products.find(p => p.id === id);
    if (!productToDelete) return textResponse('Не знайдено', 404);

    if (productToDelete.img && productToDelete.img.startsWith('http')) {
      await deleteImageByUrl(productToDelete.img);
    }

    const newProducts = products.filter(p => p.id !== id);
    await saveProducts(newProducts);
    return jsonResponse({ success: true });
  } catch (error) {
    console.error('DELETE помилка:', error);
    return textResponse('Помилка видалення', 500);
  }
}