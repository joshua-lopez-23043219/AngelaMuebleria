import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export function useAdmin() {
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      const results = await Promise.allSettled([
        api.admin.getStats(),
        api.orders.adminGetAll(),
        api.products.getAll()
      ]);

      if (results[0].status === 'fulfilled') setStats(results[0].value);
      if (results[1].status === 'fulfilled') setOrders(results[1].value);
      else {
        const msg = results[1].status === 'rejected' ? (results[1].reason?.message || 'Error desconocido') : 'Error desconocido';
        setError('Error pedidos: ' + msg);
      }
      if (results[2].status === 'fulfilled') setProducts(results[2].value);

    } catch (e: any) {
      setError('Error crítico: ' + e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateOrderStatus = async (id: number, status: string) => {
    try {
      await api.orders.adminUpdateStatus(id, status);
      await loadData();
    } catch (e: any) {
      throw new Error(e.message);
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      await api.products.delete(id);
      await loadData();
    } catch (e: any) {
      throw new Error(e.message);
    }
  };

  return {
    stats,
    orders,
    products,
    loading,
    error,
    refresh: loadData,
    updateOrderStatus,
    deleteProduct
  };
}
