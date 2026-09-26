import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, onSelect }) => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate(`/book-now?productId=${product.id}`);
  };

  return (
    <div className="card h-100 gvr-card border-0 shadow-sm">
      <div className="position-relative overflow-hidden" style={{ height: '220px' }}>
        <img
          src={product.image}
          alt={product.name}
          className="w-100 h-100 object-fit-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <span className="position-absolute top-0 start-0 m-3 badge bg-gvr-primary text-light px-3 py-1 shadow-sm">
          {product.category}
        </span>
        {product.stock > 0 ? (
          <span className="position-absolute top-0 end-0 m-3 badge bg-success text-white px-2 py-1 shadow-sm">
            <i className="bi bi-check-circle-fill me-1"></i> In Stock ({product.stock})
          </span>
        ) : (
          <span className="position-absolute top-0 end-0 m-3 badge bg-danger text-white px-2 py-1 shadow-sm">
            Reserved
          </span>
        )}
      </div>

      <div className="card-body d-flex flex-column p-4">
        <h5 className="card-title fw-bold text-dark font-serif mb-2" style={{ minHeight: '48px' }}>
          {product.name}
        </h5>
        <p className="card-text text-muted small flex-grow-1 mb-3" style={{ minHeight: '60px' }}>
          {product.description}
        </p>

        <div className="d-flex align-items-baseline justify-content-between pt-3 border-top mb-3">
          <div>
            <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>Daily Rental</small>
            <div className="fs-4 fw-bold text-gvr-gold font-serif">
              ₹{product.pricePerDay.toLocaleString('en-IN')}
              <span className="text-muted fw-normal fs-6"> / day</span>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={() => onSelect && onSelect(product)}
            title="View Specifications"
          >
            <i className="bi bi-eye me-1"></i> Details
          </button>
        </div>

        <button
          className="btn btn-gvr-gold w-100 fw-bold d-flex align-items-center justify-content-center gap-2"
          onClick={handleBookNow}
        >
          <i className="bi bi-cart-plus-fill"></i>
          <span>Book This Equipment</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
