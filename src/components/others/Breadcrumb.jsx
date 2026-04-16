import React from 'react';
import styles from './breadcrumb.module.css';
import { BiChevronRight } from "react-icons/bi";
import { useSelectedCategory } from '@/context/AppContext';
import { useTranslations } from 'next-intl';

const Breadcrumb = () => {
    const t = useTranslations('product');
    const { selectedCategory } = useSelectedCategory();

    return (
        <nav className={styles._}>
            <ol className={styles.ol}>
                <li className={styles.li}>
                    <span className={styles.link}>{t('all')}</span>
                </li>
                {selectedCategory &&
                    <>
                    <li className={styles.li}>
                        <BiChevronRight size={22}/>
                    </li>
                    <li className={styles.li}>
                        <span className={styles.link}>{selectedCategory}</span>
                    </li>
                    </>
                }
            </ol>
        </nav>
    );
};

export default Breadcrumb;