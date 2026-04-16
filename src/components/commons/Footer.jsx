"use client";
import React from 'react';
import styles from "./footer.module.css";
import { BiLogoFacebookCircle, BiLogoInstagram, BiLogoTelegram, BiPhoneCall } from "react-icons/bi";
import { useTranslations } from 'next-intl';

const facebook = process.env.NEXT_PUBLIC_FACEBOOK_URL;
const instagram = process.env.NEXT_PUBLIC_INSTAGRAM_URL;
const phone = process.env.NEXT_PUBLIC_PHONE;
const telegram = process.env.NEXT_PUBLIC_TELEGRAM_URL;
const viber = process.env.NEXT_PUBLIC_VIBER_URL;

const Footer = () => {
    const t = useTranslations('common');
    const currentYear = new Date().getFullYear();
    return (
        <footer className={styles._}>
            <div className={styles.block}>
                <div><a href="https://site404.in.ua" target="_blank" rel="noopener noreferrer">Site404</a> &copy; {currentYear} | {t('phone')} <a className={styles.phone} href={`tel:${phone}`}>{phone}</a></div>
                <div className={styles.links}>
                    <a href={facebook} target='_blank'>
                        <BiLogoFacebookCircle size={36} />
                    </a>
                    <a href={instagram} target='_blank'>
                        <BiLogoInstagram size={36} />
                    </a>
                    <a href={telegram} target='_blank'>
                        <BiLogoTelegram size={36} />
                    </a>
                    <a href={viber} target='_blank'>
                        <BiPhoneCall size={36} />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;