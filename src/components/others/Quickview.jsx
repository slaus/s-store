import React from "react";
import styles from "./quickview.module.css";
import CounterBtn from "@/components/ui/CounterBtn";
import product from "@/components/home/item-card.module.css";
import { useIsInCart } from "@/context/AppContext";
import { useTranslations } from "next-intl";

const Quickview = ({ item }) => {
  const t = useTranslations("common");
  const { title, price, salePrice, sku, visible, isNew, description, images } =
    item;
  const imgUrl = images?.[0] || "/images/no-photo.jpg";
  const quantityInCart = useIsInCart(item);

  return (
    <div className={styles._}>
      <div className={styles.img}>
        {(salePrice || isNew) && (
          <div className={styles.action}>
            {salePrice && <div className={styles.sale}>{t("discount")}</div>}
            {isNew && <div className={styles.new}>{t("new")}</div>}
          </div>
        )}
        <img alt={title} title={title} src={imgUrl} />
      </div>
      <div className={styles.text}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.prices}>
          <p className={styles.price}>
            {salePrice || price} {t("currency")}
          </p>
          {salePrice && (
            <p className={styles.old}>
              {price} {t("currency")}
            </p>
          )}
        </div>
        <p className={styles.desc}>{description}</p>
        <div className={styles.buy}>
          <div className={product.btns}>
            {visible ? (
              <CounterBtn item={item} counter={quantityInCart} />
            ) : (
              <p className={product.empty}>{t("out_of_stock")}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quickview;
