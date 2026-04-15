import React, { useState } from "react";
import styles from "./search.module.css";
import { BiSearch } from "react-icons/bi";
import { IoCloseOutline } from "react-icons/io5";
import { useSearch } from "@/context/AppContext";

const Search = ({ showSearchBar, setShowSearchBar }) => {
  const { searchValue, setSearchValue } = useSearch();

  const handleSubmit = (e) => {
    e.preventDefault();
    // setSearchQuery(search);
  };

  const handleChange = (e) => {
    if (e.target.value === "") {
      setTimeout(() => {
        setSearchValue("");
      }, 0);
    } else {
      setSearchValue(e.target.value);
    }
  };

  const hideSearchBar = () => {
    setSearchValue("");
    setShowSearchBar(false);
  };

  return (
    <div className={`${styles._} ${showSearchBar ? styles.show : ""}`}>
      <div className={styles.block}>
        <div className={styles.div}></div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            onChange={handleChange}
            type="search"
            placeholder="Пошук товару"
            className={styles.input}
            value={searchValue}
          />
          <div className={styles.search}>
            <button>
              <BiSearch size={30} />
            </button>
          </div>
        </form>
        <button className={styles.close} onClick={hideSearchBar}>
          <IoCloseOutline size={36} />
        </button>
      </div>
    </div>
  );
};

export default Search;
