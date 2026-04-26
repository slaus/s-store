import React from 'react';
import flex from '@styles/Flex.module.css';

const Flex = ({children, className="", style}) => {

    const combinedClassName = className.split(' ').map((cls) => flex[cls]).join(' ');

    return (
        <div className={`${flex._} ${combinedClassName}`} style={style}>
            {children}
        </div>
    );
};

export default Flex;