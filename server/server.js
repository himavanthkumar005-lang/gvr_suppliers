import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const dbFilePath = path.join(rootDir, 'src', 'data', 'db.json');

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(cors());
app.use(express.json());

// Helper to read DB
const readDb = () => {
  try {
    const rawData = fs.readFileSync(dbFilePath, 'utf-8');
    return JSON.parse(rawData);
  } catch (err) {
    console.error('Error reading db.json:', err);
    return { users: [], products: [], packages: [], bookings: [], services: [], inquiries: [] };
  }
};

// Helper to write DB
const writeDb = (data) => {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing db.json:', err);
    return false;
  }
};

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', message: 'GVR Suppliers API is running', timestamp: new Date().toISOString() });
});

// PRODUCTS API
app.get('/api/products', (req, res) => {
  const db = readDb();
  res.json(db.products || []);
});

app.post('/api/products', (req, res) => {
  const db = readDb();
  const count = (db.products?.length || 0) + 1;
  const newProduct = {
    ...req.body,
    id: `PROD-${String(count).padStart(2, '0')}`
  };
  db.products = [newProduct, ...(db.products || [])];
  writeDb(db);
  res.status(201).json(newProduct);
});

app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  db.products = (db.products || []).filter((p) => p.id !== id);
  writeDb(db);
  res.json({ success: true, message: `Product ${id} deleted` });
});

// PACKAGES API
app.get('/api/packages', (req, res) => {
  const db = readDb();
  res.json(db.packages || []);
});

// BOOKINGS API
app.get('/api/bookings', (req, res) => {
  const { userId } = req.query;
  const db = readDb();
  let bookings = db.bookings || [];
  if (userId) {
    bookings = bookings.filter((b) => b.userId === userId);
  }
  res.json(bookings);
});

app.get('/api/bookings/:id', (req, res) => {
  const db = readDb();
  const booking = (db.bookings || []).find((b) => b.id === req.params.id);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }
  res.json(booking);
});

app.post('/api/bookings', (req, res) => {
  const db = readDb();
  const count = (db.bookings?.length || 0) + 1001;
  const newBooking = {
    ...req.body,
    id: `GVR-${new Date().getFullYear()}-${count}`,
    status: 'Pending',
    createdAt: new Date().toISOString()
  };
  db.bookings = [newBooking, ...(db.bookings || [])];
  writeDb(db);
  res.status(201).json(newBooking);
});

app.patch('/api/bookings/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const db = readDb();
  let updatedBooking = null;

  db.bookings = (db.bookings || []).map((b) => {
    if (b.id === id) {
      updatedBooking = { ...b, status: status || b.status };
      return updatedBooking;
    }
    return b;
  });

  if (!updatedBooking) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  writeDb(db);
  res.json(updatedBooking);
});

// INQUIRIES API
app.get('/api/inquiries', (req, res) => {
  const db = readDb();
  res.json(db.inquiries || []);
});

app.post('/api/inquiries', (req, res) => {
  const db = readDb();
  const count = (db.inquiries?.length || 0) + 1;
  const newInquiry = {
    ...req.body,
    id: `INQ-${String(count).padStart(3, '0')}`,
    status: 'New',
    date: new Date().toISOString().split('T')[0]
  };
  db.inquiries = [newInquiry, ...(db.inquiries || [])];
  writeDb(db);
  res.status(201).json(newInquiry);
});

app.patch('/api/inquiries/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const db = readDb();
  let updatedInquiry = null;

  db.inquiries = (db.inquiries || []).map((i) => {
    if (i.id === id) {
      updatedInquiry = { ...i, status: status || i.status };
      return updatedInquiry;
    }
    return i;
  });

  if (!updatedInquiry) {
    return res.status(404).json({ error: 'Inquiry not found' });
  }

  writeDb(db);
  res.json(updatedInquiry);
});

// AUTH API
app.post('/api/auth/login', (req, res) => {
  const { email, password, requiredRole } = req.body;
  const db = readDb();
  const user = (db.users || []).find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return res.status(401).json({ error: 'No account found with this email address.' });
  }
  if (user.password !== password) {
    return res.status(401).json({ error: 'Incorrect password. Please try again.' });
  }
  if (requiredRole && user.role !== requiredRole) {
    return res.status(403).json({ error: `Access restricted: Account lacks ${requiredRole} privileges.` });
  }

  const sessionUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone || '',
    address: user.address || ''
  };
  res.json({ success: true, user: sessionUser });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role, phone, address } = req.body;
  const db = readDb();
  const existing = (db.users || []).find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists.' });
  }

  const count = (db.users?.length || 0) + 1;
  const newUser = {
    id: `USR-${String(count).padStart(3, '0')}`,
    name,
    email,
    password,
    role: role || 'user',
    phone: phone || '',
    address: address || ''
  };

  db.users = [...(db.users || []), newUser];
  writeDb(db);

  const sessionUser = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    phone: newUser.phone,
    address: newUser.address
  };
  res.status(201).json({ success: true, user: sessionUser });
});

// STATS API
app.get('/api/stats', (req, res) => {
  const db = readDb();
  const bookings = db.bookings || [];
  const products = db.products || [];
  const inquiries = db.inquiries || [];

  const totalRevenue = bookings.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);
  const advanceCollected = bookings.reduce((sum, b) => sum + (Number(b.advancePaid) || 0), 0);
  const pendingBookings = bookings.filter((b) => b.status === 'Pending').length;
  const confirmedBookings = bookings.filter((b) => b.status === 'Confirmed').length;
  const completedBookings = bookings.filter((b) => b.status === 'Completed').length;
  const newInquiries = inquiries.filter((i) => i.status === 'New').length;

  res.json({
    totalBookings: bookings.length,
    totalRevenue,
    advanceCollected,
    pendingBookings,
    confirmedBookings,
    completedBookings,
    totalProducts: products.length,
    newInquiries
  });
});

// UNIFIED SERVER SETUP: Attach Frontend Handler
if (!isProduction) {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
    root: rootDir
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.join(rootDir, 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 GVR Suppliers Unified Server (Frontend + Backend)`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`======================================================\n`);
});
