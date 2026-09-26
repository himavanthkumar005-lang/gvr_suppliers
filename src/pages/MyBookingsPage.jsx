import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/dbService';
import InvoiceModal from '../components/InvoiceModal';

const MyBookingsPage = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [searchRef, setSearchRef] = useState('');
  const [lookupResult, setLookupResult] = useState(null);
  const [lookupError, setLookupError] = useState('');

  const loadUserBookings = async () => {
    if (currentUser) {
      if (currentUser.role === 'admin') {
        const data = await dbService.getBookings();
        setBookings(Array.isArray(data) ? data : []);
      } else {
        const userBookings = await dbService.getBookingsByUserId(currentUser.id);
        setBookings(Array.isArray(userBookings) ? userBookings : []);
      }
    } else {
      setBookings([]);
    }
  };

  useEffect(() => {
    loadUserBookings();
  }, [currentUser]);

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking reservation?')) {
      await dbService.updateBookingStatus(bookingId, 'Cancelled');
      await loadUserBookings();
    }
  };

  const handleTrackLookup = async (e) => {
    e.preventDefault();
    setLookupError('');
    setLookupResult(null);

    try {
      const found = await dbService.getBookingById(searchRef.trim());
      if (found) {
        setLookupResult(found);
      } else {
        setLookupError(`No booking found matching Reference ID "${searchRef}". Please check and try again.`);
      }
    } catch {
      setLookupError(`No booking found matching Reference ID "${searchRef}". Please check and try again.`);
    }
  };

  return (
    <div>
      {/* Banner */}
      <div className="bg-gvr-primary py-5 text-white">
        <div className="container py-3 text-center">
          <span className="badge badge-gold px-3 py-2 text-uppercase mb-2">Track & Manage</span>
          <h1 className="display-5 fw-bold font-serif mb-2">My Event Bookings</h1>
          <p className="lead text-light opacity-75 mx-auto" style={{ maxWidth: '650px' }}>
            Check real-time booking approval status, view receipts, and download itemized invoices.
          </p>
        </div>
      </div>

      <div className="container py-5">
        {/* Guest Tracking Lookup Bar */}
        <div className="card border-0 shadow-sm rounded-4 p-4 mb-5 bg-white">
          <h5 className="fw-bold font-serif text-dark mb-2">Quick Booking Lookup by Reference ID</h5>
          <p className="text-muted small mb-3">
            If you booked without signing in or want to quickly check any reference (e.g. <code>GVR-2026-1001</code>):
          </p>

          <form onSubmit={handleTrackLookup} className="row g-2 align-items-center">
            <div className="col-md-8">
              <div className="input-group">
                <span className="input-group-text bg-light"><i className="bi bi-search"></i></span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Reference ID (e.g. GVR-2026-1001)"
                  value={searchRef}
                  onChange={(e) => setSearchRef(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="col-md-4">
              <button type="submit" className="btn btn-gvr-gold fw-bold w-100">
                Track Booking
              </button>
            </div>
          </form>

          {lookupError && (
            <div className="alert alert-warning py-2 mt-3 small mb-0">
              <i className="bi bi-exclamation-circle me-1"></i> {lookupError}
            </div>
          )}

          {/* Quick Lookup Card Result */}
          {lookupResult && (
            <div className="mt-4 p-4 border rounded-3 bg-light">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0">Reference: {lookupResult.id}</h6>
                <span className={`badge ${
                  lookupResult.status === 'Confirmed' ? 'bg-success' :
                  lookupResult.status === 'Pending' ? 'bg-warning text-dark' :
                  lookupResult.status === 'Completed' ? 'bg-primary' : 'bg-danger'
                } px-3 py-2 rounded-pill`}>
                  {lookupResult.status}
                </span>
              </div>
              <div className="row g-3 small">
                <div className="col-sm-6">
                  <div><strong>Customer:</strong> {lookupResult.customerName} ({lookupResult.customerPhone})</div>
                  <div><strong>Event:</strong> {lookupResult.eventType} on {lookupResult.eventDate}</div>
                </div>
                <div className="col-sm-6">
                  <div><strong>Venue:</strong> {lookupResult.venueAddress}</div>
                  <div><strong>Total Amount:</strong> ₹{lookupResult.totalAmount?.toLocaleString('en-IN')}</div>
                </div>
              </div>
              <div className="mt-3">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => setSelectedInvoice(lookupResult)}
                >
                  <i className="bi bi-printer me-1"></i> View Full Invoice
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Specific Bookings */}
        {isAuthenticated ? (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold font-serif text-dark mb-0">
                Bookings for {currentUser.name}
              </h4>
              <Link to="/book-now" className="btn btn-sm btn-gvr-gold fw-bold">
                <i className="bi bi-plus-lg me-1"></i> New Booking
              </Link>
            </div>

            {bookings.length > 0 ? (
              <div className="row g-4">
                {bookings.map((booking) => (
                  <div className="col-lg-6" key={booking.id}>
                    <div className="card h-100 border-0 shadow-sm rounded-4 p-4 gvr-card bg-white">
                      <div className="d-flex justify-content-between align-items-start border-bottom pb-3 mb-3">
                        <div>
                          <span className="badge bg-gvr-primary mb-1">{booking.id}</span>
                          <h5 className="fw-bold font-serif text-dark mb-0">{booking.eventType}</h5>
                          <small className="text-muted">
                            Booked on {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'Recent'}
                          </small>
                        </div>
                        <span className={`badge ${
                          booking.status === 'Confirmed' ? 'bg-success' :
                          booking.status === 'Pending' ? 'bg-warning text-dark' :
                          booking.status === 'Completed' ? 'bg-primary' : 'bg-danger'
                        } px-3 py-2 rounded-pill fw-semibold`}>
                          {booking.status}
                        </span>
                      </div>

                      <div className="small text-muted mb-3">
                        <div className="mb-1"><i className="bi bi-calendar-event text-primary me-2"></i><strong>Date:</strong> {booking.eventDate} ({booking.durationDays} Days)</div>
                        <div className="mb-1"><i className="bi bi-geo-alt text-danger me-2"></i><strong>Venue:</strong> {booking.venueAddress}</div>
                        {booking.packageName && (
                          <div className="mb-1"><i className="bi bi-box2-heart text-success me-2"></i><strong>Package:</strong> {booking.packageName}</div>
                        )}
                        {booking.customItems?.length > 0 && (
                          <div className="mb-1"><i className="bi bi-grid text-warning me-2"></i><strong>Custom Items:</strong> {booking.customItems.length} equipment type(s)</div>
                        )}
                      </div>

                      <div className="bg-light p-3 rounded-3 mb-3 d-flex justify-content-between align-items-center">
                        <div>
                          <small className="text-muted d-block">Total Estimated</small>
                          <strong className="fs-5 text-gvr-gold font-serif">₹{booking.totalAmount?.toLocaleString('en-IN')}</strong>
                        </div>
                        <div className="text-end">
                          <small className="text-muted d-block">Advance Paid</small>
                          <span className="text-success fw-bold">₹{booking.advancePaid?.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      <div className="d-flex gap-2 mt-auto">
                        <button
                          className="btn btn-sm btn-outline-dark flex-grow-1"
                          onClick={() => setSelectedInvoice(booking)}
                        >
                          <i className="bi bi-file-text me-1"></i> View Invoice
                        </button>
                        {booking.status !== 'Cancelled' && booking.status !== 'Completed' && (
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleCancelBooking(booking.id)}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card text-center p-5 border-0 shadow-sm rounded-4 bg-white">
                <i className="bi bi-calendar-x fs-1 text-muted mb-2"></i>
                <h5 className="fw-bold">No event bookings found for your account</h5>
                <p className="text-muted small mb-3">Explore our tent setups and reserve dates for your next celebration.</p>
                <Link to="/book-now" className="btn btn-gvr-gold fw-bold px-4 mx-auto">
                  Book Event Now
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="card text-center p-5 border-0 shadow-sm rounded-4 bg-white">
            <i className="bi bi-person-lock fs-1 text-warning mb-2"></i>
            <h5 className="fw-bold">Sign In to View All Your Bookings</h5>
            <p className="text-muted small mb-3">
              Logging in gives you continuous access to all past and upcoming event reservations.
            </p>
            <div className="d-flex justify-content-center gap-2">
              <Link to="/login" className="btn btn-gvr-primary text-white fw-bold px-4">
                Login
              </Link>
              <Link to="/register" className="btn btn-gvr-gold fw-bold px-4">
                Register
              </Link>
            </div>
          </div>
        )}
      </div>

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

export default MyBookingsPage;
