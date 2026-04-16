import React from 'react';
import styles from "./cart-footer.module.css";
import { useRouter } from 'next/navigation'; // стандартный роутер Next.js
import { useLocale, useTranslations } from 'next-intl';
import { useCartTotal } from '@/context/AppContext';

const CartFooter = ({ goodsInCart }) => {
    const t = useTranslations('cart');
    const router = useRouter();
    const locale = useLocale();
    const { cartTotal } = useCartTotal();

    const handleCheckout = () => {
        router.push(`/${locale}/checkout`);
    };

    return (
        <div className={styles._}>
            {cartTotal > 0 && (
                <p className={styles.total}>
                    {t('subtotal')} 
                    <span className={styles.sum}>
                        {cartTotal.toFixed(2)} {t('currency')}
                    </span>
                </p>
            )}
            <button
                onClick={handleCheckout}
                type="button"
                className={`${cartTotal === 0 ? styles.btn + " " + styles.disable : styles.btn}`}
                disabled={cartTotal === 0}
            >
                {t('checkout')}
            </button>
        </div>
    );
};

export default CartFooter;