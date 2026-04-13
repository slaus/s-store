import { put, list, del, head } from '@vercel/blob';

// Ключі для Blob
const DATA_FILE_KEY = 'json/data.json';
const IMAGES_PREFIX = 'images/';

/**
 * Отримати всі продукти з Blob
 * @returns {Promise<Array>}
 */
export async function getProducts() {
  try {
    const { url } = await head(DATA_FILE_KEY);
    const res = await fetch(url);
    const products = await res.json();
    return products;
  } catch (error) {
    console.error('Помилка читання data.json з Blob:', error);
    return [];
  }
}

/**
 * Зберегти весь масив продуктів у Blob (перезапис)
 * @param {Array} products
 */
export async function saveProducts(products) {
  const blob = await put(DATA_FILE_KEY, JSON.stringify(products, null, 2), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  return blob;
}

/**
 * Завантажити зображення в Blob (з форми)
 * @param {File} file - файл з <input type="file">
 * @returns {Promise<string>} - публічний URL зображення
 */
export async function uploadImage(file) {
  // Додаємо timestamp, щоб уникнути кешування і колізій
  const uniqueName = `${IMAGES_PREFIX}${Date.now()}-${file.name}`;
  const blob = await put(uniqueName, file, {
    access: 'public',
  });
  return blob.url;
}

/**
 * Видалити зображення з Blob за його URL
 * @param {string} imageUrl
 */
export async function deleteImageByUrl(imageUrl) {
  if (!imageUrl) return;
  // Виділяємо ключ з URL (частину після .com/)
  const urlObj = new URL(imageUrl);
  const key = urlObj.pathname.slice(1); // прибираємо перший слеш
  await del(key);
}

/**
 * Отримати список всіх зображень у Blob (для міграції або налагодження)
 */
export async function listAllImages() {
  const blobs = await list({ prefix: IMAGES_PREFIX });
  return blobs.blobs;
}