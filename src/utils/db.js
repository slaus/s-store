import clientPromise from '@/lib/mongodb';
import { ObjectId, GridFSBucket } from 'mongodb';

async function getDb() {
  const client = await clientPromise;
  return client.db();
}

async function getCollection(name) {
  const db = await getDb();
  return db.collection(name);
}

export async function getProducts(filters = {}, options = {}) {
  const collection = await getCollection('products');
  const { limit = 100, skip = 0, sort = { createdAt: -1 } } = options;
  const products = await collection.find(filters).sort(sort).skip(skip).limit(limit).toArray();
  return products.map(p => ({ ...p, _id: p._id.toString() }));
}

export async function getProductById(id) {
  const collection = await getCollection('products');
  const product = await collection.findOne({ id: id });
  return product ? { ...product, _id: product._id.toString() } : null;
}

export async function createProduct(productData) {
  const collection = await getCollection('products');
  const now = new Date();
  const id = productData.id || Date.now().toString();
  const newProduct = {
    ...productData,
    id,
    createdAt: now,
    updatedAt: now,
  };
  const result = await collection.insertOne(newProduct);
  return { ...newProduct, _id: result.insertedId.toString() };
}

export async function updateProduct(id, updates) {
  const collection = await getCollection('products');
  const result = await collection.updateOne(
    { id: id },
    { $set: { ...updates, updatedAt: new Date() } }
  );
  return result.modifiedCount > 0;
}

export async function deleteProduct(id) {
  const collection = await getCollection('products');
  const product = await collection.findOne({ id: id });
  if (product && product.img) {
    await deleteImage(product.img);
  }
  const result = await collection.deleteOne({ id: id });
  return result.deletedCount > 0;
}

// ========== Изображения (GridFS) ==========
let gfsBucket = null;

async function getGridFSBucket() {
  if (gfsBucket) return gfsBucket;
  const db = await getDb();
  gfsBucket = new GridFSBucket(db, { bucketName: 'product_images' });
  return gfsBucket;
}

// Загрузка изображения в GridFS, возвращает fileId (строка)
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

// Удаление изображения по fileId
export async function deleteImage(fileId) {
  if (!fileId) return;
  const bucket = await getGridFSBucket();
  try {
    await bucket.delete(new ObjectId(fileId));
  } catch (err) {
    console.error('Ошибка удаления изображения:', err);
  }
}

// Получение изображения для отдачи (для API /api/images/[id])
export async function getImageStream(fileId) {
  const bucket = await getGridFSBucket();
  return bucket.openDownloadStream(new ObjectId(fileId));
}