import { createContext, useEffect, useState } from "react";
import { food_list } from "../assets/assets";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [pendingItem, setPendingItem] = useState(null); // Store the item ID temporarily

  const addToCart = (itemId, setShowLogin, setIsSignUp) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      // If user is not logged in, store the item ID and show the login popup
      setPendingItem(itemId);
      setShowLogin(true);
      setIsSignUp(false); // Set to Sign In form
    } else {
      // If user is logged in, add the item to the cart
      if (!cartItems[itemId]) {
        setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
      } else {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
      }
    }
  };

  const removeFromCart = (itemId) => {
    if (cartItems[itemId] === 1) {
      // Remove the item if the quantity becomes zero
      const newCartItems = { ...cartItems };
      delete newCartItems[itemId];
      setCartItems(newCartItems);
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    }
  };

  const getTotalQuantity = () => {
    let totalQuantity = 0;
    for (const itemId in cartItems) {
      totalQuantity += cartItems[itemId];
    }
    return totalQuantity;
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        totalAmount += itemInfo.price * cartItems[item];
      }
    }
    return totalAmount;
  };

  // Add pending item to cart after login
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && pendingItem) {
      addToCart(pendingItem); // Add the pending item to the cart
      setPendingItem(null); // Clear the pending item
    }
  }, [pendingItem]);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    getTotalQuantity,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;