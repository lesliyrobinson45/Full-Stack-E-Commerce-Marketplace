import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  // Load cart and wishlist from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (e) {
        setCartItems([]);
      }
    }

    const storedWishlist = localStorage.getItem('wishlistItems');
    if (storedWishlist) {
      try {
        setWishlist(JSON.parse(storedWishlist));
      } catch (e) {
        setWishlist([]);
      }
    }
  }, []);

  // Save cart to localStorage
  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem('cartItems', JSON.stringify(items));
  };

  // Save wishlist to localStorage
  const saveWishlist = (items) => {
    setWishlist(items);
    localStorage.setItem('wishlistItems', JSON.stringify(items));
  };

  // Add Item to Cart
  const addToCart = (product, quantity = 1) => {
    const existItem = cartItems.find((item) => item.product === product._id);

    if (existItem) {
      const updated = cartItems.map((item) =>
        item.product === product._id
          ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
          : item
      );
      saveCart(updated);
    } else {
      const newItem = {
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        stock: product.stock,
        quantity: Math.min(quantity, product.stock),
      };
      saveCart([...cartItems, newItem]);
    }
    // Automatically open the cart drawer for a highly dynamic visual feedback
    setIsCartOpen(true);
  };

  // Remove Item from Cart
  const removeFromCart = (id) => {
    const updated = cartItems.filter((item) => item.product !== id);
    saveCart(updated);
  };

  // Update Cart Quantity
  const updateQuantity = (id, quantity) => {
    const updated = cartItems.map((item) =>
      item.product === id ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stock)) } : item
    );
    saveCart(updated);
  };

  // Clear Cart
  const clearCart = () => {
    saveCart([]);
    setDiscountPercent(0);
    setCoupon('');
  };

  // Toggle Wishlist
  const toggleWishlist = (product) => {
    const exist = wishlist.find((item) => item._id === product._id);
    if (exist) {
      const updated = wishlist.filter((item) => item._id !== product._id);
      saveWishlist(updated);
    } else {
      saveWishlist([...wishlist, product]);
    }
  };

  // Apply Coupon Code
  const applyCoupon = (code) => {
    const normalizedCode = code.toUpperCase().trim();
    if (normalizedCode === 'WELCOME10') {
      setDiscountPercent(10);
      setCoupon(normalizedCode);
      return { success: true, message: '10% discount applied!' };
    } else if (normalizedCode === 'SHOPSPHERE20') {
      setDiscountPercent(20);
      setCoupon(normalizedCode);
      return { success: true, message: '20% discount applied!' };
    }
    return { success: false, message: 'Invalid coupon code' };
  };

  // Calculations
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountPrice = itemsPrice * (discountPercent / 100);
  const taxableSubtotal = itemsPrice - discountPrice;
  const shippingPrice = taxableSubtotal > 150 || taxableSubtotal === 0 ? 0.0 : 15.0; // Free shipping above $150
  const taxPrice = taxableSubtotal * 0.08; // 8% tax
  const totalPrice = taxableSubtotal + shippingPrice + taxPrice;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        wishlist,
        isCartOpen,
        setIsCartOpen,
        coupon,
        discountPercent,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        applyCoupon,
        prices: {
          itemsPrice: Math.round(itemsPrice * 100) / 100,
          discountPrice: Math.round(discountPrice * 100) / 100,
          shippingPrice: Math.round(shippingPrice * 100) / 100,
          taxPrice: Math.round(taxPrice * 100) / 100,
          totalPrice: Math.round(totalPrice * 100) / 100,
        },
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
