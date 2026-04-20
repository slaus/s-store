"use client";
import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

const ItemsContext = createContext();
const SelectedCategoryContext = createContext();
const ItemsSortContext = createContext();
const SortContext = createContext();
const QtySelectedItemsContext = createContext();
const GoodsInCartContext = createContext();
const CartLengthContext = createContext();
const CartTotalContext = createContext();
const DeliveryContext = createContext();
const DeliveryFeeContext = createContext();
const FormStateContext = createContext();
const AlertContext = createContext();
const SearchContext = createContext();

export const useItems = () => useContext(ItemsContext);
export const useSelectedCategory = () => useContext(SelectedCategoryContext);
export const useItemsSort = () => useContext(ItemsSortContext);
export const useSort = () => useContext(SortContext);
export const useQtySelectedItems = () => useContext(QtySelectedItemsContext);
export const useGoodsInCart = () => useContext(GoodsInCartContext);
export const useCartLength = () => useContext(CartLengthContext);
export const useCartTotal = () => useContext(CartTotalContext);
export const useDelivery = () => useContext(DeliveryContext);
export const useDeliveryFee = () => useContext(DeliveryFeeContext);
export const useFormState = () => useContext(FormStateContext);
export const useAlert = () => useContext(AlertContext);
export const useSearch = () => useContext(SearchContext);

export const useRefreshCart = () => {
  const { goodsInCart, setGoodsInCart } = useGoodsInCart();
  const { setQtySelectedItems } = useQtySelectedItems();
  const { setCartLength } = useCartLength();
  const { setCartTotal } = useCartTotal();

  const refreshCart = useCallback(
    ({ item, n }) => {
      const currentCart = { ...goodsInCart };
      const key = item.sku;

      if (n === 1) {
        currentCart[key] = { ...item, qty: 1 };
      } else if (n > 1) {
        currentCart[key] = { ...item, qty: n };
      } else if (n < 1) {
        delete currentCart[key];
      }

      const cartToArray = Object.values(currentCart);
      let total = 0;
      cartToArray.forEach((item) => {
        const actualPrice = item.offerPrice || item.price;
        total += actualPrice * item.qty;
      });

      setGoodsInCart(currentCart);
      setQtySelectedItems(cartToArray.length);
      setCartTotal(total);
    },
    [
      goodsInCart,
      setGoodsInCart,
      setQtySelectedItems,
      setCartLength,
      setCartTotal,
    ],
  );

  return { refreshCart };
};

export const useReset = () => {
  const { setSelectedCategory } = useSelectedCategory();
  const { setSort } = useSort();
  const { setQtySelectedItems } = useQtySelectedItems();
  const { setDelivery } = useDelivery();
  const { setGoodsInCart } = useGoodsInCart();
  const { setCartLength } = useCartLength();
  const { setCartTotal } = useCartTotal();
  const { setFormState } = useFormState();
  const t = useTranslations("product");

  const reset = useCallback(() => {
    setSelectedCategory("");
    setSort(t("default"));
    setQtySelectedItems(0);
    setDelivery(false);
    setGoodsInCart({});
    setCartLength(0);
    setCartTotal(0);
    setFormState({});
  }, [
    setSelectedCategory,
    setSort,
    setQtySelectedItems,
    setDelivery,
    setGoodsInCart,
    setCartLength,
    setCartTotal,
    setFormState,
    t,
  ]);

  return reset;
};

export const useIsInCart = (item) => {
  const { goodsInCart } = useGoodsInCart();
  return goodsInCart[item.sku] ? goodsInCart[item.sku].qty : 0;
};

export const useOrderDetails = () => {
  const { goodsInCart } = useGoodsInCart();
  const { cartTotal } = useCartTotal();
  const { delivery } = useDelivery();
  const { deliveryFee } = useDeliveryFee();
  const { formState } = useFormState();

  const orderDetails = useMemo(() => {
    const cartItems = Object.values(goodsInCart);
    const subTotal = cartTotal;
    const shippingCost = delivery ? deliveryFee : 0;
    const total = subTotal + shippingCost;

    return {
      cartItems,
      subTotal: subTotal.toFixed(0),
      withDelivery: delivery,
      shippingCost: shippingCost.toFixed(0),
      total: total.toFixed(0),
      formData: formState,
    };
  }, [goodsInCart, cartTotal, delivery, deliveryFee, formState]);

  return orderDetails;
};

export const AppProviders = ({ children }) => {
  const params = useParams();
  const locale = params?.locale || "uk";
  const t = useTranslations("product");

  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);

  const loadProducts = useCallback(() => {
    setLoadingItems(true);
    fetch(`/api/products?lang=${locale}&_=${Date.now()}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setLoadingItems(false);
      })
      .catch((err) => {
        console.error("Failed to load products", err);
        setLoadingItems(false);
      });
  }, [locale]);

  useEffect(() => {
    loadProducts();
  }, [locale, loadProducts]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "products_last_update") {
        loadProducts();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [locale, loadProducts]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [itemsSort, setItemsSort] = useState([
    t("default"),
    t("asc_id"),
    t("desc_id"),
    t("asc_name"),
    t("desc_name"),
    t("asc_price"),
    t("desc_price"),
  ]);
  const [sort, setSort] = useState(t("default"));

  // Инициализация корзины из localStorage
  const [goodsInCart, setGoodsInCart] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("lavka_cart");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return parsed.goodsInCart || {};
        } catch (e) {
          console.error("Failed to parse cart from localStorage", e);
        }
      }
    }
    return {};
  });

  // СИНХРОНИЗАЦИЯ КОРЗИНЫ С АКТУАЛЬНЫМИ ТОВАРАМИ (после объявления goodsInCart)
  useEffect(() => {
    if (items.length === 0) return;
    setGoodsInCart((prevCart) => {
      let newCart = { ...prevCart };
      let changed = false;
      Object.keys(newCart).forEach((sku) => {
        const freshItem = items.find((i) => i.sku === sku);
        if (freshItem) {
          const old = newCart[sku];
          if (
            old.title !== freshItem.title ||
            old.price !== freshItem.price ||
            old.offerPrice !== freshItem.offerPrice ||
            old.img !== (freshItem.img || freshItem.images?.[0] || "")
          ) {
            newCart[sku] = {
              ...old,
              sku: freshItem.sku,
              title: freshItem.title,
              price: freshItem.price,
              offerPrice: freshItem.offerPrice,
              img: freshItem.img || freshItem.images?.[0] || "",
            };
            changed = true;
          }
        } else {
          delete newCart[sku];
          changed = true;
        }
      });
      return changed ? newCart : prevCart;
    });
  }, [items]);

  const [delivery, setDelivery] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("lavka_cart");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return parsed.delivery || false;
        } catch (e) {
          return false;
        }
      }
    }
    return false;
  });

  const [qtySelectedItems, setQtySelectedItems] = useState(0);
  const [cartLength, setCartLength] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  const recalcCartDerivatives = useCallback((cart) => {
    const itemsArray = Object.values(cart);
    const uniqueCount = itemsArray.length;
    let totalUnits = 0;
    let totalSum = 0;
    itemsArray.forEach((item) => {
      const qty = item.qty || 0;
      totalUnits += qty;
      const price = item.offerPrice || item.price;
      totalSum += price * qty;
    });
    setQtySelectedItems(uniqueCount);
    setCartLength(totalUnits);
    setCartTotal(totalSum);
  }, []);

  useEffect(() => {
    recalcCartDerivatives(goodsInCart);
  }, [goodsInCart, recalcCartDerivatives]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const toSave = {
        goodsInCart,
        delivery,
      };
      localStorage.setItem("lavka_cart", JSON.stringify(toSave));
    }
  }, [goodsInCart, delivery]);

  const [deliveryFee, setDeliveryFee] = useState(80);
  const [formState, setFormState] = useState({});
  const [alert, setAlert] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  const showAlert = (text, type = "success") => {
    setAlert({ text, type });
    setTimeout(() => setAlert(null), 4000);
  };

  return (
    <AlertContext.Provider value={{ alert, showAlert }}>
      <ItemsContext.Provider value={{ items, setItems, loadingItems }}>
        <SelectedCategoryContext.Provider
          value={{ selectedCategory, setSelectedCategory }}
        >
          <ItemsSortContext.Provider value={{ itemsSort, setItemsSort }}>
            <SortContext.Provider value={{ sort, setSort }}>
              <QtySelectedItemsContext.Provider
                value={{ qtySelectedItems, setQtySelectedItems }}
              >
                <GoodsInCartContext.Provider
                  value={{ goodsInCart, setGoodsInCart }}
                >
                  <CartLengthContext.Provider
                    value={{ cartLength, setCartLength }}
                  >
                    <CartTotalContext.Provider
                      value={{ cartTotal, setCartTotal }}
                    >
                      <DeliveryContext.Provider
                        value={{ delivery, setDelivery }}
                      >
                        <DeliveryFeeContext.Provider
                          value={{ deliveryFee, setDeliveryFee }}
                        >
                          <FormStateContext.Provider
                            value={{ formState, setFormState }}
                          >
                            <SearchContext.Provider
                              value={{ searchValue, setSearchValue }}
                            >
                              {children}
                            </SearchContext.Provider>
                          </FormStateContext.Provider>
                        </DeliveryFeeContext.Provider>
                      </DeliveryContext.Provider>
                    </CartTotalContext.Provider>
                  </CartLengthContext.Provider>
                </GoodsInCartContext.Provider>
              </QtySelectedItemsContext.Provider>
            </SortContext.Provider>
          </ItemsSortContext.Provider>
        </SelectedCategoryContext.Provider>
      </ItemsContext.Provider>
    </AlertContext.Provider>
  );
};
