import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();
  const [quickForm, setQuickForm] = useState({
    eventType: 'Wedding',
    date: '',
    guests: '300-500'
  });

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    navigate(`/book-now?type=${encodeURIComponent(quickForm.eventType)}&guests=${encodeURIComponent(quickForm.guests)}&date=${encodeURIComponent(quickForm.date)}`);
  };

  return (
    <div className="hero-wrapper">
      <div className="container">
        <div className="row align-items-center g-5">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="col-lg-7 text-center text-lg-start">
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-white bg-opacity-10 border border-warning border-opacity-50 text-warning mb-3">
              <i className="bi bi-stars"></i>
              <span className="small fw-semibold text-uppercase tracking-wider">Premier Tent House & Event Decorators</span>
            </div>

            <h1 className="display-4 fw-extrabold text-white font-serif mb-3 lh-sm">
              Making Every Occasion <br />
              <span className="text-gvr-gold">Grand, Elegant & Seamless</span>
            </h1>

            <p className="lead text-light opacity-90 mb-4 pe-lg-4">
              From majestic German waterproof hangars & traditional wedding mandapams to VIP Maharaja seating, crystal-clear JBL line-array sound, moving head stage lighting, and full catering infrastructure.
            </p>

            <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start mb-4">
              <Link to="/book-now" className="btn btn-gvr-gold btn-lg px-4 py-2 d-flex align-items-center gap-2">
                <i className="bi bi-calendar2-check-fill"></i>
                <span>Book Event Rentals</span>
              </Link>
              <Link to="/products" className="btn btn-outline-light btn-lg px-4 py-2 d-flex align-items-center gap-2">
                <i className="bi bi-grid-3x3-gap"></i>
                <span>View Products Catalog</span>
              </Link>
              <Link to="/packages" className="btn btn-outline-gvr-gold btn-lg px-4 py-2 d-flex align-items-center gap-2">
                <i className="bi bi-gift"></i>
                <span>All-In-One Packages</span>
              </Link>
            </div>

            {/* Trust Highlights */}
            <div className="row pt-3 border-top border-secondary border-opacity-50 text-start g-3">
              <div className="col-4">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-patch-check-fill text-gvr-gold fs-4"></i>
                  <div>
                    <h6 className="mb-0 fw-bold text-white">15+ Years</h6>
                    <small className="text-light opacity-75">Event Excellence</small>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-shield-check text-gvr-gold fs-4"></i>
                  <div>
                    <h6 className="mb-0 fw-bold text-white">100% Weatherproof</h6>
                    <small className="text-light opacity-75">German PVC Tents</small>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-clock-history text-gvr-gold fs-4"></i>
                  <div>
                    <h6 className="mb-0 fw-bold text-white">On-Time</h6>
                    <small className="text-light opacity-75">Setup Guarantee</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Instant Event Estimator Card */}
          <div className="col-lg-5">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden bg-white text-dark">
              <div className="card-header bg-gvr-primary text-white p-4 border-bottom border-warning">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-1 fw-bold text-white font-serif">Quick Rental Estimate</h5>
                    <small className="text-gvr-gold">Get instant quotation & availability</small>
                  </div>
                  <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold">
                    Fast Booking
                  </span>
                </div>
              </div>
              <div className="card-body p-4">
                <form onSubmit={handleQuickSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small text-muted">Select Event Type</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light"><i className="bi bi-balloon-heart text-danger"></i></span>
                      <select
                        className="form-select"
                        value={quickForm.eventType}
                        onChange={(e) => setQuickForm({ ...quickForm, eventType: e.target.value })}
                      >
                        <option value="Wedding Ceremony">Grand Wedding & Kalyanam</option>
                        <option value="Reception / Sangeet">Reception & Sangeet Night</option>
                        <option value="Birthday Party">Birthday Party & Celebration</option>
                        <option value="Traditional Puja / Housewarming">Puja / Gruhapravesam</option>
                        <option value="Corporate Event">Corporate Conference / Seminar</option>
                        <option value="Cultural / Festival">Cultural / Public Gathering</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold small text-muted">Target Event Date</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light"><i className="bi bi-calendar-event text-primary"></i></span>
                      <input
                        type="date"
                        className="form-control"
                        value={quickForm.date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setQuickForm({ ...quickForm, date: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold small text-muted">Estimated Guest Count</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light"><i className="bi bi-people text-success"></i></span>
                      <select
                        className="form-select"
                        value={quickForm.guests}
                        onChange={(e) => setQuickForm({ ...quickForm, guests: e.target.value })}
                      >
                        <option value="50-100">Small Gathering (50 - 100 Guests)</option>
                        <option value="150-300">Medium Event (150 - 300 Guests)</option>
                        <option value="300-600">Grand Event (300 - 600 Guests)</option>
                        <option value="600-1500">Mega Gathering (600 - 1,500+ Guests)</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-gvr-gold w-100 py-3 fw-bold rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2">
                    <span>Calculate Rates & Reserve Setup</span>
                    <i className="bi bi-arrow-right"></i>
                  </button>
                </form>

                <div className="mt-3 text-center">
                  <small className="text-muted">
                    <i className="bi bi-headset text-gvr-gold me-1"></i>
                    Need instant custom dimensions? Call <strong>+91 99088 62243 / +91 94924 61603</strong>
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
