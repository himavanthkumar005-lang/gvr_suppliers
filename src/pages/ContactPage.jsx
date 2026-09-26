import React, { useState } from 'react';
import { dbService } from '../services/dbService';

const GVR_ADDRESS = "Reddy Palem, Nuthalapadu, Parchur Mandal, Prakasam District, Andhra Pradesh, India";
const GOOGLE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(GVR_ADDRESS)}`;
const MAPS_EMBED_URL = `https://maps.google.com/maps?q=${encodeURIComponent(GVR_ADDRESS)}&output=embed&z=14`;

const ContactPage = () => {
  const [inquiryData, setInquiryData] = useState({
    name: '',
    phone: '',
    email: '',
    eventDate: '',
    eventType: 'Wedding',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!inquiryData.name || !inquiryData.phone || !inquiryData.message) {
      setErrorMsg('Please fill in your name, phone number, and inquiry message.');
      return;
    }
    try {
      await dbService.createInquiry(inquiryData);
      setSubmitted(true);
      setInquiryData({ name: '', phone: '', email: '', eventDate: '', eventType: 'Wedding', message: '' });
    } catch (err) {
      setErrorMsg('Failed to submit inquiry: ' + err.message);
    }
  };

  return (
    <div>
      {/* Banner */}
      <div className="bg-gvr-primary py-5 text-white">
        <div className="container py-3 text-center">
          <span className="badge badge-gold px-3 py-2 text-uppercase mb-2">Get In Touch</span>
          <h1 className="display-5 fw-bold font-serif mb-2">Contact GVR Suppliers</h1>
          <p className="lead text-light opacity-75 mx-auto" style={{ maxWidth: '650px' }}>
            We're here to answer your questions, schedule ground measurements, and customise event rentals.
          </p>
        </div>
      </div>

      <div className="container py-5">
        <div className="row g-5">
          {/* Contact Information */}
          <div className="col-lg-5">
            <h3 className="fw-bold font-serif text-dark mb-4">Visit or Call Us</h3>

            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
              {/* Address */}
              <div className="d-flex align-items-start gap-3 mb-4">
                <div className="bg-gvr-gold-soft text-gvr-gold rounded-3 p-3 flex-shrink-0">
                  <i className="bi bi-geo-alt-fill fs-4"></i>
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-1">Main Warehouse & Head Office</h6>
                  <p className="small text-muted mb-2">
                    Reddy Palem, Nuthalapadu, Parchur Mandal,<br />
                    Prakasam District, Andhra Pradesh — 523168
                  </p>
                  <a
                    href={GOOGLE_MAPS_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-outline-primary fw-semibold"
                  >
                    <i className="bi bi-map-fill me-1"></i> Open in Google Maps
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="d-flex align-items-start gap-3 mb-4">
                <div className="bg-gvr-gold-soft text-gvr-gold rounded-3 p-3 flex-shrink-0">
                  <i className="bi bi-telephone-fill fs-4"></i>
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-1">Phone Numbers</h6>
                  <p className="small text-muted mb-1">
                    <a href="tel:+919908862243" className="text-dark text-decoration-none fw-semibold">
                      +91 99088 62243
                    </a>
                    <span className="badge bg-primary ms-2 rounded-pill" style={{ fontSize: '0.65rem' }}>Primary</span>
                  </p>
                  <p className="small text-muted mb-0">
                    <a href="tel:+919492461603" className="text-dark text-decoration-none fw-semibold">
                      +91 94924 61603
                    </a>
                    <span className="badge bg-secondary ms-2 rounded-pill" style={{ fontSize: '0.65rem' }}>Alternative</span>
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="d-flex align-items-start gap-3 mb-4">
                <div className="bg-gvr-gold-soft text-gvr-gold rounded-3 p-3 flex-shrink-0">
                  <i className="bi bi-envelope-fill fs-4"></i>
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-1">Email Address</h6>
                  <a href="mailto:hani.harini004@gmail.com" className="small fw-semibold text-primary text-decoration-none">
                    hani.harini004@gmail.com
                  </a>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="d-flex align-items-start gap-3 mb-4">
                <div className="bg-gvr-gold-soft rounded-3 p-3 flex-shrink-0" style={{ color: '#25d366' }}>
                  <i className="bi bi-whatsapp fs-4"></i>
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-1">Instant WhatsApp Support</h6>
                  <p className="small text-muted mb-2">Send venue photos or layout plans for quick quotation.</p>
                  <a
                    href="https://wa.me/919908862243?text=Hello%20GVR%20Suppliers,%20I%20have%20an%20event%20rental%20enquiry."
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-success fw-bold px-3"
                  >
                    <i className="bi bi-whatsapp me-1"></i> Chat on WhatsApp
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="d-flex align-items-start gap-3">
                <div className="bg-gvr-gold-soft text-gvr-gold rounded-3 p-3 flex-shrink-0">
                  <i className="bi bi-clock-fill fs-4"></i>
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-1">Operating Hours</h6>
                  <p className="small text-muted mb-0">
                    Monday – Sunday: 7:00 AM to 10:00 PM<br />
                    <em>(24/7 On-Call Emergency Logistics)</em>
                  </p>
                </div>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="bg-gvr-primary text-white p-3 d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-pin-map-fill text-gvr-gold"></i>
                  <span className="fw-bold small">Live Location — Nuthalapadu, Prakasam</span>
                </div>
                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-sm btn-outline-warning py-0 px-2"
                  style={{ fontSize: '0.75rem' }}
                >
                  <i className="bi bi-box-arrow-up-right me-1"></i>Directions
                </a>
              </div>
              <iframe
                title="GVR Suppliers Location"
                src={MAPS_EMBED_URL}
                width="100%"
                height="300"
                style={{ border: 0, display: 'block' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
              <h3 className="fw-bold font-serif text-dark mb-2">Send Us an Event Inquiry</h3>
              <p className="text-muted small mb-4">
                Our equipment specialist will respond within 2 hours with customised rates.
              </p>

              {submitted ? (
                <div className="alert alert-success p-4 text-center rounded-4">
                  <i className="bi bi-check-circle-fill text-success fs-1 mb-2 d-block"></i>
                  <h5 className="fw-bold">Inquiry Received!</h5>
                  <p className="small text-muted mb-3">
                    Thank you for reaching out to GVR Suppliers. Our team will contact you on the provided number very shortly.
                  </p>
                  <button className="btn btn-sm btn-outline-success" onClick={() => setSubmitted(false)}>
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {errorMsg && (
                    <div className="alert alert-danger py-2 small mb-3">
                      <i className="bi bi-exclamation-triangle me-1"></i> {errorMsg}
                    </div>
                  )}

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Your Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Anand Kumar"
                        value={inquiryData.name}
                        onChange={(e) => setInquiryData({ ...inquiryData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Mobile Phone Number *</label>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="e.g. +91 99088 62243"
                        value={inquiryData.phone}
                        onChange={(e) => setInquiryData({ ...inquiryData, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="e.g. anand@gmail.com"
                        value={inquiryData.email}
                        onChange={(e) => setInquiryData({ ...inquiryData, email: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Target Event Date</label>
                      <input
                        type="date"
                        className="form-control"
                        min={new Date().toISOString().split('T')[0]}
                        value={inquiryData.eventDate}
                        onChange={(e) => setInquiryData({ ...inquiryData, eventDate: e.target.value })}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Event Type</label>
                      <select
                        className="form-select"
                        value={inquiryData.eventType}
                        onChange={(e) => setInquiryData({ ...inquiryData, eventType: e.target.value })}
                      >
                        <option value="Wedding">Wedding / Marriage Kalyanam</option>
                        <option value="Reception">Reception & Sangeet</option>
                        <option value="Birthday Party">Birthday / Family Function</option>
                        <option value="Housewarming / Puja">Housewarming / Traditional Puja</option>
                        <option value="Corporate / Exhibition">Corporate Exhibition / Seminar</option>
                        <option value="Other">Other Custom Event</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Your Message / Equipment Requirements *</label>
                      <textarea
                        className="form-control"
                        rows="4"
                        placeholder="Tell us what size tent, seating count, lighting, or sound systems you need..."
                        value={inquiryData.message}
                        onChange={(e) => setInquiryData({ ...inquiryData, message: e.target.value })}
                        required
                      ></textarea>
                    </div>
                    <div className="col-12 mt-2">
                      <button type="submit" className="btn btn-gvr-gold w-100 py-3 fw-bold rounded-3">
                        <i className="bi bi-send-fill me-2"></i> Submit Event Inquiry
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
