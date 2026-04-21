import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  LogOut, 
  User as UserIcon, 
  Plus, 
  Trash2, 
  Edit3, 
  ChevronRight,
  TrendingUp,
  Users,
  AlertCircle,
  X,
  Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from './lib/api';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- UTILS ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- CONTEXT ---
const AuthContext = createContext<any>(null);

// --- COMPONENTS ---

const Navbar = ({ onCartOpen, cartCount, user, onLogout, onChangePage }: any) => {
  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-brand-accent/20 px-6 py-4 flex justify-between items-center">
      <div 
        className="text-2xl font-serif font-bold tracking-tighter cursor-pointer" 
        onClick={() => onChangePage('catalog')}
      >
        ANGELA <span className="text-brand-accent italic">MUEBLERÍA</span>
      </div>
      
      <div className="flex items-center gap-6">
        <button 
          onClick={() => onChangePage('catalog')}
          className="text-sm font-medium hover:text-brand-accent transition-colors"
        >
          Catálogo
        </button>
        {user?.role === 'admin' && (
          <button 
            onClick={() => onChangePage('admin')}
            className="text-sm font-medium text-brand-accent hover:underline flex items-center gap-1"
          >
            <LayoutDashboard size={16} /> Dashboard
          </button>
        )}
        {user ? (
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onChangePage('orders')}
              className="text-sm font-medium hover:text-brand-accent"
            >
              Mis Pedidos
            </button>
            <button 
              onClick={onLogout}
              className="p-2 hover:bg-red-50 text-red-600 rounded-full transition-colors"
              title="Cerrar Sesión"
            >
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => onChangePage('login')}
            className="flex items-center gap-2 text-sm font-medium bg-brand-primary text-white px-4 py-2 rounded-full hover:bg-brand-accent transition-all"
          >
            <UserIcon size={16} /> Entrar
          </button>
        )}
        <button 
          className="relative p-2 hover:bg-paper rounded-full transition-colors"
          onClick={onCartOpen}
        >
          <ShoppingCart size={22} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-brand-accent text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};

const ProductCard = ({ product, onAddToCart, isAdmin, onEdit, onDelete }: any) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative bg-white border border-brand-accent/10 p-4 rounded-xl hover:shadow-2xl hover:shadow-brand-accent/5 transition-all duration-500"
    >
      <div className="aspect-square relative overflow-hidden rounded-lg bg-paper mb-4">
        <img 
          src={product.image_url || `https://picsum.photos/seed/${product.name}/500/500`} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-white text-brand-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Agotado</span>
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between items-start">
          <h3 className="font-serif text-lg leading-tight">{product.name}</h3>
          <span className="font-mono text-brand-accent text-sm font-bold">${product.price.toLocaleString()}</span>
        </div>
        <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center pt-2">
          <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">{product.category}</span>
          <span className={cn("text-xs font-medium", product.stock < 5 ? "text-red-500" : "text-gray-400")}>
            {product.stock} disponibles
          </span>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button 
          disabled={product.stock <= 0}
          onClick={() => onAddToCart(product)}
          className="flex-1 bg-brand-primary text-white text-sm font-medium py-2 rounded-lg hover:bg-brand-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Añadir al Carrito
        </button>
        {isAdmin && (
          <div className="flex gap-1">
            <button onClick={() => onEdit(product)} className="p-2 bg-gray-100 rounded-lg hover:bg-brand-accent hover:text-white transition-all">
              <Edit3 size={16} />
            </button>
            <button onClick={() => onDelete(product.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all">
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const CartDropdown = ({ isOpen, onClose, items, onRemove, onCheckout, total }: any) => {
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

// --- PAGES ---

const LoginPage = ({ onAuth }: any) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = isRegister 
        ? await api.auth.register(formData)
        : await api.auth.login({ email: formData.email, password: formData.password });
      onAuth(data);
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-white border border-brand-accent/20 rounded-2xl p-8 shadow-xl shadow-brand-accent/5"
      >
        <h2 className="text-3xl font-serif font-bold mb-6 text-center">
          {isRegister ? 'Crear Cuenta' : 'Bienvenido de Nuevo'}
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">Nombre Completo</label>
              <input 
                required
                className="w-full px-4 py-3 bg-paper rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/50 transition-all"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          )}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">Correo Electrónico</label>
            <input 
              required
              type="email"
              className="w-full px-4 py-3 bg-paper rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/50 transition-all"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">Contraseña</label>
            <input 
              required
              type="password"
              className="w-full px-4 py-3 bg-paper rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/50 transition-all"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <button className="w-full bg-brand-primary text-white py-3 rounded-xl font-bold hover:bg-brand-accent transition-all shadow-lg shadow-brand-primary/10">
            {isRegister ? 'Registrarse' : 'Iniciar Sesión'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'} {' '}
          <button 
            onClick={() => setIsRegister(!isRegister)}
            className="text-brand-accent font-bold hover:underline"
          >
            {isRegister ? 'Inicia Sesión' : 'Regístrate aquí'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

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
      await api.orders.adminUpdateStatus(id, status);
      loadData();
      if (selectedOrder?.id === id) {
        setSelectedOrder((prev: any) => ({ ...prev, status }));
      }
    } catch (e: any) { alert(e.message); }
  };

  const loadData = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Cargar datos en paralelo pero manejar fallos individuales para no bloquear todo el dashboard
      const results = await Promise.allSettled([
        api.admin.getStats(),
        api.orders.adminGetAll(),
        api.products.getAll()
      ]);

      if (results[0].status === 'fulfilled') setStats(results[0].value);
      else console.error('Fallo al cargar estadísticas:', results[0].reason);

      if (results[1].status === 'fulfilled') {
        setOrders(results[1].value);
      } else {
        const msg = results[1].reason?.message || 'Error desconocido';
        console.error('Fallo al cargar pedidos:', results[1].reason);
        setError(prev => prev ? prev + ' | ' + msg : 'Error pedidos: ' + msg);
      }

      if (results[2].status === 'fulfilled') setProducts(results[2].value);
      else console.error('Fallo al cargar productos:', results[2].reason);

    } catch (e: any) {
      setError('Error crítico: ' + e.message);
      console.error(e.message);
    } finally {
      setLoading(false);
    }
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
      loadData();
    } catch (e: any) { alert(e.message); }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Seguro que deseas eliminar este producto?')) {
      await api.products.delete(id);
      loadData();
    }
  };

  return (
    <div className="p-8 space-y-12">
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

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-3">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">Error al cargar datos: {error}</p>
          <button onClick={loadData} className="ml-auto underline text-xs">Reintentar</button>
        </div>
      )}

      {loading ? (
        <div className="h-64 flex items-center justify-center font-serif italic text-gray-400">
          Actualizando métricas y pedidos...
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Ventas Totales', value: `$${stats?.revenue?.toLocaleString() || 0}`, icon: TrendingUp, color: 'text-brand-accent' },
              { label: 'Pedidos', value: stats?.orders || 0, icon: ShoppingCart, color: 'text-blue-600' },
              { label: 'Productos', value: stats?.products || 0, icon: Package, color: 'text-purple-600' },
              { label: 'Stock Bajo', value: stats?.lowStock || 0, icon: AlertCircle, color: 'text-red-500' },
            ].map((stat, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={stat.label} 
                className="bg-white p-6 rounded-2xl border border-brand-accent/10 shadow-sm"
              >
                <stat.icon className={cn("mb-2", stat.color)} size={24} />
                <p className="text-xs uppercase tracking-widest font-bold text-gray-400">{stat.label}</p>
                <p className="text-2xl font-serif font-bold mt-1">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Inventory List */}
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
                    {products.length === 0 ? (
                      <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">No hay productos en el inventario</td></tr>
                    ) : products.map((p: any) => (
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

            {/* Recent Orders */}
            <section className="space-y-6">
              <h2 className="text-2xl font-serif font-bold border-b pb-2">Pedidos Recientes</h2>
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="bg-white p-8 rounded-2xl border border-dashed border-brand-accent/20 text-center text-gray-400">
                    <ShoppingCart size={32} className="mx-auto mb-2 opacity-20" />
                    <p className="text-sm font-serif italic">No hay pedidos registrados</p>
                  </div>
                ) : orders.map((o: any) => (
                  <div key={o.id} className="bg-white p-4 rounded-xl border border-brand-accent/10 shadow-sm space-y-4 hover:border-brand-accent/30 transition-all">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-bold">{o.user_name || 'Usuario desconocido'}</p>
                        <p className="text-[10px] text-gray-400">{new Date(o.created_at).toLocaleDateString()} - {new Date(o.created_at).toLocaleTimeString()}</p>
                        <p className="text-[9px] text-brand-accent font-mono">{o.user_email}</p>
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
                          Marcar como Finalizado
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

      {/* Product Form Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowForm(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white w-full max-w-xl p-8 rounded-2xl shadow-2xl">
              <h3 className="text-2xl font-serif font-bold mb-6">{editingProduct ? 'Editar Producto' : 'Crear Producto'}</h3>
              <form onSubmit={handleProductSubmit} className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                   <label className="text-[10px] uppercase font-bold text-gray-400">Nombre</label>
                   <input required name="name" defaultValue={editingProduct?.name} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                   <label className="text-[10px] uppercase font-bold text-gray-400">Precio</label>
                   <input required type="number" name="price" defaultValue={editingProduct?.price} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                   <label className="text-[10px] uppercase font-bold text-gray-400">Stock</label>
                   <input required type="number" name="stock" defaultValue={editingProduct?.stock} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div className="col-span-2">
                   <label className="text-[10px] uppercase font-bold text-gray-400">Descripción</label>
                   <textarea name="description" defaultValue={editingProduct?.description} className="w-full px-4 py-2 border rounded-lg" rows={3} />
                </div>
                <div>
                   <label className="text-[10px] uppercase font-bold text-gray-400">Categoría</label>
                   <input name="category" defaultValue={editingProduct?.category} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                   <label className="text-[10px] uppercase font-bold text-gray-400">Imagen URL</label>
                   <input name="image_url" defaultValue={editingProduct?.image_url} className="w-full px-4 py-2 border rounded-lg" placeholder="https://..." />
                </div>
                <div className="col-span-2 flex gap-4 mt-4">
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 bg-gray-100 rounded-xl font-bold">Cancelar</button>
                  <button type="submit" className="flex-1 py-3 bg-brand-primary text-white rounded-xl font-bold hover:bg-brand-accent">Guardar</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedOrder(null)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white w-full max-w-lg p-8 rounded-3xl shadow-2xl overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-serif font-bold">Detalles del Pedido</h3>
                  <p className="text-xs text-gray-400 font-mono tracking-tighter">#{selectedOrder.id} - {new Date(selectedOrder.created_at).toLocaleString()}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-paper rounded-full transition-colors"><X size={20}/></button>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-paper/50 rounded-2xl border border-brand-accent/5">
                  <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Cliente</p>
                  <p className="font-bold">{selectedOrder.user_name}</p>
                  <p className="text-xs text-brand-accent font-mono">{selectedOrder.user_email}</p>
                </div>

                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 mb-3">Productos</p>
                  <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {loadingItems ? (
                      <div className="text-center py-8 text-gray-400 italic text-sm">Cargando productos...</div>
                    ) : orderItems.length > 0 ? orderItems.map((item: any) => (
                      <div key={item.id} className="flex gap-4 items-center p-2 hover:bg-paper/30 rounded-xl transition-all">
                        <img src={item.image_url} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100" referrerPolicy="no-referrer" />
                        <div className="flex-1">
                          <p className="text-sm font-bold leading-tight">{item.name}</p>
                          <p className="text-[10px] text-gray-500">{item.quantity} unidad(es) x ${item.price.toLocaleString()}</p>
                        </div>
                        <p className="text-sm font-mono font-bold text-brand-accent">${(item.quantity * item.price).toLocaleString()}</p>
                      </div>
                    )) : <p className="text-center py-4 text-gray-400 text-xs italic">No se pudieron cargar los productos.</p>}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-dashed">
                  <p className="text-lg font-serif font-bold italic">Total del pedido</p>
                  <p className="text-2xl font-mono font-bold text-brand-primary">${selectedOrder.total.toLocaleString()}</p>
                </div>

                <div className="flex gap-4 pt-2">
                   {selectedOrder.status === 'pending' ? (
                     <button 
                       onClick={() => handleUpdateStatus(selectedOrder.id, 'delivered')}
                       className="flex-1 bg-green-600 text-white font-bold py-4 rounded-2xl hover:bg-green-700 transition-all shadow-lg shadow-green-100"
                     >
                       Marcar como Listo
                     </button>
                   ) : (
                     <div className="flex-1 text-center py-4 bg-green-50 text-green-600 rounded-2xl font-bold border border-green-100">
                       Este pedido ya está Finalizado
                     </div>
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

// --- MAIN APP ---

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState('catalog');
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('muebleria_user');
    if (savedUser) setUser(JSON.parse(savedUser));
    loadProducts();
    setLoading(false);
  }, []);

  const loadProducts = async () => {
    try {
      const data = await api.products.getAll();
      setProducts(data);
    } catch (e) {
      console.error("Failed to load products");
    }
  };

  const handleAuth = (data: any) => {
    setUser(data.user);
    localStorage.setItem('muebleria_token', data.token);
    localStorage.setItem('muebleria_user', JSON.stringify(data.user));
    setCurrentPage('catalog');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('muebleria_token');
    localStorage.removeItem('muebleria_user');
    setCurrentPage('catalog');
  };

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

  const handleCheckout = async () => {
    if (!user) {
      setCurrentPage('login');
      setIsCartOpen(false);
      return;
    }
    try {
      const total = cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
      await api.orders.create({ items: cart, total });
      setCart([]);
      setIsCartOpen(false);
      setCurrentPage('orders');
      loadProducts(); // Update stock
      alert('¡Pedido realizado con éxito!');
    } catch (e: any) {
      alert(e.message);
    }
  };

  const cartTotal = cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);

  if (loading) return <div className="h-screen grid place-items-center font-serif text-2xl animate-pulse">Cargando Angela Mueblería...</div>;

  return (
    <AuthContext.Provider value={{ user, handleAuth }}>
      <div className="min-h-screen flex flex-col">
        <Navbar 
          onCartOpen={() => setIsCartOpen(true)} 
          cartCount={cart.reduce((acc, c) => acc + c.quantity, 0)}
          user={user}
          onLogout={handleLogout}
          onChangePage={setCurrentPage}
        />

        <main className="flex-1 max-w-7xl mx-auto w-full">
          {currentPage === 'catalog' && (
            <div className="p-8 space-y-12">
              <header className="text-center space-y-4">
                <h1 className="text-6xl font-serif font-bold tracking-tight">Colección <span className="italic text-brand-accent">2024</span></h1>
                <p className="text-gray-500 max-w-xl mx-auto">Diseño artesanal, materiales premium y elegancia atemporal para cada rincón de tu hogar.</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((p: any) => (
                  <ProductCard 
                    key={p.id} 
                    product={p} 
                    onAddToCart={addToCart} 
                    isAdmin={user?.role === 'admin'}
                    onEdit={() => { setCurrentPage('admin'); }} // In a real app we might pass state to admin dashboard
                    onDelete={async (id: number) => { await api.products.delete(id); loadProducts(); }}
                  />
                ))}
              </div>
            </div>
          )}

          {currentPage === 'login' && <LoginPage onAuth={handleAuth} />}

          {currentPage === 'admin' && user?.role === 'admin' && <AdminDashboard />}

          {currentPage === 'orders' && user && (
            <div className="p-8 space-y-8 max-w-2xl mx-auto">
              <h1 className="text-4xl font-serif font-bold">Mis Pedidos</h1>
              <OrdersList />
            </div>
          )}
        </main>

        <CartDropdown 
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cart}
          onRemove={removeFromCart}
          onCheckout={handleCheckout}
          total={cartTotal}
        />

        <footer className="border-t border-brand-accent/10 py-12 px-8 bg-white mt-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="font-serif font-bold text-xl">ANGELA <span className="text-brand-accent italic">MUEBLERÍA</span></div>
            <div className="flex gap-8 text-xs font-bold uppercase tracking-widest text-gray-400">
               <a href="#" className="hover:text-brand-accent transition-colors">Diseño</a>
               <a href="#" className="hover:text-brand-accent transition-colors">Historia</a>
               <a href="#" className="hover:text-brand-accent transition-colors">Soporte</a>
               <a href="#" className="hover:text-brand-accent transition-colors">Locales</a>
            </div>
            <p className="text-[10px] text-gray-400">© 2024 ANGELA MUEBLERÍA. TODOS LOS DERECHOS RESERVADOS.</p>
          </div>
        </footer>
      </div>
    </AuthContext.Provider>
  );
}

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);

  useEffect(() => {
    api.orders.getMy().then(setOrders);
  }, []);

  const viewDetails = async (order: any) => {
    setSelectedOrder(order);
    setLoadingItems(true);
    try {
      const data = await api.orders.getMyItems(order.id);
      setItems(data);
    } catch (e) { console.error(e); }
    finally { setLoadingItems(false); }
  };

  return (
    <div className="space-y-4">
      {orders.length === 0 ? <p className="text-gray-400 italic">Aún no has realizado pedidos.</p> : orders.map((o: any) => (
        <div key={o.id} className="bg-white p-6 rounded-2xl border border-brand-accent/10 shadow-sm flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-xs uppercase font-bold text-gray-400">Pedido #{o.id}</p>
            <p className="text-lg font-serif font-bold">${o.total.toLocaleString()}</p>
            <p className="text-xs text-gray-500">{new Date(o.created_at).toLocaleString()}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={cn(
              "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
              o.status === 'pending' ? "bg-blue-50 text-blue-600" : "bg-green-50 text-green-600"
            )}>{o.status === 'pending' ? 'Pendiente' : 'Finalizado'}</span>
            <button 
              onClick={() => viewDetails(o)}
              className="text-xs font-bold text-brand-accent hover:underline"
            >
              Ver detalles
            </button>
          </div>
        </div>
      ))}

      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedOrder(null)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white w-full max-w-lg p-8 rounded-3xl shadow-2xl overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-serif font-bold">Detalle del Pedido</h3>
                  <p className="text-xs text-gray-400 font-mono tracking-tighter">#{selectedOrder.id} - {new Date(selectedOrder.created_at).toLocaleDateString()}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-paper rounded-full transition-colors"><X size={20}/></button>
              </div>

              <div className="space-y-6">
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                  {loadingItems ? (
                    <div className="text-center py-12 text-gray-400 italic">Obteniendo productos...</div>
                  ) : items.map((item: any) => (
                    <div key={item.id} className="flex gap-4 items-center">
                      <img src={item.image_url} alt={item.name} className="w-14 h-14 rounded-xl object-cover bg-gray-100" referrerPolicy="no-referrer" />
                      <div className="flex-1">
                        <p className="font-bold text-sm leading-tight">{item.name}</p>
                        <p className="text-[10px] text-gray-500">{item.quantity} x ${item.price.toLocaleString()}</p>
                      </div>
                      <p className="font-mono font-bold text-sm">${(item.quantity * item.price).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-dashed flex justify-between items-end">
                   <p className="text-sm font-serif italic text-gray-500">Subtotal</p>
                   <p className="text-2xl font-serif font-bold text-brand-primary">${selectedOrder.total.toLocaleString()}</p>
                </div>

                <div className={cn(
                  "p-4 rounded-2xl text-center font-bold",
                  selectedOrder.status === 'pending' ? "bg-blue-50 text-blue-600" : "bg-green-50 text-green-600"
                )}>
                  Estado: {selectedOrder.status === 'pending' ? 'Pedido en Preparación' : 'Pedido Finalizado'}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
