"use client";
import React from 'react';
import styles from './header.module.css';
import { BiMenuAltLeft, BiSearch, BiShoppingBag, BiStoreAlt } from "react-icons/bi";
import Logo from '@/components/others/Logo';
import Flex from '@/components/ui/Flex';
import Link from "next/link";
import { useQtySelectedItems } from '@/context/AppContext';

const phone = process.env.NEXT_PUBLIC_PHONE;

const Header = ({ page = "", setShowCart, setShowSearchBar, showSidebar, setShowSidebar }) => {

    const { qtySelectedItems } = useQtySelectedItems();

    const handleShowCart = () => {
        setShowCart(true);
    };

    const handleShowSearchBar = () => {
        setShowSearchBar(true);
    };

    const hideShowSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    return (
        <header className={styles._}>
            <div className={styles.block}>
                <Flex>
                    {page === 'home' &&
                        <button className={styles.hamburger} onClick={hideShowSidebar}>
                            <BiMenuAltLeft size={38} />
                        </button>
                    }
                    <Logo />
                </Flex>
                <Flex>
                    {page === 'home' ? (
                        <>
                            <a className={styles.phone} href={`tel:${phone}`}>{phone}</a>
                            <button className={styles.search} onClick={handleShowSearchBar}>
                                <BiSearch size={38} />
                            </button>
                            <button className={styles.cart} onClick={handleShowCart}>
                                <BiShoppingBag size={38} />
                                <div className={styles.qty}>{qtySelectedItems}</div>
                            </button>
                        </>
                    ) : (
                        <Link className={styles.store} href="/">
                            <BiStoreAlt size={38} />
                        </Link>
                    )}
                </Flex>
            </div>
        </header>
    );
};

export default Header;
