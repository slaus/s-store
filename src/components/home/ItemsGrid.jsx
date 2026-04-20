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
  const t = useTranslations('product');
  const { items, loadingItems } = useItems();
  const { sort } = useSort();
  const { selectedCategory } = useSelectedCategory();
  const { searchValue } = useSearch();

  if (loadingItems) {
    return <Loading />;
  }

  const filteredItems = items
    // .filter((item) => (item.visible !== undefined ? item.visible : true))
    .filter((item) => !selectedCategory || (item.category === selectedCategory))
    .filter((item) =>
      item.title.toLowerCase().includes(searchValue.toLowerCase())
    );

  const sortItems = (itemsToSort, sortType) => {
    switch (sortType) {
      case t('asc_id'):
        return itemsToSort.slice().sort((a, b) => a.id.localeCompare(b.id));
      case t('desc_id'):
        return itemsToSort.slice().sort((a, b) => b.id.localeCompare(a.id));
      case t('asc_name'):
        return itemsToSort.slice().sort((a, b) => a.title.localeCompare(b.title));
      case t('desc_name'):
        return itemsToSort.slice().sort((a, b) => b.title.localeCompare(a.title));
      case t('asc_price'):
        return itemsToSort.slice().sort((a, b) => (a.offerPrice || a.price) - (b.offerPrice || b.price));
      case t('desc_price'):
        return itemsToSort.slice().sort((a, b) => (b.offerPrice || b.price) - (a.offerPrice || a.price));
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
          {t.rich('not_found', {
            search: searchValue,
            b: (chunks) => <b style={{margin: '0 5px'}}>{chunks}</b>
          })}
        </div>
      )}
    </>
  );
};

export default ItemsGrid;