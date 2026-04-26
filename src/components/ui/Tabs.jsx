"use client";
import React, { useState } from "react";
import tabs from "@styles/Tabs.module.css";

const TabsContext = React.createContext();

const Tabs = ({ children, defaultIndex = 0 }) => {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  return (
    <TabsContext.Provider value={{ activeIndex, setActiveIndex }}>
      <div className={tabs._}>{children}</div>
    </TabsContext.Provider>
  );
};

const Nav = ({ children }) => {
  const { activeIndex, setActiveIndex } = React.useContext(TabsContext);
  return (
    <div className={tabs.nav}>
      {React.Children.map(children, (child, index) => (
        <button
          key={index}
          type="button"
          className={`${tabs.btn} ${activeIndex === index ? tabs.active : ""}`}
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
    <div className={tabs.container}>
      {React.Children.toArray(children)[activeIndex]}
    </div>
  );
};

Tabs.Nav = Nav;
Tabs.Container = Container;

export default Tabs;