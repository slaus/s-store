import React from 'react';
import styles from "./attention.module.css";
import { BiMessageRoundedError } from "react-icons/bi";

const Attention = () => {
    return (
        <div className={styles._}>
            <BiMessageRoundedError size={46} />
            <div className={styles.title}>Немає товарів у кошику!</div>
            <div className={styles.desc}>Ваш кошик порожній. Ви ще нічого не купили.</div>
        </div>
    );
};

export default Attention;