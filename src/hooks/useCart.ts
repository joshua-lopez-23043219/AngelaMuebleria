import { useState } from 'react';
import { api } from '../services/api';

export function useCart(user: any) {
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(p => p.id !== id));
  };

  const checkout = async (onSuccess: () => void) => {
    if (!user) {
      setIsCartOpen(false);
      throw new Error('Debe iniciar sesión para realizar un pedido');
    }

    try {
      const total = cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
      await api.orders.create({ items: cart, total });
      setCart([]);
      setIsCartOpen(false);
      onSuccess();
    } catch (e: any) {
      throw new Error(e.message);
    }
  };

  const cartTotal = cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
  const cartCount = cart.reduce((acc, c) => acc + c.quantity, 0);

  return {
    cart,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    checkout,
    cartTotal,
    cartCount
  };
}
