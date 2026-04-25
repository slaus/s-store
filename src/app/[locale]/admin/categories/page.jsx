import { useTranslations } from "next-intl";

export default function CategoriesPage() {
  const t = useTranslations("admin");
  return (
    <>
      <h1>{t("categories")}</h1>
      <div>Управление категориями (в разработке)</div>
    </>
  );
}
