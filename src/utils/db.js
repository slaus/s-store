import clientPromise from '@/lib/mongodb';
import { ObjectId, GridFSBucket } from 'mongodb';

// ========== Вспомогательные функции ==========
async function getDb() {
  const client = await clientPromise;
  return client.db(); // имя базы из URI
}

async function getCollection(name) {
  const db = await getDb();
  return db.collection(name);
}

// ========== Товары (мультиязычные) ==========

/**
 * Получить список товаров с учётом локали.
 * @param {string} locale - 'uk' или 'en'
 * @param {object} filters - дополнительные фильтры (например, { visible: true })
 * @param {object} options - { limit, skip, sort }
 */
export async function getProducts(locale = 'uk', filters = {}, options = {}) {
  const collection = await getCollection('products');
  const { limit = 100, skip = 0, sort = { createdAt: -1 } } = options;
  const products = await collection.find(filters).sort(sort).skip(skip).limit(limit).toArray();
  return products.map(p => ({
    ...p,
    _id: p._id.toString(),
    title: p.title?.[locale] || p.title?.uk || '',
    description: p.description?.[locale] || p.description?.uk || '',
    category: p.category?.[locale] || p.category?.uk || '', 
    metaTitle: p.metaTitle?.[locale] || p.metaTitle?.uk || '',
    metaDescription: p.metaDescription?.[locale] || p.metaDescription?.uk || '',
    metaKeywords: p.metaKeywords?.[locale] || p.metaKeywords?.uk || [],
  }));
}

/**
 * Получить полный документ товара по sku (без трансформации локали)
 */
export async function getProductBySku(sku) {
  const collection = await getCollection('products');
  const product = await collection.findOne({ sku });
  return product ? { ...product, _id: product._id.toString() } : null;
}

/**
 * Создать новый товар.
 * Ожидается объект data, содержащий:
 *   sku (опционально, иначе генерируется),
 *   title: { uk, en },
 *   description: { uk, en } (опционально),
 *   price, salePrice, isNew, visible, categoryIds, images, metaTitle, metaDescription, metaKeywords
 */
export async function createProduct(data) {
  const collection = await getCollection('products');
  const now = new Date();
  const sku = data.sku || Date.now().toString();
  const newProduct = {
    ...data,
    sku,
    createdAt: now,
    updatedAt: now,
  };
  const result = await collection.insertOne(newProduct);
  return { ...newProduct, _id: result.insertedId.toString() };
}

/**
 * Обновить товар по sku.
 * @param {string} sku
 * @param {object} updates - любые поля для обновления (включая вложенные объекты)
 */
export async function updateProduct(sku, updates) {
  const collection = await getCollection('products');
  const result = await collection.updateOne(
    { sku },
    { $set: { ...updates, updatedAt: new Date() } }
  );
  return result.modifiedCount > 0;
}

/**
 * Удалить товар по sku (и связанное изображение из GridFS, если есть)
 */
export async function deleteProduct(sku) {
  const collection = await getCollection('products');
  const product = await collection.findOne({ sku });
  if (product && product.images && product.images.length) {
    for (const imgUrl of product.images) {
      // извлекаем fileId из URL /api/images/{id}
      const match = imgUrl.match(/\/api\/images\/(.+)$/);
      if (match) await deleteImage(match[1]);
    }
  }
  const result = await collection.deleteOne({ sku });
  return result.deletedCount > 0;
}

// ========== Категории (мультиязычные) – аналогично ==========
export async function getCategories(locale = 'uk', filters = {}) {
  const collection = await getCollection('categories');
  const categories = await collection.find(filters).toArray();
  return categories.map(c => ({
    ...c,
    _id: c._id.toString(),
    name: c.name?.[locale] || c.name?.uk || '',
    description: c.description?.[locale] || c.description?.uk || '',
    slug: c.slug?.[locale] || c.slug?.uk || '',
    metaTitle: c.metaTitle?.[locale] || c.metaTitle?.uk || '',
    metaDescription: c.metaDescription?.[locale] || c.metaDescription?.uk || '',
  }));
}

export async function getCategoryBySlug(slug, locale) { /* ... */ }
export async function createCategory(data) { /* ... */ }
export async function updateCategory(id, updates) { /* ... */ }
export async function deleteCategory(id) { /* ... */ }

// ========== Страницы (мультиязычные) – аналогично ==========
export async function getPages(locale = 'uk', filters = {}) {
  const collection = await getCollection('pages');
  const pages = await collection.find(filters).toArray();
  return pages.map(p => ({
    ...p,
    _id: p._id.toString(),
    title: p.title?.[locale] || p.title?.uk || '',
    content: p.content?.[locale] || p.content?.uk || '',
    metaTitle: p.metaTitle?.[locale] || p.metaTitle?.uk || '',
    metaDescription: p.metaDescription?.[locale] || p.metaDescription?.uk || '',
  }));
}

// ========== Настройки сайта ==========
export async function getSiteSettings(locale = 'uk') {
  const collection = await getCollection('site_settings');
  const settings = await collection.findOne({ _id: 'main' });
  if (!settings) return null;
  return {
    ...settings,
    siteName: settings.siteName?.[locale] || settings.siteName?.uk || '',
    description: settings.description?.[locale] || settings.description?.uk || '',
    keywords: settings.keywords?.[locale] || settings.keywords?.uk || [],
    metaTitle: settings.metaTitle?.[locale] || settings.metaTitle?.uk || '',
    metaDescription: settings.metaDescription?.[locale] || settings.metaDescription?.uk || '',
  };
}

export async function updateSiteSettings(updates) {
  const collection = await getCollection('site_settings');
  const result = await collection.updateOne(
    { _id: 'main' },
    { $set: { ...updates, updatedAt: new Date() } },
    { upsert: true }
  );
  return result.modifiedCount > 0;
}

// ========== Изображения (GridFS) – без изменений ==========
let gfsBucket = null;

async function getGridFSBucket() {
  if (gfsBucket) return gfsBucket;
  const db = await getDb();
  gfsBucket = new GridFSBucket(db, { bucketName: 'product_images' });
  return gfsBucket;
}

export async function uploadImage(fileBuffer, originalName, mimeType) {
  const bucket = await getGridFSBucket();
  const uploadStream = bucket.openUploadStream(originalName, {
    contentType: mimeType,
    metadata: { originalName, uploadDate: new Date() }
  });
  uploadStream.end(fileBuffer);
  return new Promise((resolve, reject) => {
    uploadStream.on('finish', () => resolve(uploadStream.id.toString()));
    uploadStream.on('error', reject);
  });
}

export async function deleteImage(fileId) {
  if (!fileId) return;
  const bucket = await getGridFSBucket();
  try {
    await bucket.delete(new ObjectId(fileId));
  } catch (err) {
    console.error('Ошибка удаления изображения:', err);
  }
}

export async function getImageStream(fileId) {
  const bucket = await getGridFSBucket();
  return bucket.openDownloadStream(new ObjectId(fileId));
}