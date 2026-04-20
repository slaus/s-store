import React, { useState } from 'react';
import styles from "@/components/ui/slider-checkbox.module.css";

const SliderCheckbox = ({checked, onClick}) => {
  return (
    <div className={`${styles.slider} ${checked ? styles.checked : ''}`}
      onClick={onClick}
    >
      <div className={styles.circle}></div>
    </div>
  );
};

export default SliderCheckbox;
