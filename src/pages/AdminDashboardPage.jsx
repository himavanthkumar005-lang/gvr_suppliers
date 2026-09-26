import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/dbService';
import InvoiceModal from '../components/InvoiceModal';

const AdminDashboardPage = () => {
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('bookings');
  const [stats, setStats] = useState({});
  const [bookings, setBookings] = useState([]);
  const [products, setProducts] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // New Product Modal Form State
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Tents & Shamianas',
    pricePerDay: '',
    stock: '',
    image: '',
    description: '',
    featured: false
  });

  const loadData = async () => {
    try {
      const [s, b, p, inq] = await Promise.all([
        dbService.getAdminStats(),
        dbService.getBookings(),
        dbService.getProducts(),
        dbService.getInquiries()
      ]);
      setStats(s || {});
      setBookings(Array.isArray(b) ? b : []);
      setProducts(Array.isArray(p) ? p : []);
      setInquiries(Array.isArray(inq) ? inq : []);
    } catch (err) {
      console.error('Error loading admin dashboard data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update Booking Status
  const handleUpdateStatus = async (bookingId, newStatus) => {
    await dbService.updateBookingStatus(bookingId, newStatus);
    await loadData();
  };

  // Delete Product
  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to remove this product from inventory?')) {
      await dbService.deleteProduct(productId);
      await loadData();
    }
  };

  // Add Product
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.pricePerDay) return;

    await dbService.addProduct({
      name: newProduct.name,
      category: newProduct.category,
      pricePerDay: Number(newProduct.pricePerDay),
      stock: Number(newProduct.stock) || 1,
      image: newProduct.image || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
      description: newProduct.description || 'Quality event equipment by GVR Suppliers.',
      featured: newProduct.featured
    });

    setShowAddProductModal(false);
    setNewProduct({
      name: '',
      category: 'Tents & Shamianas',
      pricePerDay: '',
      stock: '',
      image: '',
      description: '',
      featured: false
    });
    await loadData();
  };

  // Update Inquiry Status
  const handleInquiryStatus = async (id, status) => {
    await dbService.updateInquiryStatus(id, status);
    await loadData();
  };

  // Export & Reset JSON
  const handleExportJson = () => {
    const jsonStr = dbService.exportDatabaseJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gvr_database_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleResetDb = async () => {
    if (window.confirm('Reset database back to factory initial JSON data? Current custom bookings and items will be restored.')) {
      dbService.resetDatabase();
      await loadData();
      alert('Database reset to initial seed values successfully!');
    }
  };

  // If not logged in as admin
  if (!isAdmin) {
    return (
      <div className="container py-5 text-center">
        <div className="card border-0 shadow-lg rounded-4 p-5 max-w-md mx-auto my-5 bg-white">
          <i className="bi bi-shield-lock-fill fs-1 text-danger mb-3"></i>
          <h3 className="fw-bold font-serif text-dark mb-2">Restricted Admin Portal</h3>
          <p className="text-muted small mb-4">
            You must be authenticated with administrative privileges to access this area.
          </p>
          <div className="d-flex justify-content-center gap-2">
            <Link to="/login" className="btn btn-danger fw-bold px-4">
              Sign In as Admin
            </Link>
            <Link to="/" className="btn btn-outline-secondary fw-bold px-4">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === 'All') return true;
    return b.status === statusFilter;
  });

  return (
    <div className="bg-light min-vh-100 pb-5">
      {/* Admin Header */}
      <div className="bg-gvr-primary-dark text-white py-4 border-bottom border-warning">
        <div className="container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-danger text-uppercase px-2 py-1">Admin Operations</span>
                <span className="text-gvr-gold small">GVR Suppliers Central Control</span>
              </div>
              <h2 className="fw-bold font-serif text-white mb-0">Management Dashboard</h2>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-outline-warning" onClick={handleExportJson}>
                <i className="bi bi-download me-1"></i> Export Database JSON
              </button>
              <button className="btn btn-sm btn-outline-light" onClick={handleResetDb}>
                <i className="bi bi-arrow-clockwise me-1"></i> Reset DB
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-4">
        {/* KPI Metrics Row */}
        <div className="row g-3 mb-4">
          <div className="col-sm-6 col-lg-3">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="small text-muted fw-semibold text-uppercase">Total Bookings</span>
                <i className="bi bi-calendar-event text-primary fs-4"></i>
              </div>
              <h3 className="fw-bold font-serif mb-0 text-dark">{stats.totalBookings || 0}</h3>
              <small className="text-muted">{stats.pendingBookings || 0} pending review</small>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="small text-muted fw-semibold text-uppercase">Gross Revenue</span>
                <i className="bi bi-currency-rupee text-success fs-4"></i>
              </div>
              <h3 className="fw-bold font-serif mb-0 text-success">
                ₹{(stats.totalRevenue || 0).toLocaleString('en-IN')}
              </h3>
              <small className="text-muted">₹{(stats.advanceCollected || 0).toLocaleString('en-IN')} advance paid</small>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="small text-muted fw-semibold text-uppercase">Active Equipment</span>
                <i className="bi bi-boxes text-warning fs-4"></i>
              </div>
              <h3 className="fw-bold font-serif mb-0 text-dark">{stats.totalProducts || 0}</h3>
              <small className="text-muted">Types available in warehouse</small>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="small text-muted fw-semibold text-uppercase">New Inquiries</span>
                <i className="bi bi-chat-left-dots text-danger fs-4"></i>
              </div>
              <h3 className="fw-bold font-serif mb-0 text-danger">{stats.newInquiries || 0}</h3>
              <small className="text-muted">Awaiting response</small>
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4 bg-white">
          <div className="card-header bg-white border-bottom p-0">
            <ul className="nav nav-tabs card-header-tabs m-0 border-0">
              <li className="nav-item">
                <button
                  className={`nav-link border-0 py-3 px-4 fw-bold small text-uppercase ${
                    activeTab === 'bookings' ? 'active text-primary border-bottom border-primary border-3' : 'text-muted'
                  }`}
                  onClick={() => setActiveTab('bookings')}
                >
                  <i className="bi bi-calendar2-check me-2"></i> Bookings Management ({bookings.length})
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link border-0 py-3 px-4 fw-bold small text-uppercase ${
                    activeTab === 'inventory' ? 'active text-primary border-bottom border-primary border-3' : 'text-muted'
                  }`}
                  onClick={() => setActiveTab('inventory')}
                >
                  <i className="bi bi-grid-3x3 me-2"></i> Equipment Inventory ({products.length})
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link border-0 py-3 px-4 fw-bold small text-uppercase ${
                    activeTab === 'inquiries' ? 'active text-primary border-bottom border-primary border-3' : 'text-muted'
                  }`}
                  onClick={() => setActiveTab('inquiries')}
                >
                  <i className="bi bi-envelope me-2"></i> Customer Inquiries ({inquiries.length})
                </button>
              </li>
            </ul>
          </div>

          <div className="card-body p-4">
            {/* TAB 1: BOOKINGS MANAGEMENT */}
            {activeTab === 'bookings' && (
              <div>
                {/* Filter Row */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                  <div className="d-flex gap-2 flex-wrap">
                    {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((status) => (
                      <button
                        key={status}
                        className={`btn btn-sm ${statusFilter === status ? 'btn-dark' : 'btn-outline-secondary'}`}
                        onClick={() => setStatusFilter(status)}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                  <div className="small text-muted">
                    Showing <strong>{filteredBookings.length}</strong> bookings
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light small">
                      <tr>
                        <th>Reference / Date</th>
                        <th>Customer</th>
                        <th>Event & Venue</th>
                        <th>Package / Items</th>
                        <th>Total Amount</th>
                        <th>Status</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="small">
                      {filteredBookings.map((b) => (
                        <tr key={b.id}>
                          <td>
                            <strong className="text-primary">{b.id}</strong>
                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                              Event: {b.eventDate} ({b.durationDays}d)
                            </div>
                          </td>
                          <td>
                            <div className="fw-semibold text-dark">{b.customerName}</div>
                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>{b.customerPhone}</div>
                          </td>
                          <td>
                            <span className="badge bg-light text-dark border">{b.eventType}</span>
                            <div className="text-muted text-truncate" style={{ maxWidth: '180px', fontSize: '0.75rem' }}>
                              {b.venueAddress}
                            </div>
                          </td>
                          <td>
                            {b.packageName ? (
                              <div className="fw-semibold text-truncate" style={{ maxWidth: '160px' }}>
                                {b.packageName}
                              </div>
                            ) : (
                              <span className="text-muted">Custom equipment</span>
                            )}
                            {b.customItems?.length > 0 && (
                              <small className="text-muted d-block">+{b.customItems.length} rental item(s)</small>
                            )}
                          </td>
                          <td>
                            <strong className="text-gvr-primary">₹{(b.totalAmount || 0).toLocaleString('en-IN')}</strong>
                            <div className="text-success" style={{ fontSize: '0.72rem' }}>
                              Adv: ₹{(b.advancePaid || 0).toLocaleString('en-IN')}
                            </div>
                          </td>
                          <td>
                            <span className={`badge ${
                              b.status === 'Confirmed' ? 'bg-success' :
                              b.status === 'Pending' ? 'bg-warning text-dark' :
                              b.status === 'Completed' ? 'bg-primary' : 'bg-danger'
                            } rounded-pill`}>
                              {b.status}
                            </span>
                          </td>
                          <td className="text-end">
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-outline-secondary"
                                title="View Quotation Invoice"
                                onClick={() => setSelectedInvoice(b)}
                              >
                                <i className="bi bi-printer"></i>
                              </button>
                              {b.status === 'Pending' && (
                                <button
                                  className="btn btn-success"
                                  title="Approve & Confirm"
                                  onClick={() => handleUpdateStatus(b.id, 'Confirmed')}
                                >
                                  <i className="bi bi-check-lg"></i>
                                </button>
                              )}
                              {b.status === 'Confirmed' && (
                                <button
                                  className="btn btn-primary"
                                  title="Mark as Completed"
                                  onClick={() => handleUpdateStatus(b.id, 'Completed')}
                                >
                                  <i className="bi bi-flag-fill"></i>
                                </button>
                              )}
                              {b.status !== 'Cancelled' && (
                                <button
                                  className="btn btn-outline-danger"
                                  title="Cancel Booking"
                                  onClick={() => handleUpdateStatus(b.id, 'Cancelled')}
                                >
                                  <i className="bi bi-x-lg"></i>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: INVENTORY MANAGEMENT */}
            {activeTab === 'inventory' && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-bold font-serif text-dark mb-0">Equipment Catalog</h5>
                  <button
                    className="btn btn-gvr-gold btn-sm fw-bold"
                    onClick={() => setShowAddProductModal(true)}
                  >
                    <i className="bi bi-plus-lg me-1"></i> Add Rental Equipment
                  </button>
                </div>

                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light small">
                      <tr>
                        <th>Item</th>
                        <th>Category</th>
                        <th>Daily Rate</th>
                        <th>Stock Available</th>
                        <th>Featured</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="small">
                      {products.map((p) => (
                        <tr key={p.id}>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="rounded object-fit-cover"
                                style={{ width: '40px', height: '40px' }}
                              />
                              <div>
                                <div className="fw-semibold text-dark">{p.name}</div>
                                <div className="text-muted text-truncate" style={{ maxWidth: '240px', fontSize: '0.72rem' }}>
                                  {p.description}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-light text-dark border">{p.category}</span>
                          </td>
                          <td className="fw-bold text-gvr-primary">₹{p.pricePerDay.toLocaleString('en-IN')} / day</td>
                          <td>
                            <span className={`badge ${p.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                              {p.stock} units
                            </span>
                          </td>
                          <td>
                            {p.featured ? (
                              <i className="bi bi-star-fill text-warning"></i>
                            ) : (
                              <i className="bi bi-dash text-muted"></i>
                            )}
                          </td>
                          <td className="text-end">
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteProduct(p.id)}
                              title="Delete Item"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: CUSTOMER INQUIRIES */}
            {activeTab === 'inquiries' && (
              <div>
                <h5 className="fw-bold font-serif text-dark mb-3">Customer Inquiries & Messages</h5>
                <div className="row g-3">
                  {inquiries.map((inq) => (
                    <div className="col-md-6" key={inq.id}>
                      <div className="card h-100 border p-3 rounded-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="badge bg-secondary">{inq.id}</span>
                          <span className={`badge ${inq.status === 'New' ? 'bg-danger' : 'bg-success'}`}>
                            {inq.status}
                          </span>
                        </div>
                        <h6 className="fw-bold mb-1 text-dark">{inq.name}</h6>
                        <div className="small text-muted mb-2">
                          <i className="bi bi-telephone me-1"></i> {inq.phone} | <i className="bi bi-envelope me-1"></i> {inq.email || 'N/A'}
                        </div>
                        <div className="small text-muted mb-2">
                          <strong>Event:</strong> {inq.eventType} ({inq.eventDate || 'Date TBD'})
                        </div>
                        <p className="small text-dark p-2 bg-light rounded mb-3">
                          "{inq.message}"
                        </p>
                        <div className="d-flex justify-content-between align-items-center mt-auto">
                          <small className="text-muted">Received: {inq.date}</small>
                          {inq.status === 'New' ? (
                            <button
                              className="btn btn-sm btn-outline-success"
                              onClick={() => handleInquiryStatus(inq.id, 'Responded')}
                            >
                              <i className="bi bi-check2 me-1"></i> Mark Responded
                            </button>
                          ) : (
                            <span className="small text-success fw-semibold">
                              <i className="bi bi-check-all me-1"></i> Addressed
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-gvr-primary text-white">
                <h5 className="modal-title font-serif">Add New Rental Equipment</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowAddProductModal(false)}></button>
              </div>
              <form onSubmit={handleSaveProduct}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Product Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Waterproof German Tent (50x30)"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Category</label>
                      <select
                        className="form-select"
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      >
                        <option value="Tents & Shamianas">Tents & Shamianas</option>
                        <option value="Chairs & Tables">Chairs & Tables</option>
                        <option value="Stages & Mandapams">Stages & Mandapams</option>
                        <option value="Lighting & Decor">Lighting & Decor</option>
                        <option value="Sound & Audio">Sound & Audio</option>
                        <option value="Catering Utensils">Catering Utensils</option>
                        <option value="Power & Cooling">Power & Cooling</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Daily Rent (₹) *</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="e.g. 5000"
                        value={newProduct.pricePerDay}
                        onChange={(e) => setNewProduct({ ...newProduct, pricePerDay: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Available Stock Units</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="e.g. 10"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6 d-flex align-items-center mt-4">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="featCheck"
                          checked={newProduct.featured}
                          onChange={(e) => setNewProduct({ ...newProduct, featured: e.target.checked })}
                        />
                        <label className="form-check-label small fw-semibold" htmlFor="featCheck">
                          Show on Homepage (Featured)
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Image URL</label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://images.unsplash.com/..."
                      value={newProduct.image}
                      onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Product dimensions, quality specifications, and capacity..."
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    ></textarea>
                  </div>
                </div>

                <div className="modal-footer bg-light py-2">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddProductModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-gvr-gold btn-sm fw-bold">
                    Save Equipment to Inventory
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {selectedInvoice && (
        <InvoiceModal
          booking={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
};

export default AdminDashboardPage;
