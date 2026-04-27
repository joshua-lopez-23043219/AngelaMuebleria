import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, ShoppingCart, Package, AlertCircle, 
  Plus, Edit3, Trash2, X 
} from 'lucide-react';
import { api } from '../services/api'; // Corrected import
import { useAdmin } from '../hooks/useAdmin'; // Use the new hook
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const AdminDashboard = () => {
  const admin = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);

  const loadOrderDetails = async (order: any) => {
    setSelectedOrder(order);
    setLoadingItems(true);
    try {
      const items = await api.orders.adminGetItems(order.id);
      setOrderItems(items);
    } catch (e: any) { alert(e.message); }
    finally { setLoadingItems(false); }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await admin.updateOrderStatus(id, status);
      if (selectedOrder?.id === id) {
        setSelectedOrder((prev: any) => ({ ...prev, status }));
      }
    } catch (e: any) { alert(e.message); }
  };

  const handleProductSubmit = async (e: any) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    try {
      if (editingProduct) {
        await api.products.update(editingProduct.id, data);
      } else {
        await api.products.create(data);
      }
      setShowForm(false);
      setEditingProduct(null);
      admin.refresh();
    } catch (e: any) { alert(e.message); }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Seguro que deseas eliminar este producto?')) {
      try {
        await admin.deleteProduct(id);
      } catch (e: any) {
        alert(e.message);
      }
    }
  };

  return (
    <div className="p-8 space-y-12">
      {/* Rest of the component structure remains similar but is cleaner */}
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-serif font-bold">Admin Dashboard</h1>
          <p className="text-gray-500">Control de inventario y analíticas de ventas</p>
        </div>
        <button 
          onClick={() => { setShowForm(true); setEditingProduct(null); }}
          className="bg-brand-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-brand-accent transition-all"
        >
          <Plus size={20} /> Nuevo Producto
        </button>
      </header>

      {admin.error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-3">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">Error al cargar datos: {admin.error}</p>
          <button onClick={admin.refresh} className="ml-auto underline text-xs">Reintentar</button>
        </div>
      )}

      {admin.loading ? (
        <div className="h-64 flex items-center justify-center font-serif italic text-gray-400">
          Actualizando métricas y pedidos...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Ventas Totales', value: `$${admin.stats?.revenue?.toLocaleString() || 0}`, icon: TrendingUp, color: 'text-brand-accent' },
              { label: 'Pedidos', value: admin.stats?.orders || 0, icon: ShoppingCart, color: 'text-blue-600' },
              { label: 'Productos', value: admin.stats?.products || 0, icon: Package, color: 'text-purple-600' },
              { label: 'Stock Bajo', value: admin.stats?.lowStock || 0, icon: AlertCircle, color: 'text-red-500' },
            ].map((stat, i) => (
              <motion.div 
                key={stat.label} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-2xl border border-brand-accent/10 shadow-sm"
              >
                <stat.icon className={cn("mb-2", stat.color)} size={24} />
                <p className="text-xs uppercase tracking-widest font-bold text-gray-400">{stat.label}</p>
                <p className="text-2xl font-serif font-bold mt-1">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <section className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-serif font-bold border-b pb-2">Inventario</h2>
              <div className="bg-white rounded-2xl border border-brand-accent/10 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-paper text-xs uppercase tracking-tighter font-bold text-gray-500">
                    <tr>
                      <th className="px-6 py-4">Producto</th>
                      <th className="px-6 py-4">Categoría</th>
                      <th className="px-6 py-4">Precio</th>
                      <th className="px-6 py-4">Stock</th>
                      <th className="px-6 py-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-accent/5">
                    {admin.products.length === 0 ? (
                      <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">No hay productos en el inventario</td></tr>
                    ) : admin.products.map((p: any) => (
                      <tr key={p.id} className="hover:bg-paper/30 transition-colors">
                        <td className="px-6 py-4 font-medium">{p.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{p.category}</td>
                        <td className="px-6 py-4 font-mono text-sm">${p.price.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={cn("px-2 py-1 rounded text-xs font-bold", p.stock < 5 ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600")}>
                            {p.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4 flex gap-2">
                           <button onClick={() => { setEditingProduct(p); setShowForm(true); }} className="p-1.5 hover:bg-brand-accent/10 rounded-lg transition-colors"><Edit3 size={16} /></button>
                           <button onClick={() => handleDelete(p.id)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors"><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-serif font-bold border-b pb-2">Pedidos Recientes</h2>
              <div className="space-y-4">
                {admin.orders.length === 0 ? (
                  <div className="bg-white p-8 rounded-2xl border border-dashed border-brand-accent/20 text-center text-gray-400">
                    <ShoppingCart size={32} className="mx-auto mb-2 opacity-20" />
                    <p className="text-sm font-serif italic">No hay pedidos registrados</p>
                  </div>
                ) : admin.orders.map((o: any) => (
                  <div key={o.id} className="bg-white p-4 rounded-xl border border-brand-accent/10 shadow-sm space-y-4 hover:border-brand-accent/30 transition-all">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-bold">{o.user_name || 'Usuario desconocido'}</p>
                        <p className="text-[10px] text-gray-400">{new Date(o.created_at).toLocaleDateString()}</p>
                        <div className="flex flex-col gap-0.5 mt-1">
                          <p className="text-[9px] text-brand-accent font-mono flex items-center gap-1">
                            <span>📱 {o.user_phone}</span>
                          </p>
                          <p className="text-[9px] text-gray-500 font-medium">
                            📍 {o.user_department}, {o.user_municipality}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-sm font-bold text-brand-accent">${o.total.toLocaleString()}</p>
                        <span className={cn(
                          "text-[9px] px-2 py-0.5 rounded-full uppercase font-bold",
                          o.status === 'pending' ? "bg-blue-50 text-blue-500" : "bg-green-50 text-green-600"
                        )}>{o.status === 'pending' ? 'Pendiente' : 'Finalizado'}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-brand-accent/5">
                      <button 
                        onClick={() => loadOrderDetails(o)}
                        className="flex-1 text-[10px] font-bold uppercase tracking-wider py-2 bg-paper rounded-lg hover:bg-brand-accent/10 transition-all"
                      >
                        Ver Detalle
                      </button>
                      {o.status === 'pending' && (
                        <button 
                          onClick={() => handleUpdateStatus(o.id, 'delivered')}
                          className="flex-1 text-[10px] font-bold uppercase tracking-wider py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                        >
                          Finalizar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </>
      )}

      {/* Form and Detail Modals */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowForm(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white w-full max-w-xl p-8 rounded-2xl shadow-2xl">
              <h3 className="text-2xl font-serif font-bold mb-6">{editingProduct ? 'Editar' : 'Crear'} Producto</h3>
              <form onSubmit={handleProductSubmit} className="grid grid-cols-2 gap-4">
                <input required name="name" placeholder="Nombre" defaultValue={editingProduct?.name} className="col-span-2 w-full px-4 py-2 border rounded-lg" />
                <input required type="number" name="price" placeholder="Precio" defaultValue={editingProduct?.price} className="w-full px-4 py-2 border rounded-lg" />
                <input required type="number" name="stock" placeholder="Stock" defaultValue={editingProduct?.stock} className="w-full px-4 py-2 border rounded-lg" />
                <textarea name="description" placeholder="Descripción" defaultValue={editingProduct?.description} className="col-span-2 w-full px-4 py-2 border rounded-lg" rows={3} />
                <input name="category" placeholder="Categoría" defaultValue={editingProduct?.category} className="w-full px-4 py-2 border rounded-lg" />
                <input name="image_url" placeholder="Imagen URL" defaultValue={editingProduct?.image_url} className="w-full px-4 py-2 border rounded-lg" />
                <div className="col-span-2 flex gap-4 mt-4">
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 bg-gray-100 rounded-xl font-bold">Cancelar</button>
                  <button type="submit" className="flex-1 py-3 bg-brand-primary text-white rounded-xl font-bold hover:bg-brand-accent">Guardar</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedOrder(null)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white w-full max-w-lg p-8 rounded-3xl shadow-2xl overflow-hidden">
               <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-serif font-bold">Detalles del Pedido</h3>
                  <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-paper rounded-full transition-colors"><X size={20}/></button>
               </div>
               <div className="space-y-6">
                 <div className="p-4 bg-paper/50 rounded-2xl border border-brand-accent/5 space-y-2">
                   <div>
                     <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Cliente</p>
                     <p className="font-bold">{selectedOrder.user_name}</p>
                     <p className="text-xs text-brand-accent font-mono">{selectedOrder.user_email}</p>
                   </div>
                   <div className="grid grid-cols-2 gap-2 pt-2 border-t border-brand-accent/5">
                     <div>
                       <p className="text-[9px] uppercase font-bold text-gray-400 mb-1">Teléfono</p>
                       <p className="text-xs font-bold">{selectedOrder.user_phone}</p>
                     </div>
                     <div>
                       <p className="text-[9px] uppercase font-bold text-gray-400 mb-1">Ubicación</p>
                       <p className="text-xs font-bold">{selectedOrder.user_municipality}, {selectedOrder.user_department}</p>
                     </div>
                   </div>
                 </div>
                 <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {loadingItems ? <div className="text-center py-8">Cargando...</div> : orderItems.map((item: any) => (
                      <div key={item.id} className="flex gap-4 items-center p-2 rounded-xl transition-all">
                        <img src={item.image_url} className="w-12 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                        <div className="flex-1">
                          <p className="text-sm font-bold leading-tight">{item.name}</p>
                          <p className="text-[10px] text-gray-500">{item.quantity} x ${item.price.toLocaleString()}</p>
                        </div>
                        <p className="text-sm font-mono font-bold">${(item.quantity * item.price).toLocaleString()}</p>
                      </div>
                    ))}
                 </div>
                 <div className="flex justify-between items-center pt-4 border-t border-dashed">
                   <p className="text-lg font-serif font-bold italic">Total</p>
                   <p className="text-2xl font-mono font-bold text-brand-primary">${selectedOrder.total.toLocaleString()}</p>
                 </div>
                 <div className="flex gap-4 pt-2">
                   {selectedOrder.status === 'pending' ? (
                     <button onClick={() => handleUpdateStatus(selectedOrder.id, 'delivered')} className="flex-1 bg-green-600 text-white font-bold py-4 rounded-2xl hover:bg-green-700 transition-all">Marcar como Finalizado</button>
                   ) : (
                     <div className="flex-1 text-center py-4 bg-green-50 text-green-600 rounded-2xl font-bold border border-green-100">Pedido Finalizado</div>
                   )}
                 </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
