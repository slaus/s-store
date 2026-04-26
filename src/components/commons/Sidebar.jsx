import React from 'react';
import sidebar from "@styles/Sidebar.module.css";
import { BiMinus, BiPlus } from "react-icons/bi";
import { useItems, useSelectedCategory } from '@/context/AppContext';
import { useTranslations } from 'next-intl';

const Sidebar = ({ showSidebar, mobile, setShowSidebar }) => {
    const t = useTranslations('product');
    const { items } = useItems();
    const { selectedCategory, setSelectedCategory } = useSelectedCategory();
    const uniqueCategories = [...new Set(items.map(item => item.category))];

    const handleClick = (category) => {
        setSelectedCategory(category);
        if (mobile) {
            setShowSidebar(false);
        }
    };

    const handleShowAll = () => {
        setSelectedCategory('');
        if (mobile) {
            setShowSidebar(false);
        }
    };

    return (
        <>
            <aside className={`${showSidebar ? sidebar._ + " " + sidebar.open : sidebar._}`}>
                <div className={sidebar.radiogroup}>
                    <button
                        type="button"
                        className={`${selectedCategory === '' ? sidebar.btn + " " + sidebar.active : sidebar.btn}`}
                        onClick={handleShowAll}
                    >
                        <div className={sidebar.item}>
                            {selectedCategory === '' ? <BiPlus size={26} /> : <BiMinus size={26} />}
                            {t('all')}
                        </div>
                    </button>

                    {uniqueCategories.map((category, index) => (
                        <button
                            type="button"
                            className={`${selectedCategory === category ? sidebar.btn + " " + sidebar.active : sidebar.btn}`}
                            key={index}
                            onClick={() => handleClick(category)}
                        >
                            <div className={sidebar.item}>
                                {selectedCategory === category ? <BiPlus size={26} /> : <BiMinus size={26} />}
                                {category}
                            </div>
                        </button>
                    ))}
                </div>
            </aside>
            {mobile && showSidebar && <div className={sidebar.overlay} onClick={() => setShowSidebar(false)}></div>}
        </>
    );
};

export default Sidebar;