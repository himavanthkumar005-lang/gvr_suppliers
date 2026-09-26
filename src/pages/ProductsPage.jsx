import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { dbService } from '../services/dbService';

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const load = async () => {
      setProducts(await dbService.getProducts());
      const categoryParam = searchParams.get('category');
      if (categoryParam) setSelectedCategory(categoryParam);
    };
    load();
  }, [searchParams]);

  const categories = [
    'All',
    'Tents & Shamianas',
    'Chairs & Tables',
    'Stages & Mandapams',
    'Lighting & Decor',
    'Sound & Audio',
    'Catering Utensils',
    'Power & Cooling'
  ];

  // Filtering & Sorting
  let filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (sortBy === 'price-asc') {
    filteredProducts.sort((a, b) => a.pricePerDay - b.pricePerDay);
  } else if (sortBy === 'price-desc') {
    filteredProducts.sort((a, b) => b.pricePerDay - a.pricePerDay);
  }

  return (
    <div>
      {/* Banner */}
      <div className="bg-gvr-primary py-5 text-white">
        <div className="container py-3 text-center">
          <span className="badge badge-gold px-3 py-2 text-uppercase mb-2">Inventory & Rental Catalog</span>
          <h1 className="display-5 fw-bold font-serif mb-2">Products & Equipment Rentals</h1>
          <p className="lead text-light opacity-75 mx-auto" style={{ maxWidth: '650px' }}>
            Choose from over 1,200 commercial event equipment items available for daily and multi-day rentals.
          </p>
        </div>
      </div>

      <div className="container py-5">
        {/* Filters and Search Bar */}
        <div className="card border-0 shadow-sm rounded-4 p-4 mb-5 bg-white">
          <div className="row g-3 align-items-center mb-3">
            {/* Search */}
            <div className="col-md-7">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0 bg-light"
                  placeholder="Search tents, chairs, sound systems, lights, generators..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button className="btn btn-light" type="button" onClick={() => setSearchTerm('')}>
                    <i className="bi bi-x"></i>
                  </button>
                )}
              </div>
            </div>

            {/* Sort */}
            <div className="col-md-5">
              <div className="d-flex align-items-center justify-content-md-end gap-2">
                <label className="small text-muted fw-semibold flex-shrink-0">Sort By:</label>
                <select
                  className="form-select form-select-sm w-auto"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="default">Featured / Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Pills */}
          <div className="d-flex flex-wrap gap-2 pt-2 border-top">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <p className="text-muted small mb-0">
            Showing <strong>{filteredProducts.length}</strong> items in <strong>{selectedCategory}</strong>
          </p>
          {selectedCategory !== 'All' && (
            <button
              className="btn btn-sm btn-link text-decoration-none text-danger"
              onClick={() => setSelectedCategory('All')}
            >
              Reset Category
            </button>
          )}
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="row g-4">
            {filteredProducts.map((product) => (
              <div className="col-md-6 col-lg-4" key={product.id}>
                <ProductCard product={product} onSelect={(p) => setSelectedProduct(p)} />
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center p-5 border-0 shadow-sm rounded-4 my-4">
            <i className="bi bi-inbox text-muted fs-1 mb-2"></i>
            <h5 className="fw-bold">No rental items matched your criteria</h5>
            <p className="text-muted small mb-3">Try clearing filters or search terms.</p>
            <button
              className="btn btn-outline-dark btn-sm mx-auto"
              onClick={() => {
                setSelectedCategory('All');
                setSearchTerm('');
              }}
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-gvr-primary text-white py-3">
                <h5 className="modal-title font-serif">{selectedProduct.name}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedProduct(null)}></button>
              </div>
              <div className="modal-body p-4">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-100 rounded-3 mb-3 object-fit-cover shadow-sm"
                  style={{ height: '260px' }}
                />
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="badge bg-gvr-primary px-3 py-2">{selectedProduct.category}</span>
                  <span className={`badge ${selectedProduct.stock > 0 ? 'bg-success' : 'bg-danger'} px-3 py-2`}>
                    {selectedProduct.stock > 0 ? `${selectedProduct.stock} Available in Warehouse` : 'Out of Stock'}
                  </span>
                </div>
                <h6 className="fw-bold text-dark small text-uppercase">Description & Specs:</h6>
                <p className="text-muted small mb-4">{selectedProduct.description}</p>
                <div className="bg-light p-3 rounded-3 mb-4 d-flex justify-content-between align-items-center border">
                  <div>
                    <span className="text-muted small d-block">Rental Rate:</span>
                    <strong className="fs-4 text-gvr-gold font-serif">₹{selectedProduct.pricePerDay.toLocaleString('en-IN')}</strong>
                    <span className="text-muted small"> / day</span>
                  </div>
                  <div className="small text-muted text-end">
                    <span>Cleanliness & Setup Guarantee</span>
                  </div>
                </div>
                <button
                  className="btn btn-gvr-gold w-100 py-2 fw-bold"
                  onClick={() => {
                    setSelectedProduct(null);
                    navigate(`/book-now?productId=${selectedProduct.id}`);
                  }}
                >
                  <i className="bi bi-calendar2-check-fill me-2"></i> Book This Item Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
