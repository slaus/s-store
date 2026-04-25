"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import Header from "@/components/commons/Header";
import Main from "@/components/commons/Main";
import Footer from "@/components/commons/Footer";
import Alert from "@/components/ui/Alert";
import Cart from "@/components/cart/Cart";
import Wrapper from "@/components/commons/Wrapper";
import CounterBtn from "@/components/ui/CounterBtn";
import card from "@/components/home/item-card.module.css";
import { useIsInCart } from "@/context/AppContext";
import Breadcrumb from "@/components/others/Breadcrumb";

export default function ProductPageClient({ product, locale, t }) {
  const [showCart, setShowCart] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [mobile, setMobile] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);

  const quantityInCart = useIsInCart(product);
  const title = product.title?.[locale] || product.title?.uk;
  const description = product.description?.[locale] || "";
  const imgUrl = product.images?.[0] || "/images/no-photo.jpg";
  const price = product.price;
  const salePrice = product.salePrice;
  const isNew = product.isNew;
  const visible = product.visible;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 767) {
        setShowSidebar(false);
        setMobile(true);
      } else {
        setShowSidebar(true);
        setMobile(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div className={styles.main}>
        <Header
          page="product"
          setShowCart={setShowCart}
          setShowSearchBar={() => {}}
          showSidebar={false}
          setShowSidebar={() => {}}
        />

        <Wrapper>
          <Main>
            <div className={styles._}>
              <div className={styles.bread}>
                <Breadcrumb page="product" productName={title} />
              </div>
              <div className={styles.item}>
                <div className={styles.img}>
                  {(salePrice || isNew) && (
                    <div className={styles.action}>
                      {salePrice && (
                        <div className={styles.sale}>{t.discount}</div>
                      )}
                      {isNew && <div className={styles.new}>{t.new}</div>}
                    </div>
                  )}
                  <img alt={title} title={title} src={imgUrl} />
                </div>
                <div className={styles.text}>
                  <h2 className={styles.title}>{title}</h2>
                  <div className={styles.prices}>
                    <p className={styles.price}>
                      {salePrice || price} {t.currency}
                    </p>
                    {salePrice && (
                      <p className={styles.old}>
                        {price} {t.currency}
                      </p>
                    )}
                  </div>
                  <p className={styles.desc}>{description}</p>
                  <div className={styles.buy}>
                    <div className={card.btns}>
                      {visible ? (
                        <CounterBtn item={product} counter={quantityInCart} />
                      ) : (
                        <p className={card.empty}>{t.out_of_stock}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Main>
        </Wrapper>
      </div>

      {showCart && <Cart setShowCart={setShowCart} />}
      <Footer />
      <Alert />
    </>
  );
}
