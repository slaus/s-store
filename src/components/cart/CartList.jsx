import React from 'react';
import cartList from "@styles/CartList.module.css";
import Attention from '../others/Attention';
import CartItem from './CartItem';
import { useGoodsInCart } from '@/context/AppContext';

const CartList = () => {

    const { goodsInCart } = useGoodsInCart();
    
    return (
        <>
            {Object.values(goodsInCart).length === 0 ? (
                <Attention />
            ) : (
                <div className={cartList._}>
                    {Object.values(goodsInCart).map(item => (
                        <CartItem item={item} key={item.sku} />
                    ))}
                </div>
            )}
        </>
    );
};

export default CartList;