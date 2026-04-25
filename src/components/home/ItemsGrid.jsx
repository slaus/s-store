import React from "react";
import styles from "./items-grid.module.css";
import ItemsCard from "./ItemCard";
import Loading from "@/components/ui/Loading";
import {
  useItems,
  useSelectedCategory,
  useItemsSort,
  useSort,
  useSearch,
} from "@/context/AppContext";
import { useTranslations } from "next-intl";

const ItemsGrid = () => {
  const t = useTranslations("product");
  const { items, loadingItems } = useItems();
  const { sort } = useSort();
  const { selectedCategory } = useSelectedCategory();
  const { searchValue } = useSearch();

  if (loadingItems) {
    return <Loading />;
  }

  // console.log(items);

  const filteredItems = items
    // .filter((item) => (item.visible !== undefined ? item.visible : true))
    .filter((item) => !selectedCategory || item.category === selectedCategory)
    .filter((item) =>
      item.title.toLowerCase().includes(searchValue.toLowerCase()),
    );

  const sortItems = (itemsToSort, sortType) => {
    switch (sortType) {
      case "Зростанням ID":
        return itemsToSort
          .slice()
          .sort((a, b) => (a.sku || "").localeCompare(b.sku || ""));
      case "Спаданням ID":
        return itemsToSort
          .slice()
          .sort((a, b) => (b.sku || "").localeCompare(a.sku || ""));
      case "Назвою (А-Я)":
        return itemsToSort
          .slice()
          .sort((a, b) => a.title.localeCompare(b.title));
      case "Назвою (Я-А)":
        return itemsToSort
          .slice()
          .sort((a, b) => b.title.localeCompare(a.title));
      case "Ціною (Мін.)":
        return itemsToSort
          .slice()
          .sort(
            (a, b) => (a.offerPrice || a.price) - (b.offerPrice || b.price),
          );
      case "Ціною (Макс.)":
        return itemsToSort
          .slice()
          .sort(
            (a, b) => (b.offerPrice || b.price) - (a.offerPrice || a.price),
          );
      default:
        return itemsToSort;
    }
  };

  const sortedItems = sortItems(filteredItems, sort);

  return (
    <>
      {sortedItems.length > 0 ? (
        <div className={styles._}>
          {sortedItems.map((item) => (
            <ItemsCard item={item} key={item.sku} />
          ))}
        </div>
      ) : (
        <div className={styles.error}>
          {t.rich("not_found", {
            search: searchValue,
            b: (chunks) => <b style={{ margin: "0 5px" }}>{chunks}</b>,
          })}
        </div>
      )}
    </>
  );
};

export default ItemsGrid;
