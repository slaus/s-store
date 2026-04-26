import React from 'react';
import ClientOnly from "@/components/ClientOnly";
import Loading from '@/components/ui/Loading';
import mainContainer from "@styles/MainContainer.module.css";
import Bread from '@/components/others/Bread';
import ItemsGrid from './ItemsGrid';
import Banner from '../others/Banner';

const MainContainer = ({showSidebar}) => {
    return (
        <div className={`${showSidebar ? mainContainer._ : mainContainer._ + " " + mainContainer.full}`}>
            <Banner/>
            <Bread/>
            <ClientOnly fallback={<Loading/>}>
                <ItemsGrid/>
            </ClientOnly>
        </div>
    );
};

export default MainContainer;