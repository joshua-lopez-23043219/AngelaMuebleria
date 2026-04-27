import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingCart, Trash2, ChevronRight } from 'lucide-react';

export const CartDropdown = ({ isOpen, onClose, items, onRemove, onCheckout, total }: any) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-serif font-bold">Carrito de Pedido</h2>
              <button onClick={onClose} className="p-2 hover:bg-paper rounded-full transition-colors"><X size={20} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4">
                  <ShoppingCart size={48} strokeWidth={1} />
                  <p>Tu carrito está vacío</p>
                </div>
              ) : (
                items.map((item: any) => (
                  <div key={item.id} className="flex gap-4 group">
                    <img 
                      src={item.image_url || `https://picsum.photos/seed/${item.name}/150/150`} 
                      className="w-20 h-20 object-cover rounded-lg" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-xs text-brand-accent font-bold">${item.price.toLocaleString()} x {item.quantity}</p>
                    </div>
                    <button onClick={() => onRemove(item.id)} className="opacity-0 group-hover:opacity-100 text-red-500 p-1 hover:bg-red-50 rounded transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 border-t bg-paper/50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-500">Total</span>
                <span className="text-2xl font-serif font-bold">${total.toLocaleString()}</span>
              </div>
              <button 
                disabled={items.length === 0}
                onClick={onCheckout}
                className="w-full bg-brand-primary text-white py-4 rounded-xl font-bold tracking-tight hover:bg-brand-accent disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                Confirmar Pedido <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
