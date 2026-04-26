import React from 'react';
import orderDetails from "@styles/OrderDetails.module.css";
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
        <div className={orderDetails._}>
            <h3 className={orderDetails.title}>{t('order')}</h3>
            <div>
                {Object.values(cartItems).map((item) => (
                    <OrderItem key={item.sku} item={item} />
                ))}
            </div>
            <hr className={orderDetails.hr} />
            <div>
                <div className={orderDetails.item}>
                    <p>{t('subtotal')}</p>
                    <p className={orderDetails.subtotal}>{subTotal} {t('currency')}</p>
                </div>
                {withDelivery &&
                    <div className={orderDetails.item}>
                        <p>{t('delivery')}</p>
                        <p className={orderDetails.subtotal}>{withDelivery ? shippingCost : "0"} {t('currency')}</p>
                    </div>
                }

                <div className={orderDetails.item}>
                    <p><b>{t('total')}</b></p>
                    <p className={orderDetails.total}>{total} {t('currency')}</p>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;