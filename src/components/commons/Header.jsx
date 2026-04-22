"use client";
import React, { useState, useEffect } from "react";
import {
  BiMenuAltLeft,
  BiSearch,
  BiShoppingBag,
  BiStoreAlt,
} from "react-icons/bi";
import Logo from "@/components/others/Logo";
import Flex from "@/components/ui/Flex";
import { useRouter } from "next/navigation";
import { useQtySelectedItems } from "@/context/AppContext";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { useLocale } from "next-intl";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";
import Button from "@/components/ui/Button";
import styles from "./header.module.css";
import buttons from "@/components/ui/button.module.css";

const phone = process.env.NEXT_PUBLIC_PHONE;

const Header = ({
  page = "",
  setShowCart,
  setShowSearchBar,
  showSidebar,
  setShowSidebar,
}) => {
  const { qtySelectedItems } = useQtySelectedItems();
  const router = useRouter();
  const locale = useLocale();
  const [hidden, setHidden] = useState(false);

  const handleShowCart = () => {
    setShowCart(true);
  };

  const handleShowSearchBar = () => {
    setShowSearchBar(true);
  };

  const hideShowSidebar = () => {
    setShowSidebar(!showSidebar);
    if (window.innerWidth <= 767) {
      hiddenBody(showSidebar);
    }
  };

  const hiddenBody = (showSidebar) => {
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    if (!showSidebar) {
      document.body.classList.add("hidden");
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.classList.remove("hidden");
      document.body.style.paddingRight = "";
    }
  };

  return (
    <header className={styles._}>
      <div className={styles.block}>
        <Flex className="w-100">
          <Logo />
          <a className={styles.phone} href={`tel:${phone}`}>
            {phone}
          </a>
        </Flex>
        <Flex>
          {page === "home" ? (
            <>
              <LanguageSwitcher />
              <ThemeSwitcher />
              <Button
                className={buttons.transparent}
                onClick={handleShowSearchBar}
              >
                <BiSearch size={28} />
              </Button>
              <Button className={buttons.transparent} onClick={handleShowCart}>
                <BiShoppingBag size={26} />
                <div className={buttons.qty}>{qtySelectedItems}</div>
              </Button>
              <Button className={buttons.transparent} onClick={hideShowSidebar}>
                <BiMenuAltLeft size={29} />
              </Button>
            </>
          ) : (
            <Button
              className={buttons.transparent}
              onClick={() => router.push(`/${locale}`)}
            >
              <BiStoreAlt size={26} />
            </Button>
          )}
        </Flex>
      </div>
    </header>
  );
};

export default Header;
