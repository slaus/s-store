"use client";
import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styles from "./sortable-row.module.css";
import {
  BiEdit,
  BiTrash,
  BiCheck,
  BiImage,
  BiShow,
  BiHide,
  BiBookmarks
} from "react-icons/bi";
import ModalPortal from "@/components/ui/ModalPortal";
import Overlay from "@/components/others/Overlay";
import Modal from "@/components/ui/Modal";
import { useAlert } from "@/context/AppContext";
import { useTranslations } from "next-intl";
import { locales } from "@/config/locales";
import { useLocale } from 'next-intl';

export default function SortableRow({ product, onEdit, onDelete, locale }) {
  const t = useTranslations('admin');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showAlert } = useAlert();
  const currentLocale = useLocale();

  const openModal = () => setIsModalOpen(!isModalOpen);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.sku });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: isDragging ? "#f0f0f0" : "transparent",
  };

  const isVisible = product.visible !== undefined ? product.visible : true;
  const title = product.title?.[locale] || product.title?.uk || "";
  const category = product.category?.[locale] || product.category?.uk || '';

  return (
    <>
      <tr ref={setNodeRef} style={style}>
        <td className={styles.dragHandle} {...attributes} {...listeners}>⋮⋮</td>
        <td className={`${styles.cell} ${!isVisible ? styles.hide : ""}`}>{product.sku}</td>
        <td className={`${styles.cell} ${product.isNew ? styles.ok : ""} ${!isVisible ? styles.hide : ""}`}>
          {title}
        </td>
        <td className={`${styles.cell} ${product.isNew ? styles.ok : ""} ${!isVisible ? styles.hide : ""}`}>{product.price}</td>
        <td className={`${styles.cell} ${product.salePrice ? styles.action : ""}`}>
          {product.salePrice ? `${product.salePrice}` : ""}
        </td>
        <td className={`${styles.cell} ${!isVisible ? styles.hide : ""}`}>
          {product.isNew ? <BiBookmarks className={styles.ok} size={24} /> : ""}
        </td>
        <td className={styles.cell}>
          {isVisible ? <BiShow className={styles.ok} size={20} /> : <BiHide className={styles.hide} size={20} />}
        </td>
        <td className={`${styles.cell} ${!isVisible ? styles.hide : ""}`}>
          {category}
        </td>
        <td className={`${styles.cell} ${!isVisible ? styles.hide : ""}`}>
          {product.images?.[0] && (
            <BiImage
              className={styles.img}
              size={24}
              onClick={() => product.images?.[0] && openModal()}
            />
          )}
        </td>
        <td className={styles.cell}>
          <a className={styles.edit} onClick={() => onEdit(product)}><BiEdit size={18} /></a>
          <a
            className={styles.delete}
            onClick={async () => {
              const success = await onDelete(product.sku);
              if (success) {
                showAlert(t('success'), "success");
              }
            }}
          >
            <BiTrash size={18} />
          </a>
        </td>
      </tr>

      {isModalOpen && (
        <ModalPortal>
          <Overlay>
            <Modal setIsModalOpen={setIsModalOpen}>
              <img alt={title} title={title} src={product.images[0]} />
            </Modal>
          </Overlay>
        </ModalPortal>
      )}
    </>
  );
}