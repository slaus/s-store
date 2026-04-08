import React from 'react';
import styles from "./cart.module.css";
import { IoCloseOutline } from "react-icons/io5";
import Overlay from '../others/Overlay';
import CartList from './CartList';
import CartFooter from './CartFooter';
import { useGoodsInCart } from '@/context/AppContext';

const Cart = ({ setShowCart }) => {
    // const [cart, setCart] = useRecoilState(cartState);
    const { goodsInCart } = useGoodsInCart();

    const hideCart = () => {
        setShowCart(false);
    }

    return (
        <Overlay setShowCart={setShowCart}>
            <div className={styles._}>
                <section className={styles.block}>
                    <div className={styles.head}>
                        <h2 className={styles.title}>Кошик для покупок</h2>
                        <button className={styles.close} onClick={hideCart}>
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