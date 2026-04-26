import React from 'react';
import flex from '@styles/Flex.module.css';

const FlexCol = ({children, className}) => {
    return (
        <div className={`${className ? flex._ + " " + flex.col + " " + className : flex._+ " " + flex.col}`}>
            {children}
        </div>
    );
};

export default FlexCol;