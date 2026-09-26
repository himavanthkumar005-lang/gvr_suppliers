import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gvr-primary-dark text-white pt-5 pb-3 border-top border-secondary">
      <div className="container">
        <div className="row g-4 mb-4">
          {/* Company Info */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="bg-gvr-gold text-dark rounded-3 p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                <i className="bi bi-shop fs-4"></i>
              </div>
              <div>
                <h5 className="fw-bold font-serif mb-0 text-white">GVR SUPPLIERS</h5>
                <span className="text-gvr-gold text-uppercase" style={{ fontSize: '0.72rem', letterSpacing: '1px' }}>
                  Tent House & Event Rentals
                </span>
              </div>
            </div>
            <p className="text-light opacity-75 small">
              Trusted since 2012 for complete event infrastructure. We deliver premium German waterproof tents, elegant floral wedding mandapams, VIP furniture, high-wattage sound & lighting, and complete catering utensils for unforgettable events.
            </p>
            <div className="d-flex gap-2 mt-3">
              <a href="#facebook" className="btn btn-sm btn-outline-secondary text-white rounded-circle"><i className="bi bi-facebook"></i></a>
              <a href="#instagram" className="btn btn-sm btn-outline-secondary text-white rounded-circle"><i className="bi bi-instagram"></i></a>
              <a href="#youtube" className="btn btn-sm btn-outline-secondary text-white rounded-circle"><i className="bi bi-youtube"></i></a>
              <a href="https://wa.me/919908862243" target="_blank" rel="noreferrer" className="btn btn-sm btn-success rounded-circle"><i className="bi bi-whatsapp"></i></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h6 className="text-gvr-gold fw-bold text-uppercase mb-3" style={{ letterSpacing: '0.5px' }}>Quick Links</h6>
            <ul className="list-unstyled small mb-0 d-flex flex-column gap-2">
              <li><Link to="/" className="text-light opacity-75 text-decoration-none hover-link">Home</Link></li>
              <li><Link to="/about" className="text-light opacity-75 text-decoration-none hover-link">About Us</Link></li>
              <li><Link to="/services" className="text-light opacity-75 text-decoration-none hover-link">Our Services</Link></li>
              <li><Link to="/products" className="text-light opacity-75 text-decoration-none hover-link">Products & Rentals</Link></li>
              <li><Link to="/packages" className="text-light opacity-75 text-decoration-none hover-link">Event Packages</Link></li>
              <li><Link to="/book-now" className="text-light opacity-75 text-decoration-none hover-link text-warning fw-semibold">Book Now</Link></li>
            </ul>
          </div>

          {/* Rental Services */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-gvr-gold fw-bold text-uppercase mb-3" style={{ letterSpacing: '0.5px' }}>Rental Categories</h6>
            <ul className="list-unstyled small mb-0 d-flex flex-column gap-2">
              <li className="text-light opacity-75"><i className="bi bi-chevron-right text-gvr-gold me-1"></i> Waterproof German Hangars</li>
              <li className="text-light opacity-75"><i className="bi bi-chevron-right text-gvr-gold me-1"></i> Wedding Mandapams & Stages</li>
              <li className="text-light opacity-75"><i className="bi bi-chevron-right text-gvr-gold me-1"></i> Banquet Chairs & VIP Sofas</li>
              <li className="text-light opacity-75"><i className="bi bi-chevron-right text-gvr-gold me-1"></i> JBL Sound Systems & DJ Setups</li>
              <li className="text-light opacity-75"><i className="bi bi-chevron-right text-gvr-gold me-1"></i> Stage Lights & Par Wash Cans</li>
              <li className="text-light opacity-75"><i className="bi bi-chevron-right text-gvr-gold me-1"></i> Silent Power Generators (15-125 KVA)</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-gvr-gold fw-bold text-uppercase mb-3" style={{ letterSpacing: '0.5px' }}>Head Office</h6>
            <p className="text-light opacity-75 small mb-2 d-flex gap-2">
              <i className="bi bi-geo-alt-fill text-gvr-gold fs-5 flex-shrink-0"></i>
              <span>Reddy Palem, Nuthalapadu, Parchur Mandal, Prakasam District, Andhra Pradesh</span>
            </p>
            <p className="text-light opacity-75 small mb-2 d-flex gap-2">
              <i className="bi bi-telephone-fill text-gvr-gold flex-shrink-0"></i>
              <span>+91 99088 62243 / +91 94924 61603</span>
            </p>
            <p className="text-light opacity-75 small mb-2 d-flex gap-2">
              <i className="bi bi-envelope-fill text-gvr-gold flex-shrink-0"></i>
              <span>hani.harini004@gmail.com</span>
            </p>
            <p className="text-light opacity-75 small mb-0 d-flex gap-2">
              <i className="bi bi-clock-fill text-gvr-gold flex-shrink-0"></i>
              <span>Mon - Sun: 7:00 AM - 10:00 PM (Emergency Dispatch 24/7)</span>
            </p>
          </div>
        </div>

        <hr className="border-secondary opacity-50 my-4" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center small text-light opacity-75">
          <div>
            © {new Date().getFullYear()} <strong className="text-white">GVR Suppliers</strong>. All Rights Reserved. Complete Tent House & Event Management Solutions.
          </div>
          <div className="d-flex gap-3 mt-2 mt-md-0">
            <Link to="/about" className="text-light opacity-75 text-decoration-none">Privacy Policy</Link>
            <span>•</span>
            <Link to="/contact" className="text-light opacity-75 text-decoration-none">Terms of Rental</Link>
            <span>•</span>
            <Link to="/admin" className="text-warning text-decoration-none">Staff Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
