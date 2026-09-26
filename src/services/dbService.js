import initialDb from '../data/db.json';

const DB_KEY = 'gvr_suppliers_database_v1';
const API_BASE = '/api';

// ─── LocalStorage helpers (offline fallback) ───────────────────────────────
const getDb = () => {
  const data = localStorage.getItem(DB_KEY);
  if (!data) {
    localStorage.setItem(DB_KEY, JSON.stringify(initialDb));
    return initialDb;
  }
  try {
    return JSON.parse(data);
  } catch {
    localStorage.setItem(DB_KEY, JSON.stringify(initialDb));
    return initialDb;
  }
};

const saveDb = (db) => localStorage.setItem(DB_KEY, JSON.stringify(db));

// ─── API helpers ────────────────────────────────────────────────────────────
const apiFetch = async (path, options = {}) => {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'API request failed');
  }
  return res.json();
};

// ─── dbService ──────────────────────────────────────────────────────────────
export const dbService = {
  // PRODUCTS
  getProducts: async () => {
    try { return await apiFetch('/products'); }
    catch { return getDb().products || []; }
  },
  addProduct: async (product) => {
    try { return await apiFetch('/products', { method: 'POST', body: JSON.stringify(product) }); }
    catch {
      const db = getDb();
      const id = `PROD-${String((db.products?.length || 0) + 1).padStart(2, '0')}`;
      const p = { ...product, id };
      db.products = [p, ...(db.products || [])];
      saveDb(db); return p;
    }
  },
  deleteProduct: async (id) => {
    try { return await apiFetch(`/products/${id}`, { method: 'DELETE' }); }
    catch {
      const db = getDb();
      db.products = (db.products || []).filter(p => p.id !== id);
      saveDb(db); return true;
    }
  },

  // PACKAGES
  getPackages: async () => {
    try { return await apiFetch('/packages'); }
    catch { return getDb().packages || []; }
  },

  // BOOKINGS
  getBookings: async () => {
    try { return await apiFetch('/bookings'); }
    catch { return getDb().bookings || []; }
  },
  getBookingsByUserId: async (userId) => {
    try { return await apiFetch(`/bookings?userId=${userId}`); }
    catch { return (getDb().bookings || []).filter(b => b.userId === userId); }
  },
  getBookingById: async (id) => {
    try { return await apiFetch(`/bookings/${id}`); }
    catch { return (getDb().bookings || []).find(b => b.id === id); }
  },
  createBooking: async (data) => {
    try { return await apiFetch('/bookings', { method: 'POST', body: JSON.stringify(data) }); }
    catch {
      const db = getDb();
      const count = (db.bookings?.length || 0) + 1001;
      const b = { ...data, id: `GVR-${new Date().getFullYear()}-${count}`, status: 'Pending', createdAt: new Date().toISOString() };
      db.bookings = [b, ...(db.bookings || [])];
      saveDb(db); return b;
    }
  },
  updateBookingStatus: async (id, status) => {
    try { return await apiFetch(`/bookings/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }); }
    catch {
      const db = getDb();
      db.bookings = (db.bookings || []).map(b => b.id === id ? { ...b, status } : b);
      saveDb(db); return db.bookings.find(b => b.id === id);
    }
  },

  // SERVICES
  getServices: async () => {
    try { return getDb().services || []; } catch { return []; }
  },

  // INQUIRIES
  getInquiries: async () => {
    try { return await apiFetch('/inquiries'); }
    catch { return getDb().inquiries || []; }
  },
  createInquiry: async (inquiry) => {
    try { return await apiFetch('/inquiries', { method: 'POST', body: JSON.stringify(inquiry) }); }
    catch {
      const db = getDb();
      const id = `INQ-${String((db.inquiries?.length || 0) + 1).padStart(3, '0')}`;
      const i = { ...inquiry, id, status: 'New', date: new Date().toISOString().split('T')[0] };
      db.inquiries = [i, ...(db.inquiries || [])];
      saveDb(db); return i;
    }
  },
  updateInquiryStatus: async (id, status) => {
    try { return await apiFetch(`/inquiries/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }); }
    catch {
      const db = getDb();
      db.inquiries = (db.inquiries || []).map(i => i.id === id ? { ...i, status } : i);
      saveDb(db); return db.inquiries.find(i => i.id === id);
    }
  },

  // AUTH
  findUserByEmail: (email) => (getDb().users || []).find(u => u.email.toLowerCase() === email.toLowerCase()),

  loginWithApi: async (email, password, requiredRole = null) => {
    return apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password, requiredRole }) });
  },

  registerUser: async (userData) => {
    try {
      const result = await apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(userData) });
      return result.user;
    } catch {
      const db = getDb();
      const existing = (db.users || []).find(u => u.email.toLowerCase() === userData.email.toLowerCase());
      if (existing) throw new Error('An account with this email already exists.');
      const id = `USR-${String((db.users?.length || 0) + 1).padStart(3, '0')}`;
      const newUser = { ...userData, id, role: userData.role || 'user' };
      db.users = [...(db.users || []), newUser];
      saveDb(db); return newUser;
    }
  },

  // ADMIN STATS
  getAdminStats: async () => {
    try { return await apiFetch('/stats'); }
    catch {
      const db = getDb();
      const bookings = db.bookings || [];
      const products = db.products || [];
      const inquiries = db.inquiries || [];
      return {
        totalBookings: bookings.length,
        totalRevenue: bookings.reduce((s, b) => s + (Number(b.totalAmount) || 0), 0),
        advanceCollected: bookings.reduce((s, b) => s + (Number(b.advancePaid) || 0), 0),
        pendingBookings: bookings.filter(b => b.status === 'Pending').length,
        confirmedBookings: bookings.filter(b => b.status === 'Confirmed').length,
        completedBookings: bookings.filter(b => b.status === 'Completed').length,
        totalProducts: products.length,
        newInquiries: inquiries.filter(i => i.status === 'New').length
      };
    }
  },

  resetDatabase: () => {
    localStorage.setItem(DB_KEY, JSON.stringify(initialDb));
    return initialDb;
  },
  exportDatabaseJson: () => JSON.stringify(getDb(), null, 2)
};
