"use client";
import { useState } from "react";
import styles from "./ProductForm.module.css";

export default function ProductForm({
  editingId,
  formData,
  setFormData,
  onSave,
  onCancel,
  uploading,
  onImageUpload,
}) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSave();
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2>{editingId === "new" ? "Новий товар" : "Редагування товару"}</h2>

      <div className={styles.field}>
        <label>ID (тільки для нового):</label>
        <input
          type="text"
          value={formData.id}
          onChange={(e) => setFormData({ ...formData, id: e.target.value })}
          disabled={editingId !== "new"}
          required
        />
      </div>

      <div className={styles.field}>
        <label>Назва:</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div className={styles.field}>
        <label>Ціна (грн.):</label>
        <input
          type="number"
          value={formData.price}
          onChange={(e) =>
            setFormData({ ...formData, price: +e.target.value })
          }
          required
        />
      </div>

      <div className={styles.field}>
        <label>Акційна ціна (грн., порожньо якщо ні):</label>
        <input
          type="number"
          value={formData.offerPrice}
          onChange={(e) =>
            setFormData({ ...formData, offerPrice: e.target.value })
          }
        />
      </div>

      <div className={styles.fieldCheckbox}>
        <label>
          <input
            type="checkbox"
            checked={formData.new}
            onChange={(e) =>
              setFormData({ ...formData, new: e.target.checked })
            }
          />
          Новинка
        </label>
      </div>

      <div className={styles.field}>
        <label>Залишок:</label>
        <input
          type="number"
          value={formData.stock}
          onChange={(e) =>
            setFormData({ ...formData, stock: +e.target.value })
          }
          required
        />
      </div>

      <div className={styles.field}>
        <label>Категорія:</label>
        <input
          type="text"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          required
        />
      </div>

      <div className={styles.field}>
        <label>Фото:</label>
        <input
          type="file"
          accept="image/*"
          onChange={onImageUpload}
          disabled={uploading}
        />
        {uploading && <span className={styles.uploading}> Завантаження...</span>}
        {formData.img && (
          <div className={styles.currentImage}>
            <span>Поточне: {formData.img}</span>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, img: "" })}
              className={styles.deleteImageBtn}
              title="Видалити фото"
            >
              🗑️
            </button>
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <button type="submit" disabled={loading}>
          {loading ? "Збереження..." : "Зберегти"}
        </button>
        <button type="button" onClick={onCancel}>
          Скасувати
        </button>
      </div>
    </form>
  );
}