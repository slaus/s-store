import React from 'react';
import overlay from "@styles/Overlay.module.css";

const Overlay = ({children}) => {
    return (
        <div className={overlay._}>{children}</div>
    );
};

export default Overlay;