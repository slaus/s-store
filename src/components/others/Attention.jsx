import React from 'react';
import styles from "./attention.module.css";
import { BiMessageRoundedError } from "react-icons/bi";
import { useTranslations } from 'next-intl';

const Attention = () => {
    const t = useTranslations('cart');
    return (
        <div className={styles._}>
            <BiMessageRoundedError size={46} />
            <div className={styles.title}>{t('no_item')}</div>
            <div className={styles.desc}>{t('no_item_desc')}</div>
        </div>
    );
};

export default Attention;