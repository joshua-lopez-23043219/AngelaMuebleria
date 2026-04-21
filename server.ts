import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || 'muebleria-secret-key-2024';
const PORT = 3000;

// Database Setup
const db = new Database('muebleria.db');
db.pragma('journal_mode = WAL');

// Initialize Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'client' CHECK(role IN ('client', 'admin'))
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    category TEXT,
    image_url TEXT
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    total REAL NOT NULL,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'delivered', 'cancelled')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY(order_id) REFERENCES orders(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
  );
`);

// Seed Admin if not exists
const seedAdmin = () => {
  const adminEmail = 'admin@muebleria.com';
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(adminEmail);
  if (!existing) {
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)').run(
      'Administrador Principal',
      adminEmail,
      hashedPassword,
      'admin'
    );
    console.log('Admin user seeded');
  }
};
seedAdmin();

// Seed Products if not exists
const seedProducts = () => {
  const count = db.prepare('SELECT COUNT(*) as count FROM products').get() as any;
  if (count.count === 0) {
    const products = [
      { name: 'Sofá Velvet Midnight', description: 'Sofá de lujo tapizado en terciopelo color azul medianoche con patas doradas.', price: 1200, stock: 10, category: 'Salón', image_url: 'https://picsum.photos/seed/sofa1/800/800' },
      { name: 'Mesa de Comedor Marble', description: 'Mesa de comedor de mármol Carrara con base de acero inoxidable.', price: 2500, stock: 5, category: 'Comedor', image_url: 'https://picsum.photos/seed/table1/800/800' },
      { name: 'Silla Master Eames', description: 'Clásica silla de diseño ergonómico con acabados en madera de nogal.', price: 450, stock: 20, category: 'Oficina', image_url: 'https://picsum.photos/seed/chair1/800/800' },
      { name: 'Cama Imperial King', description: 'Cama tamaño king con cabecero capitoné en lino gris.', price: 3200, stock: 4, category: 'Dormitorio', image_url: 'https://picsum.photos/seed/bed1/800/800' },
      { name: 'Lámpara Art Deco', description: 'Lámpara de pie dorada con detalles geométricos y luz cálida regulable.', price: 300, stock: 15, category: 'Iluminación', image_url: 'https://picsum.photos/seed/lamp1/800/800' },
      { name: 'Estantería Industrial', description: 'Estantería de roble rústico y metal negro, perfecta para bibliotecas modernas.', price: 800, stock: 8, category: 'Estudio', image_url: 'https://picsum.photos/seed/shelf1/800/800' },
    ];

    const insert = db.prepare('INSERT INTO products (name, description, price, stock, category, image_url) VALUES (?, ?, ?, ?, ?, ?)');
    for (const p of products) {
      insert.run(p.name, p.description, p.price, p.stock, p.category, p.image_url);
    }
    console.log('Products seeded');
  }
};
seedProducts();


async function startServer() {
  const app = express();
  app.use(express.json());
  app.use(cors());

  // Middleware for Authentication
  const authMiddleware = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch {
      res.status(401).json({ error: 'Invalid token' });
    }
  };

  const adminMiddleware = (req: any, res: any, next: any) => {
    if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    next();
  };

  // --- API ROUTES ---

  // Auth
  app.post('/api/auth/register', (req, res) => {
    const { name, email, password } = req.body;
    try {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const result = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)').run(name, email, hashedPassword);
      const userId = Number(result.lastInsertRowid);
      const token = jwt.sign({ id: userId, role: 'client' }, JWT_SECRET);
      res.json({ token, user: { id: userId, name, email, role: 'client' } });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    try {
      const user: any = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }
      const token = jwt.sign({ id: Number(user.id), role: user.role }, JWT_SECRET);
      res.json({ token, user: { id: Number(user.id), name: user.name, email: user.email, role: user.role } });
    } catch (e: any) {
      res.status(500).json({ error: 'Error en el login: ' + e.message });
    }
  });

  // Products
  app.get('/api/products', (req, res) => {
    const products = db.prepare('SELECT * FROM products').all();
    res.json(products);
  });

  app.post('/api/products', authMiddleware, adminMiddleware, (req, res) => {
    const { name, description, price, stock, category, image_url } = req.body;
    const result = db.prepare('INSERT INTO products (name, description, price, stock, category, image_url) VALUES (?, ?, ?, ?, ?, ?)').run(
      name, description, price, stock, category, image_url
    );
    res.json({ id: result.lastInsertRowid });
  });

  app.patch('/api/products/:id', authMiddleware, adminMiddleware, (req, res) => {
    const { name, description, price, stock, category, image_url } = req.body;
    db.prepare('UPDATE products SET name = ?, description = ?, price = ?, stock = ?, category = ?, image_url = ? WHERE id = ?').run(
      name, description, price, stock, category, image_url, req.params.id
    );
    res.json({ success: true });
  });

  app.delete('/api/products/:id', authMiddleware, adminMiddleware, (req, res) => {
    db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  // Orders
  app.post('/api/orders', authMiddleware, (req: any, res) => {
    const { items, total } = req.body;
    const transaction = db.transaction(() => {
      const orderResult = db.prepare('INSERT INTO orders (user_id, total) VALUES (?, ?)').run(req.user.id, total);
      const orderId = orderResult.lastInsertRowid;
      
      for (const item of items) {
        db.prepare('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)').run(
          orderId, item.id, item.quantity, item.price
        );
        db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?').run(item.quantity, item.id);
      }
      return orderId;
    });

    try {
      const orderId = transaction();
      res.json({ id: orderId });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.get('/api/orders/my', authMiddleware, (req: any, res) => {
    const orders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
    res.json(orders);
  });

  app.get('/api/orders/:id/items', authMiddleware, (req: any, res) => {
    try {
      // Verificar que el pedido pertenezca al usuario
      const order = db.prepare('SELECT id FROM orders WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
      if (!order) return res.status(403).json({ error: 'Acceso denegado' });

      const items = db.prepare(`
        SELECT order_items.*, products.name, products.image_url
        FROM order_items
        JOIN products ON order_items.product_id = products.id
        WHERE order_id = ?
      `).all(req.params.id);
      res.json(items);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get('/api/admin/orders', authMiddleware, adminMiddleware, (req, res) => {
    try {
      console.log('Fetching all orders for admin...');
      const orders = db.prepare(`
        SELECT 
          orders.id,
          orders.user_id,
          orders.total,
          orders.status,
          orders.created_at,
          users.name as user_name,
          users.email as user_email
        FROM orders 
        LEFT JOIN users ON orders.user_id = users.id 
        ORDER BY orders.created_at DESC
      `).all();
      
      console.log(`Found ${orders.length} orders`);
      res.json(orders);
    } catch (e: any) {
      console.error('Error fetching admin orders:', e);
      res.status(500).json({ error: 'Error al obtener pedidos: ' + e.message });
    }
  });

  app.get('/api/admin/orders/:id/items', authMiddleware, adminMiddleware, (req, res) => {
    try {
      const items = db.prepare(`
        SELECT order_items.*, products.name, products.image_url
        FROM order_items
        JOIN products ON order_items.product_id = products.id
        WHERE order_id = ?
      `).all(req.params.id);
      res.json(items);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.patch('/api/admin/orders/:id/status', authMiddleware, adminMiddleware, (req, res) => {
    const { status } = req.body;
    try {
      db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Dashboard Stats
  app.get('/api/admin/stats', authMiddleware, adminMiddleware, (req, res) => {
    try {
      const totalSales = db.prepare('SELECT SUM(total) as total FROM orders WHERE status != "cancelled"').get() as any;
      const totalOrders = db.prepare('SELECT COUNT(*) as count FROM orders').get() as any;
      const totalProducts = db.prepare('SELECT COUNT(*) as count FROM products').get() as any;
      const lowStock = db.prepare('SELECT COUNT(*) as count FROM products WHERE stock < 5').get() as any;
      
      const stats = {
        revenue: totalSales?.total || 0,
        orders: totalOrders?.count || 0,
        products: totalProducts?.count || 0,
        lowStock: lowStock?.count || 0
      };

      console.log('Stats generated:', stats);
      res.json(stats);
    } catch (e: any) {
      console.error('Error generating stats:', e);
      res.status(500).json({ error: 'Error al generar estadísticas: ' + e.message });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
