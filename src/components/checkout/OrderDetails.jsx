import React from 'react';
import styles from "@/components/checkout/order-details.module.css";
import { useOrderDetails, useDelivery, useDeliveryFee } from '@/context/AppContext';
import OrderItem from '@/components/checkout/OrderItem';
import { useTranslations } from 'next-intl';

const OrderDetails = () => {
    const t = useTranslations('checkout');

    const { cartItems, subTotal, withDelivery, shippingCost, total } = useOrderDetails();
    const { delivery, setDelivery } = useDelivery();
    const { deliveryFee, setDeliveryFee } = useDeliveryFee();
    // console.log("delivery cost " + deliveryFee);
    // console.log("shipping cost " + shippingCost);
    // console.log("with delivery " + withDelivery);
    // console.log(cartItems, subTotal, shippingCost, total);

    return (
        <div className={styles._}>
            <h3 className={styles.title}>{t('order')}</h3>
            <div>
                {Object.values(cartItems).map((item) => (
                    <OrderItem key={item.id} item={item} />
                ))}
            </div>
            <hr className={styles.hr} />
            <div>
                <div className={styles.item}>
                    <p>{t('subtotal')}</p>
                    <p className={styles.subtotal}>{subTotal} {t('currency')}</p>
                </div>
                {withDelivery &&
                    <div className={styles.item}>
                        <p>{t('delivery')}</p>
                        <p className={styles.subtotal}>{withDelivery ? shippingCost : "0"} {t('currency')}</p>
                    </div>
                }

                <div className={styles.item}>
                    <p><b>{t('total')}</b></p>
                    <p className={styles.total}>{total} {t('currency')}</p>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;