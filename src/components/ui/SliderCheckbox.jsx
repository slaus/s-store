import React, { useState } from 'react';
import checkbox from "@styles/SliderCheckbox.module.css";

const SliderCheckbox = ({checked, toggleChecked}) => {
  return (
    <div className={`${checkbox.slider} ${checked ? checkbox.checked : ''}`}
      onClick={toggleChecked}
    >
      <div className={checkbox.circle}></div>
    </div>
  );
};

export default SliderCheckbox;
