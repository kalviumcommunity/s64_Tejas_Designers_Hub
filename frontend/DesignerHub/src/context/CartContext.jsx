import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
        localStorage.removeItem('cart'); // Clear invalid data
      }
    }
  }, []);

  // Update cartCount whenever cartItems changes
  useEffect(() => {
    setCartCount(cartItems.reduce((total, item) => total + item.quantity, 0));
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    // Ensure we're storing a normalized version of the product
    // This helps avoid issues with different ID formats (_id vs id)
    const normalizedProduct = {
      ...product,
      // Ensure we have a valid id property that's consistent
      id: product._id || product.id,
      quantity: product.quantity || 1
    };

    // Log the product being added
    console.log("Adding to cart:", normalizedProduct);

    setCartItems(prevItems => {
      // Check if product with same id and size already exists in cart
      const existingItem = prevItems.find(item => 
        item.id === normalizedProduct.id && 
        item.size === normalizedProduct.size
      );

      if (existingItem) {
        // If exists, update quantity
        return prevItems.map(item =>
          item.id === normalizedProduct.id && item.size === normalizedProduct.size
            ? { ...item, quantity: item.quantity + (normalizedProduct.quantity || 1) }
            : item
        );
      }

      // If doesn't exist, add new item
      return [...prevItems, normalizedProduct];
    });
  };

  const removeFromCart = (id, size) => {
    // If size is provided, remove specific item with id and size
    // Otherwise, remove all items with the given id
    setCartItems(prevItems => 
      size 
        ? prevItems.filter(item => !(item.id === id && item.size === size)) 
        : prevItems.filter(item => item.id !== id)
    );
  };

  const updateQuantity = (id, change, size) => {
    setCartItems(prevItems =>
      prevItems.map(item => {
        // If size is provided, update only the specific item
        if ((size && item.id === id && item.size === size) || 
            (!size && item.id === id)) {
          const newQuantity = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}; 