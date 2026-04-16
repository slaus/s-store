"use client";

import React from "react";
import ClientOnly from "@/components/ClientOnly";
import Loading from '@/components/ui/Loading';
import { useQtySelectedItems, useGoodsInCart } from "@/context/AppContext";
import Header from "@/components/commons/Header";
import Main from "@/components/commons/Main";
import Footer from "@/components/commons/Footer";
import Flex from "@/components/ui/Flex";
import styles from "../page.module.css";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderDetails from "@/components/checkout/OrderDetails";
import { useTranslations } from "next-intl";

const Checkout = () => {
  const t = useTranslations('checkout');
  const { qtySelectedItems } = useQtySelectedItems();
  const { goodsInCart } = useGoodsInCart();

  return (
    <>
      <div className={styles.main}>
        <Header />

        <Main>
          <h1>{t('title')}</h1>
          <Flex className="w_md col_sm" style={{ alignItems: "flex-start" }}>
            <ClientOnly fallback={<Loading />}>
              <CheckoutForm />
              <OrderDetails />
            </ClientOnly>
          </Flex>
        </Main>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
