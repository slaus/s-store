import React from 'react';
import styles from "./counter-btn.module.css";
import { BiPlus, BiMinus } from "react-icons/bi";
import Button from '../ui/Button';
import { useRefreshCart,useAlert } from '@/context/AppContext';
import { useTranslations } from 'next-intl';

const CounterBtn = ({ type = "default", counter = 0, item }) => {
    const t = useTranslations('common');
    const a = useTranslations('alert');
    const { refreshCart } = useRefreshCart();
    const { showAlert } = useAlert();

    const addItem = (e) => {
        e.preventDefault();
        refreshCart({ item, n: counter + 1 });
        showAlert(a('added'), "success");
    };

    const removeItem = (e) => {
        e.preventDefault();
        if (counter === 1) {
            showAlert(a('removed'), "error");
        }
        refreshCart({ item, n: counter - 1 });
    };
   
    if (type === "cart") {
        return (
            <div className={styles._}>
                <button type="button" className={styles.btn} onClick={() => refreshCart({ item, n: item.qty - 1 })}>
                    <BiMinus size={22} />
                </button>
                <p className={styles.text}>{item.qty || 1}</p>
                <button type="button" className={styles.btn} onClick={() => refreshCart({ item, n: item.qty + 1 })}>
                    <BiPlus size={22} />
                </button>
            </div>
        );
    }

    return (
        <>
            {counter === 0 ? (
                <Button type="button" onClick={addItem}>{t('add_to_cart')}</Button>
            ) : (
                <div className={styles._}>
                    <button type="button" className={styles.btn} onClick={removeItem}>
                        <BiMinus size={22} />
                    </button>
                    <p className={styles.text}>{counter || 1}</p>
                    <button type="button" className={styles.btn} onClick={() => refreshCart({ item, n: counter + 1 })}>
                        <BiPlus size={22} />
                    </button>
                </div>
            )}
        </>
    );
};

export default CounterBtn;