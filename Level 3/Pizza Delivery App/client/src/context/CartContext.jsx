import { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (pizza, size, quantity = 1) => {
    const existingItem = cartItems.find(
      (item) => item.pizza._id === pizza._id && item.size === size
    );

    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.pizza._id === pizza._id && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
      toast.success('Quantity updated! 🍕');
    } else {
      setCartItems([...cartItems, { pizza, size, quantity }]);
      toast.success('Added to cart! 🛒');
    }
  };

  const removeFromCart = (pizzaId, size) => {
    setCartItems(cartItems.filter(
      (item) => !(item.pizza._id === pizzaId && item.size === size)
    ));
    toast.success('Removed from cart');
  };

  const updateQuantity = (pizzaId, size, quantity) => {
    if (quantity <= 0) {
      removeFromCart(pizzaId, size);
      return;
    }
    setCartItems(
      cartItems.map((item) =>
        item.pizza._id === pizzaId && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    toast.success('Cart cleared');
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.pizza.price[item.size];
      return total + price * item.quantity;
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};