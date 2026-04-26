import React from 'react';
import orderItem from "@styles/OrderItem.module.css";
import { useTranslations } from 'next-intl';

const OrderItem = ({ item }) => {
    const t = useTranslations('checkout');

    const { qty, title, price, offerPrice } = item;
    const itemTotal = (offerPrice ? offerPrice * qty : price * qty).toFixed(0);

    return (
        <div className={orderItem._}>
            <span><b>{qty}</b></span>
            <span>x</span>
            <p>{title}</p>
            <p className={orderItem.total}>{itemTotal} {t('currency')}</p>
        </div>
    );
};

export default OrderItem;