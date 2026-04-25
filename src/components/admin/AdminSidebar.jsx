"use client";
import Link from "next/link";
import { usePathname, useSearchParams, useParams } from "next/navigation";
import styles from "./admin-sidebar.module.css";
import { useTranslations } from "next-intl";

const AdminSidebar = ({ showAdminSidebar, setShowAdminSidebar, mobile }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = params?.locale || "uk";
  const token = searchParams.get("token");
  const t = useTranslations("admin");

  const menuItems = [
    { path: "products", label: t("products") },
    { path: "categories", label: t("categories") },
    { path: "settings", label: t("settings") },
  ];

  const isActive = (path) => {
    const currentPath = pathname.split("/").pop();
    return currentPath === path;
  };

  return (
    <>
      <aside className={`${styles._} ${showAdminSidebar ? styles.open : ""}`}>
        <div className={styles.radiogroup}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={`/${locale}/admin/${item.path}?token=${token}`}
              className={`${isActive(item.path) ? styles.btn + " " + styles.active : styles.btn}`}
              onClick={() => mobile && setShowAdminSidebar(false)}
            >
              <div className={styles.item}>{item.label}</div>
            </Link>
          ))}
        </div>
      </aside>
      {mobile && showAdminSidebar && (
        <div className={styles.overlay} onClick={() => setShowAdminSidebar(false)}></div>
      )}
    </>
  );
};

export default AdminSidebar;