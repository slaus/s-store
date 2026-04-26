import React from 'react';
import attention from "@styles/Attention.module.css";
import { BiMessageRoundedError } from "react-icons/bi";
import { useTranslations } from 'next-intl';

const Attention = () => {
    const t = useTranslations('cart');
    return (
        <div className={attention._}>
            <BiMessageRoundedError size={46} />
            <div className={attention.title}>{t('no_item')}</div>
            <div className={attention.desc}>{t('no_item_desc')}</div>
        </div>
    );
};

export default Attention;