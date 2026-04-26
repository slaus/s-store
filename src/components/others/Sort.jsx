import React from 'react';
import sortDropdown from "@styles/Sort.module.css";
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
        <div className={sortDropdown._}>
            {t('sort')}
            <button className={sortDropdown.dropbtn}>{sort} <BiChevronDown /></button>
            <div className={sortDropdown.content}>
                {itemsSort.map((option) => (
                    <button className={sortDropdown.btn} value={option} key={option} onClick={() => selectSortMethod(option)}>
                        {option === sort &&
                            <BiCheck className={sortDropdown.icon} fontSize={20} />
                        }
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Sort;