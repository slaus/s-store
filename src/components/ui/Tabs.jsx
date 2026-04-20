"use client";
import React, { useState } from "react";
import styles from "./tabs.module.css";

const TabsContext = React.createContext();

const Tabs = ({ children, defaultIndex = 0 }) => {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  return (
    <TabsContext.Provider value={{ activeIndex, setActiveIndex }}>
      <div className={styles._}>{children}</div>
    </TabsContext.Provider>
  );
};

const Nav = ({ children }) => {
  const { activeIndex, setActiveIndex } = React.useContext(TabsContext);
  return (
    <div className={styles.nav}>
      {React.Children.map(children, (child, index) => (
        <button
          key={index}
          type="button"
          className={`${styles.btn} ${activeIndex === index ? styles.active : ""}`}
          onClick={() => setActiveIndex(index)}
        >
          {child.props.label || child}
        </button>
      ))}
    </div>
  );
};

const Container = ({ children }) => {
  const { activeIndex } = React.useContext(TabsContext);
  return (
    <div className={styles.container}>
      {React.Children.toArray(children)[activeIndex]}
    </div>
  );
};

Tabs.Nav = Nav;
Tabs.Container = Container;

export default Tabs;