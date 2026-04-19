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
import styles from "./AdminTable.module.css";
import { useTranslations } from "next-intl";

export default function AdminTable({ products, onEdit, onDelete, onDragEnd }) {
  const t = useTranslations('admin');
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const validProducts = products.filter(p => p.id);
  if (validProducts.length !== products.length) {
    console.warn('Обнаружены товары без id:', products.filter(p => !p.id));
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext
        items={validProducts.map((p) => p.id)}
        strategy={verticalListSortingStrategy}
      >
        <table className={styles._}>
          <thead>
            <tr>
              <th>🟰</th>
              <th>ID</th>
              <th>{t('name')}</th>
              <th>{t('price')}</th>
              <th>{t('offer')}</th>
              <th>{t('last')}</th>
              <th>{t('visible')}</th>
              <th>{t('category')}</th>
              <th>{t('image')}</th>
              <th>{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {validProducts.map((product, index) => (
              <SortableRow
                key={product.id || `key-${index}`}
                product={product}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </SortableContext>
    </DndContext>
  );
}