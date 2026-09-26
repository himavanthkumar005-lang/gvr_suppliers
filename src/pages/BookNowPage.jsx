import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/dbService';
import InvoiceModal from '../components/InvoiceModal';

const BookNowPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();

  const [packages, setPackages] = useState([]);
  const [products, setProducts] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    venueAddress: '',
    eventType: 'Wedding Ceremony',
    eventDate: '',
    durationDays: 1,
    guestCount: '300',
    selectedPackageId: '',
    selectedItems: [], // array of { id, name, pricePerDay, quantity }
    notes: ''
  });

  const [submittedBooking, setSubmittedBooking] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const pkgs = (await dbService.getPackages()) || [];
        const prods = (await dbService.getProducts()) || [];
        if (!isMounted) return;

        setPackages(Array.isArray(pkgs) ? pkgs : []);
        setProducts(Array.isArray(prods) ? prods : []);

        // Read query parameters
        const pkgId = searchParams.get('packageId');
        const prodId = searchParams.get('productId');
        const type = searchParams.get('type');
        const date = searchParams.get('date');
        const guests = searchParams.get('guests');

        setFormData((prev) => {
          let initialItems = [...prev.selectedItems];
          if (prodId && Array.isArray(prods)) {
            const found = prods.find(p => p.id === prodId);
            if (found && !initialItems.some(i => i.id === prodId)) {
              initialItems.push({
                id: found.id,
                name: found.name,
                pricePerDay: found.pricePerDay,
                quantity: 1
              });
            }
          }

          return {
            ...prev,
            customerName: currentUser?.name || prev.customerName,
            customerEmail: currentUser?.email || prev.customerEmail,
            customerPhone: currentUser?.phone || prev.customerPhone,
            venueAddress: currentUser?.address || prev.venueAddress,
            selectedPackageId: pkgId || prev.selectedPackageId,
            eventType: type || prev.eventType,
            eventDate: date || prev.eventDate,
            guestCount: guests ? String(guests).replace(/\D/g, '') || '300' : prev.guestCount,
            selectedItems: initialItems
          };
        });
      } catch (err) {
        console.error('Error loading booking data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [searchParams, currentUser]);

  // Handle Package Selection
  const handlePackageChange = (e) => {
    setFormData({ ...formData, selectedPackageId: e.target.value });
  };

  // Handle Adding Item to Custom Selection
  const handleAddItem = (productId) => {
    if (!productId || !Array.isArray(products)) return;
    const prod = products.find(p => p.id === productId);
    if (!prod) return;

    const exists = formData.selectedItems.find(i => i.id === productId);
    if (exists) {
      setFormData({
        ...formData,
        selectedItems: formData.selectedItems.map(i =>
          i.id === productId ? { ...i, quantity: i.quantity + 1 } : i
        )
      });
    } else {
      setFormData({
        ...formData,
        selectedItems: [
          ...formData.selectedItems,
          { id: prod.id, name: prod.name, pricePerDay: prod.pricePerDay, quantity: 1 }
        ]
      });
    }
  };

  // Handle Quantity Change
  const handleQuantityChange = (id, delta) => {
    setFormData({
      ...formData,
      selectedItems: formData.selectedItems
        .map(item => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    });
  };

  // Remove Item
  const handleRemoveItem = (id) => {
    setFormData({
      ...formData,
      selectedItems: formData.selectedItems.filter(i => i.id !== id)
    });
  };

  // Calculation Logic
  const selectedPkg = Array.isArray(packages) ? packages.find(p => p.id === formData.selectedPackageId) : null;
  const pkgCost = selectedPkg ? selectedPkg.price * Number(formData.durationDays || 1) : 0;
  const itemsCost = formData.selectedItems.reduce(
    (sum, item) => sum + item.pricePerDay * item.quantity * Number(formData.durationDays || 1),
    0
  );
  const subtotal = pkgCost + itemsCost;
  const transportSetup = subtotal > 0 ? Math.round(subtotal * 0.05) : 0;
  const totalAmount = subtotal + transportSetup;
  const advanceRequired = Math.round(totalAmount * 0.3); // 30% advance deposit

  // Handle Form Submission
  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.customerName || !formData.customerPhone || !formData.venueAddress || !formData.eventDate) {
      setErrorMsg('Please complete all mandatory contact, date, and venue fields.');
      return;
    }

    if (!formData.selectedPackageId && formData.selectedItems.length === 0) {
      setErrorMsg('Please select at least one package or add individual equipment rentals to your booking.');
      return;
    }

    try {
      const bookingPayload = {
        userId: currentUser?.id || 'GUEST',
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail || 'guest@gvrsuppliers.com',
        venueAddress: formData.venueAddress,
        eventType: formData.eventType,
        eventDate: formData.eventDate,
        durationDays: Number(formData.durationDays) || 1,
        guestCount: Number(formData.guestCount) || 100,
        packageId: formData.selectedPackageId || null,
        packageName: selectedPkg ? selectedPkg.title : null,
        customItems: formData.selectedItems,
        totalAmount,
        advancePaid: advanceRequired,
        notes: formData.notes
      };

      const created = await dbService.createBooking(bookingPayload);
      setSubmittedBooking(created);
    } catch (err) {
      setErrorMsg('Failed to process booking. ' + err.message);
    }
  };

  return (
    <div>
      {/* Banner */}
      <div className="bg-gvr-primary py-5 text-white">
        <div className="container py-3 text-center">
          <span className="badge badge-gold px-3 py-2 text-uppercase mb-2">Event Reservation</span>
          <h1 className="display-5 fw-bold font-serif mb-2">Book Event Equipment & Tents</h1>
          <p className="lead text-light opacity-75 mx-auto" style={{ maxWidth: '650px' }}>
            Customize your setup, review instant itemized quotation, and submit your reservation.
          </p>
        </div>
      </div>

      <div className="container py-5">
        {submittedBooking ? (
          /* Confirmation State */
          <div className="card border-0 shadow-lg rounded-4 p-4 p-md-5 text-center bg-white">
            <div className="bg-success text-white rounded-circle p-3 d-inline-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '80px', height: '80px' }}>
              <i className="bi bi-check2-circle fs-1"></i>
            </div>
            <h2 className="fw-bold font-serif text-dark mb-2">Booking Submitted Successfully!</h2>
            <p className="lead text-muted mb-3">
              Booking Reference ID: <strong className="text-gvr-primary">{submittedBooking.id}</strong>
            </p>
            <p className="text-muted mx-auto mb-4" style={{ maxWidth: '600px' }}>
              Thank you, <strong>{submittedBooking.customerName}</strong>. Our logistics supervisor will call you on <strong>{submittedBooking.customerPhone}</strong> within 2 business hours to verify site entry timings and coordinate dispatch.
            </p>

            <div className="d-flex justify-content-center gap-3 flex-wrap mb-4">
              <button
                className="btn btn-gvr-gold btn-lg px-4 py-2 fw-bold"
                onClick={() => setShowInvoiceModal(true)}
              >
                <i className="bi bi-receipt-cutoff me-2"></i> View & Print Quotation Invoice
              </button>
              {isAuthenticated && (
                <Link to="/my-bookings" className="btn btn-outline-dark btn-lg px-4 py-2">
                  <i className="bi bi-list-check me-2"></i> Track in My Bookings
                </Link>
              )}
              <button
                className="btn btn-outline-secondary btn-lg px-4 py-2"
                onClick={() => {
                  setSubmittedBooking(null);
                  setFormData({
                    customerName: currentUser?.name || '',
                    customerPhone: currentUser?.phone || '',
                    customerEmail: currentUser?.email || '',
                    venueAddress: currentUser?.address || '',
                    eventType: 'Wedding Ceremony',
                    eventDate: '',
                    durationDays: 1,
                    guestCount: '300',
                    selectedPackageId: '',
                    selectedItems: [],
                    notes: ''
                  });
                }}
              >
                Create Another Booking
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleSubmitBooking}>
            {errorMsg && (
              <div className="alert alert-danger d-flex align-items-center gap-2 mb-4">
                <i className="bi bi-exclamation-triangle-fill fs-5"></i>
                <div>{errorMsg}</div>
              </div>
            )}

            {!isAuthenticated && (
              <div className="alert alert-info d-flex justify-content-between align-items-center mb-4 rounded-3">
                <div className="small">
                  <i className="bi bi-info-circle-fill me-1"></i> Already have an account? Sign in to autofill your details and track your booking in real time.
                </div>
                <Link to="/login" className="btn btn-sm btn-outline-primary fw-semibold flex-shrink-0 ms-2">
                  Login Now
                </Link>
              </div>
            )}

            <div className="row g-4">
              {/* Left Column: Details & Items Selection */}
              <div className="col-lg-8">
                {/* Step 1: Customer Info */}
                <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
                  <h5 className="fw-bold font-serif text-dark mb-3 d-flex align-items-center gap-2">
                    <span className="badge bg-gvr-primary rounded-circle" style={{ width: '28px', height: '28px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>1</span>
                    <span>Customer & Contact Information</span>
                  </h5>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Full Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Your full name"
                        value={formData.customerName}
                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Mobile Phone Number *</label>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="Your phone number"
                        value={formData.customerPhone}
                        onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="e.g. name@example.com"
                        value={formData.customerEmail}
                        onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Venue City / Town *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Guntur, Vijayawada, Mangalagiri..."
                        value={formData.venueAddress}
                        onChange={(e) => setFormData({ ...formData, venueAddress: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Step 2: Event Details */}
                <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
                  <h5 className="fw-bold font-serif text-dark mb-3 d-flex align-items-center gap-2">
                    <span className="badge bg-gvr-primary rounded-circle" style={{ width: '28px', height: '28px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>2</span>
                    <span>Event Schedule & Scale</span>
                  </h5>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Event Type</label>
                      <select
                        className="form-select"
                        value={formData.eventType}
                        onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                      >
                        <option value="Wedding Ceremony">Wedding Ceremony (Kalyanam)</option>
                        <option value="Reception / Sangeet">Reception & Sangeet</option>
                        <option value="Birthday Celebration">Birthday Party</option>
                        <option value="Traditional Puja / Housewarming">Traditional Puja / Gruhapravesam</option>
                        <option value="Corporate Seminar">Corporate Seminar / Expo</option>
                        <option value="Public Gathering">Public Gathering / Cultural Meet</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Event Start Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        min={new Date().toISOString().split('T')[0]}
                        value={formData.eventDate}
                        onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Event Duration (Days)</label>
                      <input
                        type="number"
                        className="form-control"
                        min="1"
                        max="30"
                        value={formData.durationDays}
                        onChange={(e) => setFormData({ ...formData, durationDays: Math.max(1, parseInt(e.target.value) || 1) })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Estimated Guest Count</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="e.g. 500"
                        value={formData.guestCount}
                        onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Step 3: Equipment & Package Selection */}
                <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
                  <h5 className="fw-bold font-serif text-dark mb-3 d-flex align-items-center gap-2">
                    <span className="badge bg-gvr-primary rounded-circle" style={{ width: '28px', height: '28px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
                    <span>Select Package and/or Individual Items</span>
                  </h5>

                  {/* Pre-packaged bundle choice */}
                  <div className="mb-4">
                    <label className="form-label small fw-semibold">Choose an All-In-One Package (Optional):</label>
                    <select
                      className="form-select bg-light"
                      value={formData.selectedPackageId}
                      onChange={handlePackageChange}
                    >
                      <option value="">-- No package selected (Custom individual items only) --</option>
                      {packages.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.title} - ₹{p.price.toLocaleString('en-IN')} / day ({p.bestFor})
                        </option>
                      ))}
                    </select>
                    {selectedPkg && (
                      <div className="mt-2 p-3 bg-gvr-gold-soft rounded-3 border border-warning small">
                        <strong className="text-dark d-block mb-1">{selectedPkg.title}</strong>
                        <ul className="mb-0 ps-3 text-muted">
                          {selectedPkg.features.map((f, idx) => (
                            <li key={idx}>{f}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Add Individual Items */}
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Add Individual Rental Items to Setup:</label>
                    <div className="d-flex gap-2">
                      <select
                        id="productSelect"
                        className="form-select"
                        defaultValue=""
                      >
                        <option value="" disabled>-- Select equipment from catalog to add --</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>
                            [{p.category}] {p.name} - ₹{p.pricePerDay}/day
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        className="btn btn-gvr-gold fw-bold px-3 flex-shrink-0"
                        onClick={() => {
                          const el = document.getElementById('productSelect');
                          if (el && el.value) {
                            handleAddItem(el.value);
                          }
                        }}
                      >
                        <i className="bi bi-plus-lg me-1"></i> Add Item
                      </button>
                    </div>
                  </div>

                  {/* Selected Items List */}
                  {formData.selectedItems.length > 0 && (
                    <div className="table-responsive mt-3">
                      <table className="table table-sm table-bordered align-middle small">
                        <thead className="table-light">
                          <tr>
                            <th>Item Name</th>
                            <th className="text-center" style={{ width: '130px' }}>Quantity</th>
                            <th className="text-end">Daily Rate</th>
                            <th className="text-end">Subtotal</th>
                            <th className="text-center" style={{ width: '50px' }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.selectedItems.map((item) => (
                            <tr key={item.id}>
                              <td className="fw-semibold">{item.name}</td>
                              <td className="text-center">
                                <div className="btn-group btn-group-sm">
                                  <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => handleQuantityChange(item.id, -1)}
                                  >
                                    -
                                  </button>
                                  <span className="px-2 d-flex align-items-center bg-white border">
                                    {item.quantity}
                                  </span>
                                  <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => handleQuantityChange(item.id, 1)}
                                  >
                                    +
                                  </button>
                                </div>
                              </td>
                              <td className="text-end">₹{item.pricePerDay}</td>
                              <td className="text-end fw-bold">
                                ₹{(item.pricePerDay * item.quantity * formData.durationDays).toLocaleString('en-IN')}
                              </td>
                              <td className="text-center">
                                <button
                                  type="button"
                                  className="btn btn-sm text-danger p-0 border-0"
                                  onClick={() => handleRemoveItem(item.id)}
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Special Requests */}
                  <div className="mt-3">
                    <label className="form-label small fw-semibold">Special Instructions or Setup Requirements</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="e.g. Ground dimension constraints, generator cable length needed, stage color preferences..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Price Summary & Submit */}
              <div className="col-lg-4">
                <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top bg-white" style={{ top: '90px' }}>
                  <h5 className="fw-bold font-serif text-dark mb-3 border-bottom pb-2">Quotation Summary</h5>

                  <div className="d-flex justify-content-between small text-muted mb-2">
                    <span>Event Duration:</span>
                    <strong className="text-dark">{formData.durationDays} Day(s)</strong>
                  </div>

                  {selectedPkg && (
                    <div className="d-flex justify-content-between small text-muted mb-2">
                      <span className="text-truncate pe-2">Package ({selectedPkg.title}):</span>
                      <strong className="text-dark">₹{pkgCost.toLocaleString('en-IN')}</strong>
                    </div>
                  )}

                  {formData.selectedItems.length > 0 && (
                    <div className="d-flex justify-content-between small text-muted mb-2">
                      <span>Custom Items ({formData.selectedItems.length}):</span>
                      <strong className="text-dark">₹{itemsCost.toLocaleString('en-IN')}</strong>
                    </div>
                  )}

                  <div className="d-flex justify-content-between small text-muted mb-2">
                    <span>Logistics & Rigging (5%):</span>
                    <strong className="text-dark">₹{transportSetup.toLocaleString('en-IN')}</strong>
                  </div>

                  <hr />

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="fw-bold text-dark fs-5">Estimated Total:</span>
                    <span className="fw-bold text-gvr-gold font-serif fs-4">
                      ₹{totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="bg-light p-3 rounded-3 mb-4 border">
                    <div className="d-flex justify-content-between small mb-1">
                      <span className="text-muted">Advance to Lock Date (30%):</span>
                      <strong className="text-success">₹{advanceRequired.toLocaleString('en-IN')}</strong>
                    </div>
                    <small className="text-muted d-block" style={{ fontSize: '0.72rem' }}>
                      Balance payable on setup completion at venue.
                    </small>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-gvr-gold w-100 py-3 fw-bold rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2"
                  >
                    <i className="bi bi-send-check-fill"></i>
                    <span>Confirm & Book Reservation</span>
                  </button>

                  <div className="mt-3 text-center small text-muted">
                    <i className="bi bi-shield-check text-success me-1"></i>
                    Zero cancellation fees up to 72 hours before event.
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Invoice Receipt Modal */}
      {showInvoiceModal && submittedBooking && (
        <InvoiceModal
          booking={submittedBooking}
          onClose={() => setShowInvoiceModal(false)}
        />
      )}
    </div>
  );
};

export default BookNowPage;
