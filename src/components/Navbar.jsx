import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { currentUser, isAuthenticated, isAdmin, logout } = useAuth();
  const { theme, toggleTheme, isDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-xl navbar-dark bg-gvr-primary sticky-top shadow-sm py-2">
      <div className="container-fluid px-lg-4">
        {/* Brand Logo & Subtitle */}
        <Link className="navbar-brand d-flex align-items-center gap-2 text-decoration-none" to="/">
          <div
            className="bg-gvr-gold text-dark rounded-3 d-flex align-items-center justify-content-center shadow-sm"
            style={{ width: '38px', height: '38px' }}
          >
            <i className="bi bi-shop fs-5"></i>
          </div>
          <div className="d-flex flex-column">
            <span className="fw-bold fs-5 tracking-wide text-white font-serif lh-1">GVR SUPPLIERS</span>
            <small className="text-gvr-gold fw-semibold" style={{ fontSize: '0.68rem', letterSpacing: '0.6px' }}>
              Tent House & Event Rentals
            </small>
          </div>
        </Link>

        {/* Right Action Icons for Mobile (Theme Toggle + Hamburger) */}
        <div className="d-flex align-items-center gap-2 d-xl-none">
          <button
            type="button"
            className="theme-toggle-btn py-1 px-2"
            onClick={toggleTheme}
            title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Theme"
          >
            <i className={`bi ${isDarkMode ? 'bi-sun-fill text-warning' : 'bi-moon-stars-fill text-info'}`}></i>
          </button>

          <button
            className="navbar-toggler border-secondary p-1"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#gvrNavbar"
            aria-controls="gvrNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>

        {/* Main Navigation Links */}
        <div className="collapse navbar-collapse" id="gvrNavbar">
          <ul className="navbar-nav mx-auto mb-2 mb-xl-0 align-items-center">
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/about">
                About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/services">
                Services
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/products">
                Products/Rentals
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/packages">
                Packages
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/book-now">
                Book Now
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/my-bookings">
                My Bookings
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/contact">
                Contact
              </NavLink>
            </li>
          </ul>

          {/* Right Action Controls */}
          <div className="d-flex align-items-center gap-2 mt-3 mt-xl-0 justify-content-center">
            {/* Desktop Theme Toggle */}
            <button
              type="button"
              className="theme-toggle-btn d-none d-xl-flex me-1"
              onClick={toggleTheme}
              title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`}
            >
              <i className={`bi ${isDarkMode ? 'bi-sun-fill text-warning' : 'bi-moon-stars-fill text-info'}`}></i>
              <span>{isDarkMode ? 'Light' : 'Dark'}</span>
            </button>

            {/* Admin Shortcut */}
            {isAdmin && (
              <Link to="/admin" className="btn btn-sm btn-outline-warning d-flex align-items-center gap-1">
                <i className="bi bi-shield-lock-fill"></i>
                <span>Admin Panel</span>
              </Link>
            )}

            {/* Auth Dropdown or Login Buttons */}
            {isAuthenticated ? (
              <div className="dropdown">
                <button
                  className="btn btn-sm btn-outline-light dropdown-toggle d-flex align-items-center gap-2 py-1 px-3 rounded-pill"
                  type="button"
                  id="userMenuBtn"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle fs-6 text-gvr-gold"></i>
                  <span className="fw-semibold text-truncate" style={{ maxWidth: '120px' }}>
                    {currentUser?.name || 'Account'}
                  </span>
                  <span className={`badge ${isAdmin ? 'bg-danger' : 'bg-success'} rounded-pill`} style={{ fontSize: '0.65rem' }}>
                    {currentUser?.role?.toUpperCase()}
                  </span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2" aria-labelledby="userMenuBtn">
                  <li className="dropdown-header">
                    <small className="text-muted">Signed in as</small>
                    <div className="fw-bold text-dark">{currentUser?.email}</div>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  {isAdmin ? (
                    <li>
                      <Link className="dropdown-item d-flex align-items-center gap-2" to="/admin">
                        <i className="bi bi-speedometer2 text-danger"></i> Admin Dashboard
                      </Link>
                    </li>
                  ) : (
                    <li>
                      <Link className="dropdown-item d-flex align-items-center gap-2" to="/my-bookings">
                        <i className="bi bi-receipt text-primary"></i> My Bookings
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link className="dropdown-item d-flex align-items-center gap-2" to="/book-now">
                      <i className="bi bi-plus-circle text-success"></i> New Reservation
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger d-flex align-items-center gap-2" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right"></i> Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-sm btn-outline-light px-3 py-1 fw-semibold">
                  Login
                </Link>
                <Link to="/register" className="btn btn-sm btn-gvr-gold px-3 py-1 fw-semibold">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
