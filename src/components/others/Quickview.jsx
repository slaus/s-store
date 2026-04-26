import React from "react";
import view from "@styles/QuickView.module.css";
import CounterBtn from "@/components/ui/CounterBtn";
import product from "@styles/ItemCard.module.css";
import { useIsInCart } from "@/context/AppContext";
import { useTranslations } from "next-intl";

const Quickview = ({ item }) => {
  const t = useTranslations("common");
  const { title, price, salePrice, sku, visible, isNew, description, images } =
    item;
  const imgUrl = images?.[0] || "/images/no-photo.jpg";
  const quantityInCart = useIsInCart(item);

  return (
    <div className={view._}>
      <div className={view.img}>
        {(salePrice || isNew) && (
          <div className={view.action}>
            {salePrice && <div className={view.sale}>{t("discount")}</div>}
            {isNew && <div className={view.new}>{t("new")}</div>}
          </div>
        )}
        <img alt={title} title={title} src={imgUrl} />
      </div>
      <div className={view.text}>
        <h2 className={view.title}>{title}</h2>
        <div className={view.prices}>
          <p className={view.price}>
            {salePrice || price} {t("currency")}
          </p>
          {salePrice && (
            <p className={view.old}>
              {price} {t("currency")}
            </p>
          )}
        </div>
        <p className={view.desc}>{description}</p>
        <div className={view.buy}>
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
