import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import ProductCard from '../components/ProductCard';
import PackageCard from '../components/PackageCard';
import { dbService } from '../services/dbService';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [popularPackages, setPopularPackages] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const products = await dbService.getProducts();
      setFeaturedProducts(products.filter(p => p.featured).slice(0, 6));
      const packages = await dbService.getPackages();
      setPopularPackages(packages.slice(0, 3));
      const srvs = await dbService.getServices();
      setServices(srvs.slice(0, 4));
    };
    loadData();
  }, []);

  return (
    <div>
      <HeroSection />

      {/* Stats Bar */}
      <section className="bg-gvr-primary-dark py-4 text-white border-top border-warning border-opacity-25">
        <div className="container">
          <div className="row text-center g-4">
            <div className="col-6 col-md-3">
              <h3 className="fw-bold text-gvr-gold mb-1 font-serif">15+</h3>
              <p className="small text-light opacity-75 mb-0">Years of Event Excellence</p>
            </div>
            <div className="col-6 col-md-3">
              <h3 className="fw-bold text-gvr-gold mb-1 font-serif">4,500+</h3>
              <p className="small text-light opacity-75 mb-0">Events & Weddings Powered</p>
            </div>
            <div className="col-6 col-md-3">
              <h3 className="fw-bold text-gvr-gold mb-1 font-serif">1,200+</h3>
              <p className="small text-light opacity-75 mb-0">Rental Equipment Items</p>
            </div>
            <div className="col-6 col-md-3">
              <h3 className="fw-bold text-gvr-gold mb-1 font-serif">100%</h3>
              <p className="small text-light opacity-75 mb-0">Weatherproof & On-Time Guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Highlight */}
      <section className="py-5 bg-white">
        <div className="container py-3">
          <div className="text-center mb-5">
            <span className="badge badge-gold px-3 py-2 text-uppercase mb-2">What We Provide</span>
            <h2 className="display-6 fw-bold font-serif text-dark section-title">Complete Event Infrastructure</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '650px' }}>
              Everything you need for breathtaking celebrations, from grand open grounds to intimate family backyards.
            </p>
          </div>
          <div className="row g-4">
            {services.map((srv) => (
              <div className="col-md-6 col-lg-3" key={srv.id}>
                <div className="card h-100 p-4 border-0 shadow-sm gvr-card">
                  <div className="bg-gvr-gold-soft text-gvr-gold rounded-4 p-3 d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                    <i className={`bi ${srv.icon} fs-3`}></i>
                  </div>
                  <h5 className="fw-bold font-serif text-dark mb-2">{srv.title}</h5>
                  <p className="small text-muted flex-grow-1 mb-3">{srv.shortDesc}</p>
                  <Link to="/services" className="text-gvr-gold text-decoration-none fw-semibold small d-flex align-items-center gap-1">
                    <span>Learn more</span><i className="bi bi-arrow-right"></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-5">
            <Link to="/services" className="btn btn-outline-dark px-4 py-2 fw-semibold">
              Explore All 6 Services <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Rentals */}
      <section className="py-5 bg-light">
        <div className="container py-3">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5">
            <div>
              <span className="badge bg-gvr-primary text-light px-3 py-2 text-uppercase mb-2">Popular Equipment</span>
              <h2 className="display-6 fw-bold font-serif text-dark mb-0">Featured Rental Catalog</h2>
            </div>
            <Link to="/products" className="btn btn-gvr-gold px-4 mt-3 mt-md-0 fw-semibold">
              View Full Inventory <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>
          <div className="row g-4">
            {featuredProducts.map((product) => (
              <div className="col-md-6 col-lg-4" key={product.id}>
                <ProductCard product={product} onSelect={(p) => setSelectedProduct(p)} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-5 bg-white">
        <div className="container py-3">
          <div className="text-center mb-5">
            <span className="badge badge-gold px-3 py-2 text-uppercase mb-2">Save Time & Budget</span>
            <h2 className="display-6 fw-bold font-serif text-dark section-title">Curated Event Packages</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '650px' }}>
              Handpicked bundles including tents, stages, VIP seating, sound, lighting, and power backup at discounted rates.
            </p>
          </div>
          <div className="row g-4">
            {popularPackages.map((pkg) => (
              <div className="col-md-6 col-lg-4" key={pkg.id}>
                <PackageCard pkg={pkg} />
              </div>
            ))}
          </div>
          <div className="text-center mt-5">
            <Link to="/packages" className="btn btn-outline-gvr-gold px-4 py-2">
              Browse All Event Packages <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-5 bg-gvr-primary text-white">
        <div className="container py-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="badge bg-warning text-dark px-3 py-2 text-uppercase mb-3 fw-bold">The GVR Advantage</span>
              <h2 className="display-6 fw-bold font-serif text-white mb-4">Why Families & Corporates Trust GVR Suppliers</h2>
              {[
                { icon: 'bi-shield-check', title: '100% German Waterproof Technology', desc: 'Our heavy PVC hangars withstand monsoons, high winds, and extreme heat.' },
                { icon: 'bi-sparkles', title: 'Pristine Hygiene & Spotless Fabrics', desc: 'Every chair cover and catering vessel is steam-cleaned and inspected before dispatch.' },
                { icon: 'bi-clock-history', title: 'Guaranteed Punctual Setup', desc: 'We assemble 6–12 hours before your auspicious event time, giving you peace of mind.' }
              ].map((item, i) => (
                <div className="d-flex gap-3 mb-4" key={i}>
                  <div className="bg-gvr-gold text-dark rounded-circle p-2 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '42px', height: '42px' }}>
                    <i className={`bi ${item.icon} fs-5`}></i>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1 text-white">{item.title}</h5>
                    <p className="text-light opacity-75 small mb-0">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="col-lg-6">
              <div className="row g-3">
                <div className="col-6">
                  <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80" alt="Wedding" className="img-fluid rounded-4 shadow mb-3" />
                  <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80" alt="Lights" className="img-fluid rounded-4 shadow" />
                </div>
                <div className="col-6 pt-4">
                  <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80" alt="Canopy" className="img-fluid rounded-4 shadow mb-3" />
                  <div className="p-4 bg-gvr-gold text-dark rounded-4 text-center shadow">
                    <h4 className="fw-bold font-serif mb-1">Direct Helpline</h4>
                    <p className="small mb-2 fw-semibold">Have urgent questions?</p>
                    <a href="tel:+919908862243" className="btn btn-dark btn-sm fw-bold px-3">
                      <i className="bi bi-telephone me-1"></i> Call Now
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-5 bg-light">
        <div className="container py-3">
          <div className="text-center mb-5">
            <span className="badge bg-secondary text-light px-3 py-2 text-uppercase mb-2">Customer Feedback</span>
            <h2 className="display-6 fw-bold font-serif text-dark section-title">Real Words from Happy Clients</h2>
          </div>
          <div className="row g-4">
            {[
              { name: 'Venkat Rao', sub: 'Wedding Client, Vijayawada', init: 'V', color: 'primary', text: '"GVR Suppliers set up a 60x40 German hangar for my daughter\'s wedding. It rained suddenly but not a single drop penetrated! Exceptional quality and professional staff."' },
              { name: 'Pooja & Karthik', sub: 'Reception & Sangeet', init: 'P', color: 'danger', text: '"The JBL sound setup and stage lights for our sangeet night were on another level. The crowd loved the energy, and the Maharaja sofa was truly regal."' },
              { name: 'Satish Varma', sub: 'IT Summit Organiser', init: 'S', color: 'success', text: '"We organised a 2-day tech convention with 500 attendees. GVR provided the entire AC tent, chairs, and backup generator without any hitch."' }
            ].map((t, i) => (
              <div className="col-md-4" key={i}>
                <div className="card h-100 p-4 border-0 shadow-sm rounded-4">
                  <div className="text-warning mb-3">
                    {[...Array(5)].map((_, s) => <i key={s} className="bi bi-star-fill"></i>)}
                  </div>
                  <p className="text-muted small mb-4">{t.text}</p>
                  <div className="d-flex align-items-center gap-3 mt-auto">
                    <div className={`bg-${t.color} text-white rounded-circle d-flex align-items-center justify-content-center fw-bold`} style={{ width: '40px', height: '40px' }}>{t.init}</div>
                    <div>
                      <h6 className="mb-0 fw-bold">{t.name}</h6>
                      <small className="text-muted">{t.sub}</small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-5 bg-gvr-gold text-dark">
        <div className="container text-center py-3">
          <h2 className="display-6 fw-bold font-serif mb-3">Planning an Upcoming Event?</h2>
          <p className="lead mb-4 fw-medium">Lock your dates now to secure premium tents, VIP seating, and audio setups.</p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/book-now" className="btn btn-dark btn-lg px-4 py-2 fw-bold shadow">
              <i className="bi bi-calendar2-check me-2"></i> Book Online Now
            </Link>
            <Link to="/contact" className="btn btn-outline-dark btn-lg px-4 py-2 fw-bold">
              <i className="bi bi-chat-dots me-2"></i> Request Custom Quote
            </Link>
          </div>
        </div>
      </section>

      {/* Product Quick View Modal */}
      {selectedProduct && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-gvr-primary text-white">
                <h5 className="modal-title font-serif">{selectedProduct.name}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedProduct(null)}></button>
              </div>
              <div className="modal-body p-4">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-100 rounded-3 mb-3 object-fit-cover shadow-sm" style={{ height: '240px' }} />
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="badge bg-gvr-primary">{selectedProduct.category}</span>
                  <span className="badge bg-success">In Stock: {selectedProduct.stock} units</span>
                </div>
                <p className="text-muted">{selectedProduct.description}</p>
                <div className="fs-4 fw-bold text-gvr-gold font-serif mb-3">
                  ₹{selectedProduct.pricePerDay.toLocaleString('en-IN')} <span className="fs-6 text-muted fw-normal">/ day</span>
                </div>
                <Link to={`/book-now?productId=${selectedProduct.id}`} className="btn btn-gvr-gold w-100 py-2 fw-bold" onClick={() => setSelectedProduct(null)}>
                  Proceed to Book This Item
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
