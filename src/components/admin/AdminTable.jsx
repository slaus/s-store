"use client";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableRow from "./SortableRow";
import styles from "./admin-table.module.css";
import { useTranslations } from "next-intl";

export default function AdminTable({ products, onEdit, onDelete, onDragEnd, locale }) {
  const t = useTranslations("admin");
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const validProducts = products.filter((p) => p.sku);
  if (validProducts.length !== products.length) {
    console.warn("Обнаружены товары без sku:", products.filter((p) => !p.sku));
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext
        items={validProducts.map((p) => p.sku)}
        strategy={verticalListSortingStrategy}
      >
        {validProducts?.length === 0 ? (
          <div className={styles.error}>
            <h3>{t("no_product_title")}</h3>
            <p>{t("no_product")}</p>
          </div>
        ) : (
          <table className={styles._}>
            <thead>
              <tr>
                <th>🟰</th>
                <th>SKU</th>
                <th>{t("name")}</th>
                <th>{t("price")}</th>
                <th>{t("offer")}</th>
                <th>{t("last")}</th>
                <th>{t("visible")}</th>
                <th>{t("category")}</th>
                <th>{t("image")}</th>
                <th>{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {validProducts.map((product, index) => (
                <SortableRow
                  key={product.sku || `key-${index}`}
                  product={product}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  locale={locale}
                />
              ))}
            </tbody>
          </table>
        )}
      </SortableContext>
    </DndContext>
  );
}