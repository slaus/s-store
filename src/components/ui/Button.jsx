import React from 'react';
import btn from "@styles/Button.module.css";

const Button = ({children, onClick, className, type = "button"}) => {
    return (
        <button onClick={onClick} type={type} className={`${btn._} ${className || ''}`}>{children}</button>
    );
};

export default Button;