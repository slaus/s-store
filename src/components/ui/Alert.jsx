import React from "react";
import popup from "@styles/Alert.module.css";
import { useAlert } from "@/context/AppContext";

const Alert = () => {
  const { alert } = useAlert();

  if (!alert) return null;

  const alertClass = `${popup._} ${popup[`${alert.type}`]}`;

  return (
    <div className={alertClass}>
      {alert.text}
    </div>
  );
};

export default Alert;
