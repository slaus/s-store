"use client";
import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useMemo,
  useEffect,
} from "react";

// Contexts
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

// Custom hooks for accessing contexts
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

// Hook for refreshing the cart state
export const useRefreshCart = () => {
  const { goodsInCart, setGoodsInCart } = useGoodsInCart();
  const { setQtySelectedItems } = useQtySelectedItems();
  const { setCartLength } = useCartLength();
  const { setCartTotal } = useCartTotal();

  const refreshCart = useCallback(
    ({ item, n }) => {
      const currentCart = { ...goodsInCart };

      if (n === 1) {
        // Add item to cart
        currentCart[item.id] = { ...item, qty: 1 };
      } else if (n > 0 && n <= item.stock) {
        // Update item quantity in cart
        currentCart[item.id] = { ...item, qty: n };
      } else if (n < 1) {
        // Remove item from cart
        delete currentCart[item.id];
      }

      const cartToArray = Object.values(currentCart);
      let total = 0;
      cartToArray.forEach((item) => {
        const actualPrice = item.offerPrice || item.price;
        total += actualPrice * item.qty;
      });

      setGoodsInCart(currentCart); // Update cart state
      setQtySelectedItems(cartToArray.length); // Update cart length
      setCartTotal(total); // Update cart total
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

// Reset
export const useReset = () => {
  const { setSelectedCategory } = useSelectedCategory();
  const { setSort } = useSort();
  const { setQtySelectedItems } = useQtySelectedItems();
  const { setDelivery } = useDelivery();
  const { setGoodsInCart } = useGoodsInCart();
  const { setCartLength } = useCartLength();
  const { setCartTotal } = useCartTotal();
  const { setFormState } = useFormState();

  const reset = useCallback(() => {
    setSelectedCategory("");
    setSort("Замовчуванням");
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
  ]);

  return reset;
};

// Hook for checking if an item is in the cart
export const useIsInCart = (item) => {
  const { goodsInCart } = useGoodsInCart();
  return goodsInCart[item.id] ? goodsInCart[item.id].qty : 0;
};

// Hook for getting order details
export const useOrderDetails = () => {
  const { goodsInCart } = useGoodsInCart();
  const { cartTotal } = useCartTotal();
  const { delivery } = useDelivery();
  const { deliveryFee } = useDeliveryFee();
  const { formState } = useFormState();

  // Calculating order details
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

// AppProviders component to provide all contexts
export const AppProviders = ({ children }) => {
  // Ініціалізація товарів та фільтрів
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoadingItems(false));
  }, []);
  
  const [selectedCategory, setSelectedCategory] = useState("");
  const [itemsSort, setItemsSort] = useState([
    "Замовчуванням",
    "Зростанням ID",
    "Спаданням ID",
    "Назвою (А-Я)",
    "Назвою (Я-А)",
    "Ціною (Мін.)",
    "Ціною (Макс.)",
  ]);
  const [sort, setSort] = useState("Замовчуванням");

  // Завантаження кошика з localStorage (лише goodsInCart та delivery)
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

  // Похідні стани: кількість унікальних товарів, загальна кількість одиниць, загальна сума
  const [qtySelectedItems, setQtySelectedItems] = useState(0);
  const [cartLength, setCartLength] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  // Функція перерахунку похідних величин на основі вмісту кошика
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

  // При зміні вмісту кошика перераховуємо похідні
  useEffect(() => {
    recalcCartDerivatives(goodsInCart);
  }, [goodsInCart, recalcCartDerivatives]);

  // Зберігаємо goodsInCart та delivery у localStorage при кожній зміні
  useEffect(() => {
    if (typeof window !== "undefined") {
      const toSave = {
        goodsInCart,
        delivery,
      };
      localStorage.setItem("lavka_cart", JSON.stringify(toSave));
    }
  }, [goodsInCart, delivery]);

  // Інші стани (не зберігаються в localStorage)
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
      <ItemsContext.Provider value={{ items, setItems }}>
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
