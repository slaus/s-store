import React from 'react';
import cart from "@styles/Cart.module.css";
import { IoCloseOutline } from "react-icons/io5";
import Overlay from '../others/Overlay';
import CartList from './CartList';
import CartFooter from './CartFooter';
import { useGoodsInCart } from '@/context/AppContext';
import { useTranslations } from 'next-intl';

const Cart = ({ setShowCart }) => {
    const t = useTranslations('cart');
    // const [cart, setCart] = useRecoilState(cartState);
    const { goodsInCart } = useGoodsInCart();

    const hideCart = () => {
        setShowCart(false);
    }

    return (
        <Overlay setShowCart={setShowCart}>
            <div className={cart._}>
                <section className={cart.block}>
                    <div className={cart.head}>
                        <h2 className={cart.title}>{t('shoping_cart')}</h2>
                        <button className={cart.close} onClick={hideCart}>
                            <IoCloseOutline size={34} />
                        </button>
                    </div>
                    <CartList goodsInCart={goodsInCart} />
                    <CartFooter goodsInCart={goodsInCart} />
                </section>
            </div>
        </Overlay>
    );
};

export default Cart;