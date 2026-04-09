import React, { useState } from 'react';
import styles from "@/components/ui/slider-checkbox.module.css";
import {useDelivery, useDeliveryFee, useOrderDetails} from '@/context/AppContext';

const SliderCheckbox = () => {

  const { delivery, setDelivery } = useDelivery();
  const { deliveryFee, setDeliveryFee } = useDeliveryFee();
  const [checked, setChecked] = useState(delivery);
  const { cartItems } = useOrderDetails();
  console.log("cartItems " + cartItems.length);

  const toggleChecked = () => {
    if (cartItems.length === 0) return;
    setChecked(!checked);
    setDelivery(!delivery);
  };

  return (
    <div
      className={`${styles.slider} ${checked ? styles.checked : ''}`}
      onClick={toggleChecked}
    >
      <div className={styles.circle}></div>
    </div>
  );
};

export default SliderCheckbox;
