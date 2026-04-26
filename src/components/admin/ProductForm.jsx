"use client";
import { useState, useEffect } from "react";
import productForm from "@styles/ProductForm.module.css";
import Button from "@/components/ui/Button";
import { useAlert } from "@/context/AppContext";
import {
  BiSave,
  BiTrash,
  BiIdCard,
  BiRename,
  BiShow,
  BiBookmarks,
  BiMoney,
  BiCategory,
  BiMoneyWithdraw,
} from "react-icons/bi";
import { useTranslations } from "next-intl";
import { locales } from "@/config/locales";
import Tabs from "@/components/ui/Tabs";
import Image from "next/image";

export default function ProductForm({
  editingId,
  formData,
  setFormData,
  onSave,
  onCancel,
  uploading,
  onImageUpload,
}) {
  const t = useTranslations("common");
  const a = useTranslations("alert");
  const h = useTranslations("admin");
  const f = useTranslations("form");
  const [loading, setLoading] = useState(false);
  const [checkedNew, setCheckedNew] = useState(formData.isNew);
  const [checkedVisible, setCheckedVisible] = useState(formData.visible);
  const [submitted, setSubmitted] = useState(false);
  const { showAlert } = useAlert();

  const [formLocale, setFormLocale] = useState(locales[0]);

  useEffect(() => {
    setCheckedNew(formData.isNew);
  }, [formData.isNew]);

  useEffect(() => {
    setCheckedVisible(formData.visible);
  }, [formData.visible]);

  const toggleNew = (e) => {
    e.preventDefault();
    const newChecked = !checkedNew;
    setCheckedNew(newChecked);
    setFormData({ ...formData, isNew: newChecked });
  };

  const toggleVisible = (e) => {
    e.preventDefault();
    const newChecked = !checkedVisible;
    setCheckedVisible(newChecked);
    setFormData({ ...formData, visible: newChecked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    let hasError = false;
    for (const locale of locales) {
      if (!formData.title[locale] || formData.title[locale].trim() === "") {
        hasError = true;
        break;
      }
    }
    for (const locale of locales) {
      if (
        !formData.category?.[locale] ||
        formData.category[locale].trim() === ""
      ) {
        hasError = true;
        break;
      }
    }
    if (
      formData.price === undefined ||
      formData.price === "" ||
      formData.price <= 0
    )
      hasError = true;
    if (
      formData.salePrice &&
      formData.price &&
      formData.salePrice > formData.price
    )
      hasError = true;

    if (hasError) return;

    setLoading(true);
    await onSave();
    showAlert(editingId === "new" ? a("added") : a("updated"), "success");
    setLoading(false);
  };

  const handleMultilangChange = (field, locale, value) => {
    setFormData({
      ...formData,
      [field]: { ...formData[field], [locale]: value },
    });
  };

  const handleSimpleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const switchLanguage = (locale) => {
    setFormLocale(locale);
  };

  return (
    <form onSubmit={handleSubmit} className={productForm._}>
      <h2 className={productForm.title}>
        {editingId === "new" ? h("add") : h("edit")}
      </h2>

      <div className={productForm.switcher}>
        <div className={productForm.btns}>
          <button
            className={`${productForm.mark} ${checkedVisible ? productForm.active : ""}`}
            onClick={toggleVisible}
          >
            <BiShow size={20} title={h("show")} />
          </button>
          <button
            className={`${productForm.mark} ${checkedNew ? productForm.active : ""}`}
            onClick={toggleNew}
          >
            <BiBookmarks size={20} title={h("new")} />
          </button>
        </div>
        {locales.map((locale) => (
          <button
            key={locale}
            type="button"
            onClick={() => switchLanguage(locale)}
            className={`${productForm.lang} ${formLocale === locale ? productForm.active : ""}`}
          >
            <Image
              src={`/images/${locale}.png`}
              alt={locale.toUpperCase()}
              width={24}
              height={16}
            />
          </button>
        ))}
      </div>

      {/* Основные вкладки (General, Description, Images, SEO) */}
      <Tabs defaultIndex={0}>
        <Tabs.Nav>
          <button label={h("general")}>{h("general")}</button>
          <button label={h("desc")}>{h("desc")}</button>
          <button label={h("images")}>{h("images")}</button>
          <button label={h("seo")}>{h("seo")}</button>
        </Tabs.Nav>
        <Tabs.Container>
          {/* General */}
          <div>
            {/* SKU */}
            <div
              className={`${productForm.group} ${submitted && editingId === "new" && (!formData.sku || formData.sku.trim() === "") ? productForm.err : ""}`}
            >
              <div
                className={`${productForm.icon} ${editingId !== "new" ? productForm.gray : ""}`}
              >
                <BiIdCard size={20} />
              </div>
              <input
                type="text"
                name="sku"
                placeholder={f("item_id")}
                className={productForm.input}
                value={formData.sku}
                onChange={(e) => handleSimpleChange("sku", e.target.value)}
                disabled={editingId !== "new"}
              />
            </div>

            {/* Название товара (только для выбранного языка) */}
            <div
              className={`${productForm.group} ${submitted && (!formData.title[formLocale] || formData.title[formLocale].trim() === "") ? productForm.err : ""}`}
            >
              <div className={productForm.icon}>
                <BiRename size={20} />
              </div>
              <input
                type="text"
                placeholder={`${f("item_name")} (${formLocale.toUpperCase()})`}
                className={productForm.input}
                value={formData.title[formLocale] || ""}
                onChange={(e) =>
                  handleMultilangChange("title", formLocale, e.target.value)
                }
              />
              {submitted &&
                (!formData.title[formLocale] ||
                  formData.title[formLocale].trim() === "") && (
                  <p className={productForm.error}>
                    {f("item_name_error")} ({formLocale})
                  </p>
                )}
            </div>

            {/* Категория (только для выбранного языка) */}
            <div
              className={`${productForm.group} ${submitted && (!formData.category?.[formLocale] || formData.category[formLocale].trim() === "") ? productForm.err : ""}`}
            >
              <div className={productForm.icon}>
                <BiCategory size={20} />
              </div>
              <input
                type="text"
                placeholder={`${f("item_category")} (${formLocale.toUpperCase()})`}
                className={productForm.input}
                value={formData.category?.[formLocale] || ""}
                onChange={(e) =>
                  handleMultilangChange("category", formLocale, e.target.value)
                }
              />
              {submitted &&
                (!formData.category?.[formLocale] ||
                  formData.category[formLocale].trim() === "") && (
                  <p className={productForm.error}>
                    {f("item_category_error")} ({formLocale})
                  </p>
                )}
            </div>
          </div>

          {/* Description (многострочное) */}
          <div>
            {/* Цена и акция (общие) */}
            <div
              className={`${productForm.group} ${submitted && (formData.price === undefined || formData.price === "" || formData.price <= 0) ? productForm.err : ""}`}
            >
              <div className={productForm.icon}>
                <BiMoney size={20} />
              </div>
              <input
                type="number"
                placeholder={`${f("item_price")} (${f("currency")})`}
                className={productForm.input}
                value={formData.price === 0 ? "" : formData.price}
                onChange={(e) =>
                  handleSimpleChange(
                    "price",
                    e.target.value === "" ? 0 : parseFloat(e.target.value),
                  )
                }
              />
              {submitted &&
                (formData.price === undefined ||
                  formData.price === "" ||
                  formData.price <= 0) && (
                  <p className={productForm.error}>{f("item_price_error")}</p>
                )}
            </div>

            <div
              className={`${productForm.group} ${formData.salePrice && formData.price && formData.salePrice > formData.price ? productForm.err : ""}`}
            >
              <div className={productForm.icon}>
                <BiMoneyWithdraw size={20} />
              </div>
              <input
                type="number"
                placeholder={`${f("item_offer")} (${f("currency")})`}
                className={productForm.input}
                value={formData.salePrice || ""}
                onChange={(e) =>
                  handleSimpleChange(
                    "salePrice",
                    e.target.value === "" ? null : parseFloat(e.target.value),
                  )
                }
              />
              {formData.salePrice &&
                formData.price &&
                formData.salePrice > formData.price && (
                  <p className={productForm.error}>{f("item_offer_error")}</p>
                )}
            </div>

            {/* Описание для выбранного языка */}
            <div className={productForm.group}>
              <div className={productForm.icon}>
                <BiRename size={20} />
              </div>
              <textarea
                placeholder={`${f("item_desc")} (${formLocale.toUpperCase()})`}
                className={productForm.textarea}
                rows="3"
                value={formData.description?.[formLocale] || ""}
                onChange={(e) =>
                  handleMultilangChange(
                    "description",
                    formLocale,
                    e.target.value,
                  )
                }
              />
            </div>
          </div>

          {/* Images */}
          <div>
            <div className={productForm.group}>
              <div className={productForm.download}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onImageUpload}
                  disabled={uploading}
                  className={productForm.fileInput}
                />
                {uploading && (
                  <span className={productForm.uploading}>{t("loading")}</span>
                )}
              </div>
            </div>
            {formData.img && (
              <div className={productForm.currentImage}>
                <span>{formData.img}</span>
                <Button
                  title={f("delete_photo")}
                  type="button"
                  onClick={() => handleSimpleChange("img", "")}
                  className={productForm.delete}
                >
                  <BiTrash size={18} />
                </Button>
              </div>
            )}
          </div>

          {/* SEO */}
          <div>
            {/* Meta Title */}
            <div className={productForm.group}>
              <div className={productForm.icon}>
                <BiRename size={20} />
              </div>
              <input
                type="text"
                placeholder={`Meta Title (${formLocale.toUpperCase()})`}
                className={productForm.input}
                value={formData.metaTitle?.[formLocale] || ""}
                onChange={(e) =>
                  handleMultilangChange("metaTitle", formLocale, e.target.value)
                }
              />
            </div>
            {/* Meta Description */}
            <div className={productForm.group}>
              <div className={productForm.icon}>
                <BiRename size={20} />
              </div>
              <textarea
                placeholder={`Meta Description (${formLocale.toUpperCase()})`}
                className={productForm.textarea}
                rows="2"
                value={formData.metaDescription?.[formLocale] || ""}
                onChange={(e) =>
                  handleMultilangChange(
                    "metaDescription",
                    formLocale,
                    e.target.value,
                  )
                }
              />
            </div>
          </div>
        </Tabs.Container>
      </Tabs>

      <div className={productForm.actions}>
        <Button type="submit" disabled={loading}>
          <BiSave size={20} /> {f("save")}
        </Button>
        <Button type="button" onClick={onCancel} className={productForm.cancel}>
          {f("cancel")}
        </Button>
      </div>
    </form>
  );
}
