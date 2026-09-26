import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div>
      {/* Header Banner */}
      <div className="bg-gvr-primary py-5 text-white position-relative">
        <div className="container py-4 text-center">
          <span className="badge badge-gold px-3 py-2 text-uppercase mb-2">Our Legacy</span>
          <h1 className="display-5 fw-bold font-serif mb-2">About GVR Suppliers</h1>
          <p className="lead text-light opacity-75 mx-auto" style={{ maxWidth: '650px' }}>
            Transforming weddings, corporate conventions, and cultural festivities into extraordinary memories with world-class event infrastructure since 2012.
          </p>
        </div>
      </div>

      {/* Main Story & Vision */}
      <section className="py-5 bg-white">
        <div className="container py-3">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="badge bg-gvr-gold text-dark px-3 py-1 mb-2 fw-semibold text-uppercase">15+ Years of Trust</span>
              <h2 className="display-6 fw-bold font-serif text-dark mb-3">
                From a Humble Shamiana Shop to South India's Leading Event Supplier
              </h2>
              <p className="text-muted leading-relaxed mb-3">
                Founded with a mission to bring elegance, safety, and reliability to celebrations of all sizes, <strong>GVR Suppliers</strong> has grown into an elite tent house and rental infrastructure powerhouse.
              </p>
              <p className="text-muted leading-relaxed mb-4">
                What began as traditional shamianas and wooden folding chairs has evolved into state-of-the-art aluminum German hangars, grand architectural floral mandapams, VIP velvet seating, concert-grade JBL line arrays, DMX moving head lighting, and silent acoustic diesel generators.
              </p>

              <div className="row g-3">
                <div className="col-sm-6">
                  <div className="p-3 bg-light rounded-3 border-start border-4 border-warning">
                    <h6 className="fw-bold mb-1">Uncompromising Safety</h6>
                    <small className="text-muted">Heavy-duty structural anchors and flame-resistant fabric certifications.</small>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="p-3 bg-light rounded-3 border-start border-4 border-warning">
                    <h6 className="fw-bold mb-1">On-Time Execution</h6>
                    <small className="text-muted">Guaranteed setup completion well ahead of your auspicious muhurtham.</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="position-relative">
                <img
                  src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80"
                  alt="GVR Suppliers Setup"
                  className="img-fluid rounded-4 shadow-lg w-100"
                />
                <div className="position-absolute bottom-0 start-0 m-4 p-3 bg-white rounded-3 shadow-lg border-start border-4 border-success d-flex align-items-center gap-3">
                  <i className="bi bi-award-fill text-warning fs-2"></i>
                  <div>
                    <h6 className="fw-bold mb-0">Certified Equipment</h6>
                    <small className="text-muted">ISO 9001 Safety Standards</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Warehouse & Inventory Scale */}
      <section className="py-5 bg-light">
        <div className="container py-3">
          <div className="text-center mb-5">
            <span className="badge bg-secondary text-light px-3 py-2 text-uppercase mb-2">Our Capabilities</span>
            <h2 className="display-6 fw-bold font-serif text-dark section-title">Infrastructure & Capacity</h2>
          </div>

          <div className="row g-4">
            <div className="col-md-3">
              <div className="card h-100 p-4 border-0 shadow-sm text-center rounded-4">
                <div className="bg-gvr-gold-soft text-gvr-gold rounded-circle mx-auto p-3 mb-3" style={{ width: '64px', height: '64px' }}>
                  <i className="bi bi-buildings fs-3"></i>
                </div>
                <h3 className="fw-bold font-serif text-dark mb-1">85,000+</h3>
                <h6 className="fw-semibold text-secondary">Sq. Ft. Hangar Tents</h6>
                <p className="small text-muted mb-0">Clear-span waterproof aluminum structures capable of hosting 15,000+ people simultaneously.</p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card h-100 p-4 border-0 shadow-sm text-center rounded-4">
                <div className="bg-gvr-gold-soft text-gvr-gold rounded-circle mx-auto p-3 mb-3" style={{ width: '64px', height: '64px' }}>
                  <i className="bi bi-person-workspace fs-3"></i>
                </div>
                <h3 className="fw-bold font-serif text-dark mb-1">10,000+</h3>
                <h6 className="fw-semibold text-secondary">Seating Capacity</h6>
                <p className="small text-muted mb-0">Banquet chairs with stretch covers, Maharaja couple thrones, VIP sofas, and banquet dining tables.</p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card h-100 p-4 border-0 shadow-sm text-center rounded-4">
                <div className="bg-gvr-gold-soft text-gvr-gold rounded-circle mx-auto p-3 mb-3" style={{ width: '64px', height: '64px' }}>
                  <i className="bi bi-truck fs-3"></i>
                </div>
                <h3 className="fw-bold font-serif text-dark mb-1">12</h3>
                <h6 className="fw-semibold text-secondary">Dedicated Transport Trucks</h6>
                <p className="small text-muted mb-0">Swift and reliable logistics dispatch across Andhra Pradesh, Telangana, and neighboring states.</p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card h-100 p-4 border-0 shadow-sm text-center rounded-4">
                <div className="bg-gvr-gold-soft text-gvr-gold rounded-circle mx-auto p-3 mb-3" style={{ width: '64px', height: '64px' }}>
                  <i className="bi bi-people-fill fs-3"></i>
                </div>
                <h3 className="fw-bold font-serif text-dark mb-1">150+</h3>
                <h6 className="fw-semibold text-secondary">Skilled Crew Members</h6>
                <p className="small text-muted mb-0">Master tent riggers, certified sound & light engineers, electricians, and floral artisans.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership & Promise */}
      <section className="py-5 bg-white">
        <div className="container py-3">
          <div className="card bg-gvr-primary-dark text-white rounded-4 border-0 overflow-hidden shadow-lg p-4 p-md-5">
            <div className="row align-items-center g-4">
              <div className="col-lg-8">
                <h3 className="fw-bold font-serif text-gvr-gold mb-3">Our Core Commitment to You</h3>
                <p className="text-light opacity-90 lead mb-3">
                  "At GVR Suppliers, we treat every client's wedding, birthday, or festival as our own family celebration. We ensure zero delays, flawless aesthetics, and prompt response."
                </p>
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-gvr-gold text-dark rounded-circle p-2 fw-bold" style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    GVR
                  </div>
                  <div>
                    <h5 className="mb-0 fw-bold text-white">G. Venkat Rayudu</h5>
                    <small className="text-gvr-gold">Founder & Managing Director, GVR Suppliers</small>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 text-center text-lg-end">
                <Link to="/contact" className="btn btn-gvr-gold btn-lg px-4 py-3 fw-bold">
                  <i className="bi bi-chat-text-fill me-2"></i> Meet Our Team
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
