import React from "react";
import breadcrumb from "@styles/Breadcrumb.module.css";
import { BiChevronRight } from "react-icons/bi";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useSelectedCategory, useReset } from "@/context/AppContext";

const Breadcrumb = ({ selectedCategory, page, productName }) => {
  const t = useTranslations("product");
  const locale = useLocale();
  const { setSelectedCategory } = useSelectedCategory();
  const reset = useReset();
  const router = useRouter();

  const handleAllProductsClick = (e) => {
    e.preventDefault();
    setSelectedCategory("");
    reset();
    router.push(`/${locale}`);
  };

  return (
    <nav className={breadcrumb._}>
      <ol className={breadcrumb.ol}>
        <li className={breadcrumb.li}>
          <a href={`/${locale}`} onClick={handleAllProductsClick} className={breadcrumb.link}>
            {t("all")}
          </a>
        </li>
        {page === "product" && (
          <>
            <li className={breadcrumb.li}>
              <BiChevronRight size={22} />
            </li>
            <li className={breadcrumb.li}>
              <span className={breadcrumb.link}>{productName}</span>
            </li>
          </>
        )}
        {selectedCategory && (
          <>
            <li className={breadcrumb.li}>
              <BiChevronRight size={22} />
            </li>
            <li className={breadcrumb.li}>
              <span className={breadcrumb.link}>{selectedCategory}</span>
            </li>
          </>
        )}
      </ol>
    </nav>
  );
};

export default Breadcrumb;