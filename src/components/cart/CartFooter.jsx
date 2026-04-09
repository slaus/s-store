import React from 'react';
import styles from "./cart-footer.module.css";
import { useRouter } from "next/navigation";
import { useCartTotal   } from '@/context/AppContext';

const CartFooter = ({ goodsInCart }) => {

    const router = useRouter();
    const { cartTotal } = useCartTotal();
    // console.log(cartTotal);

    return (
        <div className={styles._}>
            {cartTotal > 0 &&
                <p className={styles.total}>Підсумок: 
                    <span className={styles.sum}>
                        {cartTotal.toFixed(2)} грн.
                    </span>
                </p>
            }
            <button
                onClick={() => router.push("/checkout")}
                type="button"
                className={`${cartTotal === 0 ? styles.btn + " " + styles.disable : styles.btn}`}
                disabled={cartTotal === 0 ? true : false}
            >Оформлення</button>
        </div>
    );
};

export default CartFooter;