"use client";
import Link from "next/link";
import { usePathname, useSearchParams, useParams } from "next/navigation";
import adminSidebar from "@styles/AdminSidebar.module.css";
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
      <aside className={`${adminSidebar._} ${showAdminSidebar ? adminSidebar.open : ""}`}>
        <div className={adminSidebar.radiogroup}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={`/${locale}/admin/${item.path}?token=${token}`}
              className={`${isActive(item.path) ? adminSidebar.btn + " " + adminSidebar.active : adminSidebar.btn}`}
              onClick={() => mobile && setShowAdminSidebar(false)}
            >
              <div className={adminSidebar.item}>{item.label}</div>
            </Link>
          ))}
        </div>
      </aside>
      {mobile && showAdminSidebar && (
        <div className={adminSidebar.overlay} onClick={() => setShowAdminSidebar(false)}></div>
      )}
    </>
  );
};

export default AdminSidebar;