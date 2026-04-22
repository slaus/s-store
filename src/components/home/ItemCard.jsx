import React, { useState } from "react";
import styles from "./item-card.module.css";
import Overlay from "@/components/others/Overlay";
import Modal from "@/components/ui/Modal";
import CounterBtn from "@/components/ui/CounterBtn";
import { useIsInCart } from "@/context/AppContext";
import { useTranslations } from "next-intl";
import Quickview from "../others/Quickview";

const ItemsCard = ({ item }) => {
  const t = useTranslations("common");
  const { title, price, salePrice, images, sku, visible, isNew, description } =
    item;
  const imgUrl = images?.[0] || "/images/no-photo.jpg";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const quantityInCart = useIsInCart(item);

  const openModal = () => setIsModalOpen(!isModalOpen);

  return (
    <>
      <div className={styles._}>
        {(salePrice || isNew) && (
          <div className={styles.action}>
            {salePrice && <div className={styles.sale}>{t("discount")}</div>}
            {isNew && <div className={styles.new}>{t("new")}</div>}
          </div>
        )}
        <div className={styles.img} onClick={() => imgUrl && openModal()}>
          <img
            alt={title}
            title={title}
            src={imgUrl}
            className={`${styles.pict} ${!visible ? styles.hidden : ""}`}
          />
        </div>
        <div className={styles.block}>
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
          <p className={styles.title}>{title}</p>
        </div>
        <div className={styles.btns}>
          {visible ? (
            <CounterBtn item={item} counter={quantityInCart} />
          ) : (
            <p className={styles.empty}>{t("out_of_stock")}</p>
          )}
        </div>
      </div>
      {isModalOpen && (
        <Overlay>
          <Modal setIsModalOpen={setIsModalOpen}>
            <Quickview item={item} />
          </Modal>
        </Overlay>
      )}
    </>
  );
};

export default ItemsCard;
