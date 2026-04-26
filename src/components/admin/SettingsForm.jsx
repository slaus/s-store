"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { locales } from "@/config/locales";
import Button from "@/components/ui/Button";
import settingsForm from "@styles/SettingsForm.module.css";
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
    <form onSubmit={handleSubmit} className={settingsForm._}>
      <div className={settingsForm.switcher}>
        <div className={settingsForm.btns}></div>
        {locales.map((locale) => (
          <button
            key={locale}
            type="button"
            onClick={() => switchLanguage(locale)}
            className={`${settingsForm.lang} ${formLocale === locale ? settingsForm.active : ""}`}
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

      <div className={settingsForm.group}>
        <div className={settingsForm.icon}>
          <span>🏷️</span>
        </div>
        <input
          type="text"
          placeholder={`${t("site_name")} (${formLocale.toUpperCase()})`}
          className={settingsForm.input}
          value={formData.siteName?.[formLocale] || ""}
          onChange={(e) =>
            handleMultilangChange("siteName", formLocale, e.target.value)
          }
        />
      </div>

      <div className={settingsForm.group}>
        <div className={settingsForm.icon}>
          <span>📝</span>
        </div>
        <textarea
          placeholder={`${t("site_description")} (${formLocale.toUpperCase()})`}
          className={settingsForm.textarea}
          rows="2"
          value={formData.description?.[formLocale] || ""}
          onChange={(e) =>
            handleMultilangChange("description", formLocale, e.target.value)
          }
        />
      </div>

      <div className={settingsForm.group}>
        <div className={settingsForm.icon}>
          <span>🔑</span>
        </div>
        <input
          type="text"
          placeholder={`${t("site_keywords")} (${formLocale.toUpperCase()}) (через запятую)`}
          className={settingsForm.input}
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

      <div className={settingsForm.group}>
        <div className={settingsForm.icon}>
          <span>📌</span>
        </div>
        <input
          type="text"
          placeholder={`Meta Title (${formLocale.toUpperCase()})`}
          className={settingsForm.input}
          value={formData.metaTitle?.[formLocale] || ""}
          onChange={(e) =>
            handleMultilangChange("metaTitle", formLocale, e.target.value)
          }
        />
      </div>

      <div className={settingsForm.group}>
        <div className={settingsForm.icon}>
          <span>📄</span>
        </div>
        <textarea
          placeholder={`Meta Description (${formLocale.toUpperCase()})`}
          className={settingsForm.textarea}
          rows="2"
          value={formData.metaDescription?.[formLocale] || ""}
          onChange={(e) =>
            handleMultilangChange("metaDescription", formLocale, e.target.value)
          }
        />
      </div>

      <div className={settingsForm.group}>
        <div className={settingsForm.icon}>
          <span>🖼️</span>
        </div>
        <input
          type="text"
          placeholder={t("logo_url")}
          className={settingsForm.input}
          value={formData.logoUrl || ""}
          onChange={(e) => handleSimpleChange("logoUrl", e.target.value)}
        />
      </div>

      <div className={settingsForm.group}>
        <div className={settingsForm.icon}>
          <span>⭐</span>
        </div>
        <input
          type="text"
          placeholder={t("favicon_url")}
          className={settingsForm.input}
          value={formData.faviconUrl || ""}
          onChange={(e) => handleSimpleChange("faviconUrl", e.target.value)}
        />
      </div>

      <div className={settingsForm.group}>
        <div className={settingsForm.icon}>
          <span>📧</span>
        </div>
        <input
          type="email"
          placeholder={t("contact_email")}
          className={settingsForm.input}
          value={formData.contactEmail || ""}
          onChange={(e) => handleSimpleChange("contactEmail", e.target.value)}
        />
      </div>

      <div className={settingsForm.group}>
        <div className={settingsForm.icon}>
          <span>🔗</span>
        </div>
        <textarea
          placeholder={t("social_links") + " (JSON)"}
          className={settingsForm.textarea}
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

      {saved && <div className={settingsForm.success}>✅ {t("saved")}</div>}

      <div className={settingsForm.actions}>
        <Button type="submit" disabled={loading}>
          {loading ? t("saving") : t("save")}
        </Button>
      </div>
    </form>
  );
}
