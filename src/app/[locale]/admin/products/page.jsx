"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { arrayMove } from "@dnd-kit/sortable";
import styles from "./page.module.css";
import Loading from "@/components/ui/Loading";
import Modal from "@/components/ui/Modal";
import Overlay from "@/components/others/Overlay";
import AdminTable from "@/components/admin/AdminTable";
import ProductForm from "@/components/admin/ProductForm";
import Button from "@/components/ui/Button";
import { BiPlus } from "react-icons/bi";
import { useTranslations } from "next-intl";
import { locales, defaultLocale } from "@/config/locales";

const createEmptyMultilang = () => {
  const obj = {};
  locales.forEach((loc) => {
    obj[loc] = "";
  });
  return obj;
};

export default function ProductsPage() {
  const t = useTranslations("admin");
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();
  const currentLocale = params?.locale || defaultLocale;
  const token = searchParams.get("token");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    sku: "",
    title: createEmptyMultilang(),
    description: createEmptyMultilang(),
    metaTitle: createEmptyMultilang(),
    metaDescription: createEmptyMultilang(),
    metaKeywords: createEmptyMultilang(),
    price: 0,
    salePrice: null,
    isNew: false,
    visible: true,
    category: createEmptyMultilang(),
    img: "",
  });
  const [uploading, setUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!token) {
      router.replace("/");
      return;
    }
    fetch(`/api/admin?token=${token}`, { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Помилка завантаження:", err);
        setLoading(false);
      });
  }, [token, router]);

  const notifyCatalogUpdate = () => {
    const timestamp = Date.now().toString();
    localStorage.setItem("products_last_update", timestamp);
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "products_last_update",
        newValue: timestamp,
      }),
    );
  };

  const refreshProducts = async () => {
    const res = await fetch(`/api/admin?token=${token}`, { cache: "no-store" });
    const data = await res.json();
    setProducts(data);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = products.findIndex((p) => p.sku === active.id);
      const newIndex = products.findIndex((p) => p.sku === over.id);
      const newProducts = arrayMove(products, oldIndex, newIndex);
      setProducts(newProducts);
      saveOrder(newProducts);
      await refreshProducts();
      notifyCatalogUpdate();
    }
  };

  const saveOrder = async (orderedProducts) => {
    const res = await fetch(`/api/admin?token=${token}&action=reorder`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ products: orderedProducts }),
    });
    if (!res.ok) {
      alert(t("no_sort"));
    } else {
      notifyCatalogUpdate();
    }
  };

  const openModalForAdd = () => {
    setEditingId("new");
    setFormData({
      sku: "",
      title: createEmptyMultilang(),
      description: createEmptyMultilang(),
      metaTitle: createEmptyMultilang(),
      metaDescription: createEmptyMultilang(),
      metaKeywords: createEmptyMultilang(),
      category: createEmptyMultilang(),
      price: 0,
      salePrice: null,
      isNew: false,
      visible: true,
      img: "",
    });
    setIsModalOpen(true);
  };

  const openModalForEdit = (product) => {
    setEditingId(product.sku);
    setFormData({
      sku: product.sku,
      title: product.title || createEmptyMultilang(),
      description: product.description || createEmptyMultilang(),
      metaTitle: product.metaTitle || createEmptyMultilang(),
      metaDescription: product.metaDescription || createEmptyMultilang(),
      metaKeywords: product.metaKeywords || createEmptyMultilang(),
      category: product.category || createEmptyMultilang(),
      price: product.price,
      salePrice: product.salePrice || null,
      isNew: product.isNew || false,
      visible: product.visible !== undefined ? product.visible : true,
      img: product.images?.[0] || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleDelete = async (sku) => {
    if (!confirm(t("delete"))) return false;
    const res = await fetch(`/api/admin?token=${token}&sku=${sku}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setProducts(products.filter((p) => p.sku !== sku));
      await refreshProducts();
      notifyCatalogUpdate();
      return true;
    } else {
      alert(t("delete_error"));
      return false;
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (res.ok) {
      const { url } = await res.json();
      setFormData({ ...formData, img: url });
    } else alert(t("upload_error"));
    setUploading(false);
  };

  const handleSave = async () => {
    // Подготавливаем payload в соответствии со схемой MongoDB
    const payload = {
      sku: formData.sku || undefined,
      title: formData.title,
      description: formData.description,
      metaTitle: formData.metaTitle,
      metaDescription: formData.metaDescription,
      metaKeywords: formData.metaKeywords,
      price: formData.price,
      salePrice: formData.salePrice,
      isNew: formData.isNew,
      visible: formData.visible,
      category: formData.category,
      images: formData.img ? [formData.img] : [],
    };
    if (payload.salePrice === "" || payload.salePrice === null)
      delete payload.salePrice;
    if (!payload.sku) delete payload.sku;

    if (editingId === "new") {
      const res = await fetch(`/api/admin?token=${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const saved = await res.json();
        setProducts([...products, saved]);
        await refreshProducts();
        notifyCatalogUpdate();
        closeModal();
      } else {
        const err = await res.text();
        alert(t("add_error") + err);
      }
    } else {
      const res = await fetch(`/api/admin?token=${token}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, sku: editingId }),
      });
      if (res.ok) {
        await refreshProducts();
        notifyCatalogUpdate();
        closeModal();
      } else {
        const errText = await res.text();
        alert(t("update_error") + errText);
      }
    }
  };

  return (
    <>
      <h1>{t("products")}</h1>
      <Button type="button" onClick={openModalForAdd}>
        <BiPlus size={18} /> {t("add")}
      </Button>

      {loading ? (
        <Loading />
      ) : (
        <AdminTable
          products={products}
          onEdit={openModalForEdit}
          onDelete={handleDelete}
          onDragEnd={handleDragEnd}
          locale={currentLocale}
        />
      )}

      {isModalOpen && (
        <Overlay>
          <Modal setIsModalOpen={setIsModalOpen}>
            <ProductForm
              editingId={editingId}
              formData={formData}
              setFormData={setFormData}
              onSave={handleSave}
              onCancel={closeModal}
              uploading={uploading}
              onImageUpload={handleImageUpload}
            />
          </Modal>
        </Overlay>
      )}
    </>
  );
}
