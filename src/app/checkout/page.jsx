// import React from 'react';
// import styles from '../page.module.css';
// import Header from '@/components/commons/Header';
// import Main from "@/components/commons/Main";
// import Footer from '@/components/commons/Footer';

// const Checkout = () => {
//     return (
//         <>
//             <div className={styles.main}>
//                 <Header/>

//                 <Main>
//                     Checkout;
//                 </Main>
//             </div>

//             <Footer />
//         </>
//     );
// };

// export default Checkout;
"use client";

import React from 'react';
import { useQtySelectedItems, useGoodsInCart } from '@/context/AppContext';
import Header from '@/components/commons/Header';
import Main from "@/components/commons/Main";
import Footer from '@/components/commons/Footer';
import Flex from '@/components/ui/Flex';
import styles from "@/app/page.module.css";
import CheckoutForm from '@/components/checkout/CheckoutForm';
import OrderDetails from '@/components/checkout/OrderDetails';

const Checkout = () => {
    const { qtySelectedItems } = useQtySelectedItems();
    const { goodsInCart } = useGoodsInCart();

    return (
        <>
            <div className={styles.main}>
                <Header />

                <Main>
                    <h1>Оформлення замовлення</h1>
                    <Flex className="w_md col_sm" style={{alignItems:'flex-start'}}>
                        <CheckoutForm/>
                        <OrderDetails/>
                    </Flex>
                </Main>

            </div>
            <Footer />
        </>
    );
};

export default Checkout;
