import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ProductsPage from './pages/ProductsPage';
import PackagesPage from './pages/PackagesPage';
import BookNowPage from './pages/BookNowPage';
import MyBookingsPage from './pages/MyBookingsPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <ScrollToTop />
      <Navbar />

      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/packages" element={<PackagesPage />} />
          <Route path="/book-now" element={<BookNowPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      {/* Floating WhatsApp Quick Action */}
      <a
        href="https://wa.me/919908862243?text=Hello%20GVR%20Suppliers,%20I%20need%20details%20about%20event%20equipment%20rentals."
        target="_blank"
        rel="noreferrer"
        className="whatsapp-float"
        title="Chat with GVR Event Support"
      >
        <i className="bi bi-whatsapp fs-5"></i>
        <span className="d-none d-sm-inline">WhatsApp Us</span>
      </a>

      <Footer />
    </div>
  );
}

export default App;
