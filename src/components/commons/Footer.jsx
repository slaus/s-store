import React from 'react';
import styles from "./footer.module.css";
import { BiLogoFacebookCircle, BiLogoInstagram, BiLogoTelegram, BiPhoneCall } from "react-icons/bi";

const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className={styles._}>
            <div className={styles.block}>
                <div><a href="https://site404.in.ua" target="_blank" rel="noopener noreferrer">Site404</a> &copy; {currentYear}</div>
                <div className={styles.links}>
                    <a href="https://www.facebook.com/tat.ana.pantelemonova" target='_blank'>
                        <BiLogoFacebookCircle size={36} />
                    </a>
                    <a href="https://www.instagram.com/perepel.club.ukraine" target='_blank'>
                        <BiLogoInstagram size={36} />
                    </a>
                    <a href="#" target='_blank'>
                        <BiLogoTelegram size={36} />
                    </a>
                    <a href="#" target='_blank'>
                        <BiPhoneCall size={36} />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;