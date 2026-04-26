import React from 'react';
import banner from "@styles/Banner.module.css";

const Banner = () => {
    return (
        <div className={banner._}>
            <img className={banner.img} src="/images/banner-bg.webp" />
        </div>
    );
};

export default Banner;