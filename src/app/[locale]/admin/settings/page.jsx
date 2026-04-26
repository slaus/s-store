"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import SettingsForm from "@/components/admin/SettingsForm";
import Loading from "@/components/ui/Loading";
import { useTranslations } from "next-intl";
import setting from '@styles/SettingsPage.module.css';

export default function SettingsPage() {
  const t = useTranslations("settings");
  const a = useTranslations("admin");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch(`/api/settings?token=${token}&locale=uk`)
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [token]);

  return (
    <>
      <h1>{a("settings")}</h1>
      {loading ? (
        <Loading />
      ) : (
        !settings ? (
          <div className={setting._}>{t('settings_error')}</div>
        ) : (
          <SettingsForm initialData={settings} onSave={() => {}} token={token} />
        )
      )}
    </>
  );
}