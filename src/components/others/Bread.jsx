import React from 'react';
import bread from '@styles/Bread.module.css';
import Sort from '@/components/others/Sort';
import Breadcrumb from '@/components/others/Breadcrumb';
import { useSelectedCategory } from '@/context/AppContext';

const Bread = () => {
    const { selectedCategory } = useSelectedCategory();
    return (
        <div className={bread._}>
            <Breadcrumb selectedCategory={selectedCategory} />
            <Sort />
        </div>
    );
};

export default Bread;