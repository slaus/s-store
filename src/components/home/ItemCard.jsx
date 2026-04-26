import React, { useState } from "react";
import itemCard from "@styles/ItemCard.module.css";
import Overlay from "@/components/others/Overlay";
import Modal from "@/components/ui/Modal";
import CounterBtn from "@/components/ui/CounterBtn";
import { useIsInCart } from "@/context/AppContext";
import { useTranslations } from "next-intl";
import Quickview from "@/components/others/Quickview";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Button from "@/components/ui/Button";
import buttons from "@styles/Button.module.css";
import { BiSearch } from "react-icons/bi";

const ItemsCard = ({ item }) => {
  const t = useTranslations("common");
  const { title, price, salePrice, images, sku, visible, isNew, description } =
    item;
  const imgUrl = images?.[0] || "/images/no-photo.jpg";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const quantityInCart = useIsInCart(item);
  const router = useRouter();
  const locale = useLocale();

  const openModal = () => setIsModalOpen(!isModalOpen);

  const handleCardClick = (e) => {
    e.preventDefault();
    router.push(`/${locale}/product/${sku}`);
  };

  return (
    <>
      <div className={itemCard._}>
        <div className={itemCard.img}>
          {(salePrice || isNew) && (
            <div className={itemCard.action}>
              {salePrice && <div className={itemCard.sale}>{t("discount")}</div>}
              {isNew && <div className={itemCard.new}>{t("new")}</div>}
            </div>
          )}
          <img
            alt={title}
            title={title}
            src={imgUrl}
            className={`${itemCard.pict} ${!visible ? itemCard.hidden : ""}`}
          />
          <Button className={buttons.transparent}  onClick={() => imgUrl && openModal()}>
            <BiSearch size={29} />
          </Button>
        </div>
        <div className={itemCard.block}>
          <div className={itemCard.prices}>
            <p className={itemCard.price}>
              {salePrice || price} {t("currency")}
            </p>
            {salePrice && (
              <p className={itemCard.old}>
                {price} {t("currency")}
              </p>
            )}
          </div>
          <a
            href={`/${locale}/product/${sku}`}
            className={itemCard.title}
            onClick={handleCardClick}
          >
            {title}
          </a>
        </div>
        <div className={itemCard.btns}>
          {visible ? (
            <CounterBtn item={item} counter={quantityInCart} />
          ) : (
            <p className={itemCard.empty}>{t("out_of_stock")}</p>
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
