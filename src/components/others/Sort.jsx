import React from 'react';
import styles from "./sort.module.css";
import { BiChevronDown, BiCheck } from "react-icons/bi"; 
import { useItemsSort, useSort } from '@/context/AppContext';
import { useTranslations } from 'next-intl';

const Sort = () => {
    const { itemsSort, setItemsSort } = useItemsSort();
    const { sort, setSort } = useSort();
    const t = useTranslations('product');

    const selectSortMethod = (option) => {
        setSort(option);
    }

    return (
        <div className={styles._}>
            {t('sort')}
            <button className={styles.dropbtn}>{sort} <BiChevronDown /></button>
            <div className={styles.content}>
                {itemsSort.map((option) => (
                    <button className={styles.btn} value={option} key={option} onClick={() => selectSortMethod(option)}>
                        {option === sort &&
                            <BiCheck className={styles.icon} fontSize={20} />
                        }
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Sort;