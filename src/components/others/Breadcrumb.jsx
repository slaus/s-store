import React from "react";
import styles from "./breadcrumb.module.css";
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
    <nav className={styles._}>
      <ol className={styles.ol}>
        <li className={styles.li}>
          <a href={`/${locale}`} onClick={handleAllProductsClick} className={styles.link}>
            {t("all")}
          </a>
        </li>
        {page === "product" && (
          <>
            <li className={styles.li}>
              <BiChevronRight size={22} />
            </li>
            <li className={styles.li}>
              <span className={styles.link}>{productName}</span>
            </li>
          </>
        )}
        {selectedCategory && (
          <>
            <li className={styles.li}>
              <BiChevronRight size={22} />
            </li>
            <li className={styles.li}>
              <span className={styles.link}>{selectedCategory}</span>
            </li>
          </>
        )}
      </ol>
    </nav>
  );
};

export default Breadcrumb;