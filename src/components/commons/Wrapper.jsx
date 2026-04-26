import React from 'react';
import wrapper from "@styles/Wrapper.module.css";

const Wrapper = ({children}) => {
    return (
        <div className={wrapper._}>
            {children}
        </div>
    );
};

export default Wrapper;