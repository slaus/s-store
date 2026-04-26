import React, { useState } from "react";
import search from "@styles/Search.module.css";
import { BiSearch } from "react-icons/bi";
import { IoCloseOutline } from "react-icons/io5";
import { useSearch } from "@/context/AppContext";
import { useTranslations } from "next-intl";

const Search = ({ showSearchBar, setShowSearchBar }) => {
  const t = useTranslations('common');
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
    <div className={`${search._} ${showSearchBar ? search.show : ""}`}>
      <div className={search.block}>
        <div className={search.div}></div>
        <form className={search.form} onSubmit={handleSubmit}>
          <input
            onChange={handleChange}
            type="search"
            placeholder={t('search')}
            className={search.input}
            value={searchValue}
          />
          <div className={search.search}>
            <button>
              <BiSearch size={30} />
            </button>
          </div>
        </form>
        <button className={search.close} onClick={hideSearchBar}>
          <IoCloseOutline size={36} />
        </button>
      </div>
    </div>
  );
};

export default Search;
