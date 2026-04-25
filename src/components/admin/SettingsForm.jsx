"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { locales } from "@/config/locales";
import Button from "@/components/ui/Button";
import styles from "./settings-form.module.css"; // берём стили из ProductForm
import Image from "next/image";

export default function SettingsForm({ initialData, onSave, token }) {
  const t = useTranslations("settings");
  const a = useTranslations("admin");
  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formLocale, setFormLocale] = useState(locales[0]);

  useEffect(() => {
    setFormData(initialData);
    console.log(formData);
  }, [initialData]);

  const handleMultilangChange = (field, locale, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: { ...prev[field], [locale]: value },
    }));
  };

  const handleSimpleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const switchLanguage = (locale) => {
    setFormLocale(locale);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    try {
      const res = await fetch(`/api/settings?token=${token}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        if (onSave) onSave();
      } else {
        alert(t("save_error"));
      }
    } catch (err) {
      console.error(err);
      alert(t("save_error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles._}>
      <div className={styles.switcher}>
        <div className={styles.btns}></div>
        {locales.map((locale) => (
          <button
            key={locale}
            type="button"
            onClick={() => switchLanguage(locale)}
            className={`${styles.lang} ${formLocale === locale ? styles.active : ""}`}
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

      <div className={styles.group}>
        <div className={styles.icon}>
          <span>🏷️</span>
        </div>
        <input
          type="text"
          placeholder={`${t("site_name")} (${formLocale.toUpperCase()})`}
          className={styles.input}
          value={formData.siteName?.[formLocale] || ""}
          onChange={(e) =>
            handleMultilangChange("siteName", formLocale, e.target.value)
          }
        />
      </div>

      <div className={styles.group}>
        <div className={styles.icon}>
          <span>📝</span>
        </div>
        <textarea
          placeholder={`${t("site_description")} (${formLocale.toUpperCase()})`}
          className={styles.textarea}
          rows="2"
          value={formData.description?.[formLocale] || ""}
          onChange={(e) =>
            handleMultilangChange("description", formLocale, e.target.value)
          }
        />
      </div>

      <div className={styles.group}>
        <div className={styles.icon}>
          <span>🔑</span>
        </div>
        <input
          type="text"
          placeholder={`${t("site_keywords")} (${formLocale.toUpperCase()}) (через запятую)`}
          className={styles.input}
          value={formData.keywords?.[formLocale]?.join(", ") || ""}
          onChange={(e) =>
            handleMultilangChange(
              "keywords",
              formLocale,
              e.target.value.split(/, ?/),
            )
          }
        />
      </div>

      <div className={styles.group}>
        <div className={styles.icon}>
          <span>📌</span>
        </div>
        <input
          type="text"
          placeholder={`Meta Title (${formLocale.toUpperCase()})`}
          className={styles.input}
          value={formData.metaTitle?.[formLocale] || ""}
          onChange={(e) =>
            handleMultilangChange("metaTitle", formLocale, e.target.value)
          }
        />
      </div>

      <div className={styles.group}>
        <div className={styles.icon}>
          <span>📄</span>
        </div>
        <textarea
          placeholder={`Meta Description (${formLocale.toUpperCase()})`}
          className={styles.textarea}
          rows="2"
          value={formData.metaDescription?.[formLocale] || ""}
          onChange={(e) =>
            handleMultilangChange("metaDescription", formLocale, e.target.value)
          }
        />
      </div>

      <div className={styles.group}>
        <div className={styles.icon}>
          <span>🖼️</span>
        </div>
        <input
          type="text"
          placeholder={t("logo_url")}
          className={styles.input}
          value={formData.logoUrl || ""}
          onChange={(e) => handleSimpleChange("logoUrl", e.target.value)}
        />
      </div>

      <div className={styles.group}>
        <div className={styles.icon}>
          <span>⭐</span>
        </div>
        <input
          type="text"
          placeholder={t("favicon_url")}
          className={styles.input}
          value={formData.faviconUrl || ""}
          onChange={(e) => handleSimpleChange("faviconUrl", e.target.value)}
        />
      </div>

      <div className={styles.group}>
        <div className={styles.icon}>
          <span>📧</span>
        </div>
        <input
          type="email"
          placeholder={t("contact_email")}
          className={styles.input}
          value={formData.contactEmail || ""}
          onChange={(e) => handleSimpleChange("contactEmail", e.target.value)}
        />
      </div>

      <div className={styles.group}>
        <div className={styles.icon}>
          <span>🔗</span>
        </div>
        <textarea
          placeholder={t("social_links") + " (JSON)"}
          className={styles.textarea}
          rows="3"
          value={JSON.stringify(formData.socialLinks || {}, null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              handleSimpleChange("socialLinks", parsed);
            } catch (err) {}
          }}
        />
      </div>

      {saved && <div className={styles.success}>✅ {t("saved")}</div>}

      <div className={styles.actions}>
        <Button type="submit" disabled={loading}>
          {loading ? t("saving") : t("save")}
        </Button>
      </div>
    </form>
  );
}
