import React from 'react';
import main from "@styles/Main.module.css";

const Main = ({children}) => {
    return (
        <main className={main._}>
            {children}
        </main>
    );
};

export default Main;