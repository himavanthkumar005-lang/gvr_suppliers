import React from 'react';

const InvoiceModal = ({ booking, onClose }) => {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const balanceDue = Math.max(0, (booking.totalAmount || 0) - (booking.advancePaid || 0));

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content shadow-lg border-0">
          <div className="modal-header bg-gvr-primary text-white py-3">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-receipt-cutoff text-gvr-gold fs-4"></i>
              <div>
                <h5 className="modal-title font-serif mb-0 text-white">Booking Quotation & Invoice</h5>
                <small className="text-light opacity-75">Reference: {booking.id}</small>
              </div>
            </div>
            <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={onClose}></button>
          </div>

          <div className="modal-body p-4" id="printableInvoice">
            {/* Invoice Header */}
            <div className="d-flex justify-content-between align-items-start border-bottom pb-3 mb-4">
              <div>
                <h4 className="fw-bold font-serif text-gvr-primary mb-1">GVR SUPPLIERS</h4>
                <p className="text-muted small mb-0">
                  Premium Tent House, Stage Decorators & Event Equipment Rentals<br />
                  Reddy Palem, Nuthalapadu, Parchur Mandal, Prakasam District, Andhra Pradesh<br />
                  Phone: +91 99088 62243 / +91 94924 61603 | Email: hani.harini004@gmail.com
                </p>
              </div>
              <div className="text-end">
                <span className={`badge ${
                  booking.status === 'Confirmed' ? 'bg-success' :
                  booking.status === 'Pending' ? 'bg-warning text-dark' :
                  booking.status === 'Completed' ? 'bg-primary' : 'bg-danger'
                } px-3 py-2 fs-6 rounded-pill mb-2`}>
                  {booking.status}
                </span>
                <div className="small text-muted">
                  Booking Date: {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            </div>

            {/* Bill To & Event Details */}
            <div className="row g-3 mb-4">
              <div className="col-sm-6">
                <div className="p-3 bg-light rounded-3 h-100 border">
                  <h6 className="fw-bold text-dark text-uppercase small mb-2">Customer Details:</h6>
                  <p className="mb-1 fw-semibold">{booking.customerName}</p>
                  <p className="small text-muted mb-1"><i className="bi bi-telephone me-1"></i> {booking.customerPhone}</p>
                  <p className="small text-muted mb-0"><i className="bi bi-envelope me-1"></i> {booking.customerEmail}</p>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="p-3 bg-light rounded-3 h-100 border">
                  <h6 className="fw-bold text-dark text-uppercase small mb-2">Event & Venue Logistics:</h6>
                  <p className="small mb-1"><strong>Event Type:</strong> {booking.eventType}</p>
                  <p className="small mb-1"><strong>Date & Duration:</strong> {booking.eventDate} ({booking.durationDays} Day{booking.durationDays > 1 ? 's' : ''})</p>
                  <p className="small mb-1"><strong>Estimated Guests:</strong> {booking.guestCount || 'N/A'}</p>
                  <p className="small text-muted mb-0"><i className="bi bi-geo-alt me-1"></i> {booking.venueAddress}</p>
                </div>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="table-responsive mb-4">
              <table className="table table-bordered table-striped align-middle small">
                <thead className="table-dark">
                  <tr>
                    <th>Item / Package Description</th>
                    <th className="text-center" style={{ width: '15%' }}>Qty / Setup</th>
                    <th className="text-end" style={{ width: '25%' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {booking.packageName && (
                    <tr>
                      <td>
                        <strong className="text-dark">{booking.packageName}</strong>
                        <div className="text-muted" style={{ fontSize: '0.78rem' }}>Complete pre-packaged event rental setup</div>
                      </td>
                      <td className="text-center">1 Package</td>
                      <td className="text-end fw-bold">
                        ₹{(booking.totalAmount - (booking.customItems?.reduce((s, i) => s + (i.pricePerDay * i.quantity * booking.durationDays), 0) || 0)).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  )}
                  {booking.customItems?.map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <div className="fw-semibold text-dark">{item.name}</div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>Rate: ₹{item.pricePerDay} / day × {booking.durationDays} day(s)</div>
                      </td>
                      <td className="text-center">{item.quantity}</td>
                      <td className="text-end fw-bold">
                        ₹{(item.pricePerDay * item.quantity * booking.durationDays).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="2" className="text-end fw-bold">Total Estimated Amount:</td>
                    <td className="text-end fw-bold fs-6 text-gvr-primary">₹{(booking.totalAmount || 0).toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="text-end text-success fw-bold">Advance Payment Received:</td>
                    <td className="text-end fw-bold text-success">₹{(booking.advancePaid || 0).toLocaleString('en-IN')}</td>
                  </tr>
                  <tr className="table-warning">
                    <td colSpan="2" className="text-end fw-bold text-danger">Balance Due at Setup:</td>
                    <td className="text-end fw-bold text-danger fs-6">₹{balanceDue.toLocaleString('en-IN')}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {booking.notes && (
              <div className="alert alert-info py-2 small mb-3">
                <strong>Client Special Instructions:</strong> {booking.notes}
              </div>
            )}

            <div className="border-top pt-2 text-center text-muted" style={{ fontSize: '0.72rem' }}>
              Thank you for choosing GVR Suppliers. For emergency dispatch or venue site inspections, please contact support at +91 99088 62243 / +91 94924 61603.
            </div>
          </div>

          <div className="modal-footer bg-light py-2">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
            <button type="button" className="btn btn-primary d-flex align-items-center gap-2" onClick={handlePrint}>
              <i className="bi bi-printer"></i>
              <span>Print Invoice</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
