import React from 'react';
import { useNavigate } from 'react-router-dom';

const PackageCard = ({ pkg }) => {
  const navigate = useNavigate();

  const handleBookPackage = () => {
    navigate(`/book-now?packageId=${pkg.id}`);
  };

  return (
    <div className={`card h-100 gvr-card border-0 shadow-sm ${pkg.popular ? 'border border-2 border-warning' : ''}`}>
      {pkg.popular && (
        <div className="bg-warning text-dark text-center fw-bold py-1 text-uppercase small" style={{ letterSpacing: '1px' }}>
          <i className="bi bi-star-fill me-1"></i> Most Popular Package
        </div>
      )}

      <div className="position-relative" style={{ height: '200px' }}>
        <img
          src={pkg.image}
          alt={pkg.title}
          className="w-100 h-100 object-fit-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="position-absolute bottom-0 start-0 w-100 p-3 bg-gradient bg-dark bg-opacity-75 text-white">
          <span className="badge bg-gvr-gold text-dark fw-bold mb-1">{pkg.bestFor}</span>
          <h5 className="fw-bold font-serif mb-0 text-white">{pkg.title}</h5>
        </div>
      </div>

      <div className="card-body p-4 d-flex flex-column">
        <p className="text-muted small mb-3">{pkg.subtitle}</p>

        <div className="bg-light p-3 rounded-3 mb-3 border">
          <small className="text-muted text-uppercase fw-semibold d-block">Package Starting At</small>
          <div className="fs-3 fw-bold text-gvr-gold font-serif">
            ₹{pkg.price.toLocaleString('en-IN')}
            <span className="text-muted fs-6 fw-normal"> / day setup</span>
          </div>
        </div>

        <h6 className="fw-bold text-dark small text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>
          What's Included:
        </h6>
        <ul className="list-unstyled mb-4 flex-grow-1">
          {pkg.features?.map((feat, idx) => (
            <li key={idx} className="small text-muted mb-2 d-flex align-items-start gap-2">
              <i className="bi bi-check2-circle text-success fs-6 mt-0"></i>
              <span>{feat}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={handleBookPackage}
          className={`btn w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2 ${
            pkg.popular ? 'btn-gvr-gold' : 'btn-outline-primary'
          }`}
        >
          <i className="bi bi-calendar2-plus"></i>
          <span>Choose & Customize</span>
        </button>
      </div>
    </div>
  );
};

export default PackageCard;
