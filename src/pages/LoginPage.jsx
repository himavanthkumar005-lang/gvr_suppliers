import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [activeTab, setActiveTab] = useState('user'); // 'user' or 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const loggedIn = await login(email, password, activeTab === 'admin' ? 'admin' : null);
      if (loggedIn?.role === 'admin') {
        navigate('/admin');
      } else {
        const from = location.state?.from?.pathname || '/my-bookings';
        navigate(from);
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5 bg-light min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-5">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden bg-white">
              {/* Card Header */}
              <div className="bg-gvr-primary p-4 text-center text-white">
                <div className="bg-gvr-gold text-dark rounded-circle p-3 d-inline-flex align-items-center justify-content-center mb-2" style={{ width: '60px', height: '60px' }}>
                  <i className="bi bi-person-lock fs-2"></i>
                </div>
                <h4 className="fw-bold font-serif mb-1 text-white">Sign In to GVR Suppliers</h4>
                <p className="small text-light opacity-75 mb-0">Select your account type to continue</p>
              </div>

              {/* Role Tabs */}
              <div className="d-flex border-bottom bg-light">
                <button
                  type="button"
                  className={`btn flex-grow-1 py-3 fw-bold rounded-0 text-uppercase small ${
                    activeTab === 'user' ? 'bg-white text-primary border-bottom border-primary border-3' : 'text-muted'
                  }`}
                  onClick={() => {
                    setActiveTab('user');
                    setEmail('');
                    setPassword('');
                    setErrorMsg('');
                  }}
                >
                  <i className="bi bi-person-fill me-1"></i> Customer Login
                </button>
                <button
                  type="button"
                  className={`btn flex-grow-1 py-3 fw-bold rounded-0 text-uppercase small ${
                    activeTab === 'admin' ? 'bg-white text-danger border-bottom border-danger border-3' : 'text-muted'
                  }`}
                  onClick={() => {
                    setActiveTab('admin');
                    setEmail('');
                    setPassword('');
                    setErrorMsg('');
                  }}
                >
                  <i className="bi bi-shield-lock-fill me-1"></i> Admin Portal
                </button>
              </div>

              {/* Form Content */}
              <div className="card-body p-4 p-md-5">
                {errorMsg && (
                  <div className="alert alert-danger py-2 small mb-4 d-flex align-items-center gap-2">
                    <i className="bi bi-exclamation-octagon-fill fs-5"></i>
                    <div>{errorMsg}</div>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">Email Address</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light"><i className="bi bi-envelope"></i></span>
                      <input
                        type="email"
                        className="form-control"
                        placeholder={activeTab === 'admin' ? 'admin@example.com' : 'you@example.com'}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-semibold text-muted">Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light"><i className="bi bi-key"></i></span>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className={`btn w-100 py-3 fw-bold rounded-3 shadow-sm mb-3 ${
                      activeTab === 'admin' ? 'btn-danger' : 'btn-gvr-gold'
                    }`}
                    disabled={loading}
                  >
                    {activeTab === 'admin' ? (
                      <span><i className="bi bi-shield-check me-2"></i> Sign In to Admin Dashboard</span>
                    ) : (
                      <span><i className="bi bi-box-arrow-in-right me-2"></i> Sign In to Account</span>
                    )}
                  </button>
                </form>

                <div className="text-center small text-muted">
                  Don't have an account yet?{' '}
                  <Link to="/register" className="fw-bold text-primary text-decoration-none">
                    Register here
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

export default LoginPage;
