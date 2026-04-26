import React from 'react';
import cartFooter from "@styles/CartFooter.module.css";
import { useRouter } from 'next/navigation';
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
        <div className={cartFooter._}>
            {cartTotal > 0 && (
                <p className={cartFooter.total}>
                    {t('subtotal')} 
                    <span className={cartFooter.sum}>
                        {cartTotal.toFixed(2)} {t('currency')}
                    </span>
                </p>
            )}
            <button
                onClick={handleCheckout}
                type="button"
                className={`${cartTotal === 0 ? cartFooter.btn + " " + cartFooter.disable : cartFooter.btn}`}
                disabled={cartTotal === 0}
            >
                {t('checkout')}
            </button>
        </div>
    );
};

export default CartFooter;