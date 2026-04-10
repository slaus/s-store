import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src', 'data.json');

function checkToken(req) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token');
  return token === process.env.ADMIN_SECRET_TOKEN;
}

export async function GET(req) {
  if (!checkToken(req)) return new Response('Неавторизовано', { status: 401 });
  const data = await fs.readFile(dataFilePath, 'utf8');
  return new Response(data, { status: 200, headers: { 'Content-Type': 'application/json' } });
}

export async function POST(req) {
  if (!checkToken(req)) return new Response('Неавторизовано', { status: 401 });
  const newProduct = await req.json();
  const current = JSON.parse(await fs.readFile(dataFilePath, 'utf8'));
  if (!newProduct.id) newProduct.id = Date.now().toString();
  current.push(newProduct);
  await fs.writeFile(dataFilePath, JSON.stringify(current, null, 2));
  return new Response(JSON.stringify(newProduct), { status: 201 });
}

export async function PUT(req) {
  if (!checkToken(req)) return new Response('Неавторизовано', { status: 401 });

  const url = new URL(req.url);
  const action = url.searchParams.get('action');

  // Переупорядочивание товаров (drag-and-drop)
  if (action === 'reorder') {
    const { products } = await req.json();
    if (!products || !Array.isArray(products)) {
      return new Response('Відсутній або недійсний масив продуктів', { status: 400 });
    }
    await fs.writeFile(dataFilePath, JSON.stringify(products, null, 2));
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }

  // Обычное обновление товара
  const updatedProduct = await req.json();
  const { id } = updatedProduct;
  if (!id) return new Response('Відсутній id', { status: 400 });

  let products = JSON.parse(await fs.readFile(dataFilePath, 'utf8'));
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return new Response('Не знайдено', { status: 404 });

  // Сливаем старый и новый объекты
  const current = products[index];
  const merged = { ...current, ...updatedProduct };

  // Если offerPrice === null – удаляем поле (акционная цена снята)
  if (merged.offerPrice === null) delete merged.offerPrice;

  // Если new === false – оставляем false (это допустимое значение)
  // Если new === true – оставляем true

  products[index] = merged;
  await fs.writeFile(dataFilePath, JSON.stringify(products, null, 2));
  return new Response(JSON.stringify(products[index]), { status: 200 });
}

export async function DELETE(req) {
  if (!checkToken(req)) return new Response('Неавторизовано', { status: 401 });
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) return new Response('Відсутній id', { status: 400 });
  let products = JSON.parse(await fs.readFile(dataFilePath, 'utf8'));
  const newProducts = products.filter(p => p.id !== id);
  if (products.length === newProducts.length) return new Response('Не знайдено', { status: 404 });
  await fs.writeFile(dataFilePath, JSON.stringify(newProducts, null, 2));
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}