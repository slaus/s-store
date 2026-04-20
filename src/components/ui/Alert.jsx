import React from "react";
import styles from "./alert.module.css";
import { useAlert } from "@/context/AppContext";

const Alert = () => {
  const { alert } = useAlert();

  if (!alert) return null;

  const alertClass = `${styles.alert} ${styles[`alert-${alert.type}`]}`;

  return (
    <div className={alertClass}>
      {alert.text}
    </div>
  );
};

export default Alert;
