import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    role: 'user', // 'user' or 'admin'
    adminSecretKey: ''
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    if (formData.role === 'admin' && formData.adminSecretKey !== 'GVR2026') {
      setErrorMsg('Invalid Admin Security Key. (Hint for demo: use "GVR2026")');
      return;
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        role: formData.role
      });

      setSuccessMsg(`Account created successfully as ${formData.role.toUpperCase()}! Redirecting...`);
      setTimeout(() => {
        if (formData.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/my-bookings');
        }
      }, 1000);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="py-5 bg-light min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-9 col-lg-6">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden bg-white">
              <div className="bg-gvr-primary p-4 text-center text-white">
                <div className="bg-gvr-gold text-dark rounded-circle p-3 d-inline-flex align-items-center justify-content-center mb-2" style={{ width: '60px', height: '60px' }}>
                  <i className="bi bi-person-plus fs-2"></i>
                </div>
                <h4 className="fw-bold font-serif mb-1 text-white">Create New Account</h4>
                <p className="small text-light opacity-75 mb-0">Join GVR Suppliers for seamless event equipment rental</p>
              </div>

              <div className="card-body p-4 p-md-5">
                {errorMsg && (
                  <div className="alert alert-danger py-2 small mb-3">
                    <i className="bi bi-exclamation-octagon me-1"></i> {errorMsg}
                  </div>
                )}
                {successMsg && (
                  <div className="alert alert-success py-2 small mb-3">
                    <i className="bi bi-check-circle me-1"></i> {successMsg}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Account Type Selection */}
                  <div className="mb-4">
                    <label className="form-label small fw-semibold text-muted d-block">Select Account Role</label>
                    <div className="row g-2">
                      <div className="col-6">
                        <div
                          className={`p-3 rounded-3 border text-center cursor-pointer ${
                            formData.role === 'user' ? 'border-primary bg-light fw-bold text-primary' : 'text-muted'
                          }`}
                          style={{ cursor: 'pointer' }}
                          onClick={() => setFormData({ ...formData, role: 'user' })}
                        >
                          <i className="bi bi-person-fill fs-4 d-block mb-1"></i>
                          <span>Customer / Organizer</span>
                        </div>
                      </div>
                      <div className="col-6">
                        <div
                          className={`p-3 rounded-3 border text-center cursor-pointer ${
                            formData.role === 'admin' ? 'border-danger bg-light fw-bold text-danger' : 'text-muted'
                          }`}
                          style={{ cursor: 'pointer' }}
                          onClick={() => setFormData({ ...formData, role: 'admin' })}
                        >
                          <i className="bi bi-shield-lock-fill fs-4 d-block mb-1"></i>
                          <span>Staff / Admin</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {formData.role === 'admin' && (
                    <div className="mb-3 p-3 bg-light rounded-3 border border-danger border-opacity-50">
                      <label className="form-label small fw-bold text-danger">Admin Security Authorization Key *</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Enter key (Use GVR2026)"
                        value={formData.adminSecretKey}
                        onChange={(e) => setFormData({ ...formData, adminSecretKey: e.target.value })}
                        required
                      />
                      <small className="text-muted" style={{ fontSize: '0.72rem' }}>
                        Security passkey required to register staff accounts. Demo key: <strong>GVR2026</strong>
                      </small>
                    </div>
                  )}

                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small fw-semibold text-muted">Full Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-muted">Email Address *</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-muted">Phone Number *</label>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="Your phone number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold text-muted">Primary Address / City</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Plot 45, Ring Road, Guntur"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-muted">Password (min 6 chars) *</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-muted">Confirm Password *</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className={`btn w-100 py-3 fw-bold rounded-3 shadow-sm mt-4 ${
                      formData.role === 'admin' ? 'btn-danger' : 'btn-gvr-gold'
                    }`}
                  >
                    <i className="bi bi-person-check-fill me-2"></i> Register Account
                  </button>
                </form>

                <div className="text-center small text-muted mt-4">
                  Already have an account?{' '}
                  <Link to="/login" className="fw-bold text-primary text-decoration-none">
                    Log in here
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
