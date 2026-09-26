import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dbService } from '../services/dbService';

const ServicesPage = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const load = async () => setServices(await dbService.getServices());
    load();
  }, []);

  const serviceImages = {
    'SRV-01': 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
    'SRV-02': 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    'SRV-03': 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
    'SRV-04': 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
    'SRV-05': 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80',
    'SRV-06': 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80'
  };

  return (
    <div>
      {/* Banner */}
      <div className="bg-gvr-primary py-5 text-white">
        <div className="container py-4 text-center">
          <span className="badge badge-gold px-3 py-2 text-uppercase mb-2">Our Expertise</span>
          <h1 className="display-5 fw-bold font-serif mb-2">Event Infrastructure Services</h1>
          <p className="lead text-light opacity-75 mx-auto" style={{ maxWidth: '650px' }}>
            Comprehensive end-to-end setup and equipment rental services managed by seasoned professionals.
          </p>
        </div>
      </div>

      {/* Services List */}
      <section className="py-5 bg-light">
        <div className="container py-3">
          <div className="d-flex flex-column gap-5">
            {services.map((srv, index) => {
              const isEven = index % 2 === 1;
              return (
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden gvr-card p-0" key={srv.id}>
                  <div className="row g-0 align-items-center">
                    <div className={`col-lg-5 ${isEven ? 'order-lg-2' : ''}`}>
                      <img
                        src={serviceImages[srv.id] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80'}
                        alt={srv.title}
                        className="w-100 object-fit-cover"
                        style={{ minHeight: '340px', maxHeight: '400px' }}
                      />
                    </div>

                    <div className={`col-lg-7 p-4 p-md-5 ${isEven ? 'order-lg-1' : ''}`}>
                      <div className="d-inline-flex align-items-center gap-2 px-3 py-1 bg-gvr-gold-soft text-gvr-gold rounded-pill mb-3 fw-bold small">
                        <i className={`bi ${srv.icon} fs-5`}></i>
                        <span>Service #{index + 1}</span>
                      </div>

                      <h3 className="fw-bold font-serif text-dark mb-3">{srv.title}</h3>
                      <p className="text-muted leading-relaxed mb-4">{srv.fullDesc}</p>

                      <h6 className="fw-bold text-dark small text-uppercase mb-2">Key Service Highlights:</h6>
                      <div className="row g-2 mb-4">
                        {srv.highlights?.map((hl, hIdx) => (
                          <div className="col-sm-6" key={hIdx}>
                            <div className="d-flex align-items-center gap-2 small text-secondary">
                              <i className="bi bi-check-circle-fill text-success"></i>
                              <span>{hl}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="d-flex gap-3 flex-wrap">
                        <Link to={`/book-now?service=${encodeURIComponent(srv.title)}`} className="btn btn-gvr-gold px-4 py-2 fw-bold">
                          <i className="bi bi-calendar-check me-1"></i> Book This Service
                        </Link>
                        <Link to="/products" className="btn btn-outline-dark px-4 py-2 fw-semibold">
                          View Related Equipment
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Support Strip */}
      <section className="py-4 bg-gvr-primary-dark text-white text-center">
        <div className="container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
            <div className="text-md-start">
              <h5 className="mb-0 fw-bold font-serif text-gvr-gold">Need Custom Dimensions or Ground Inspection?</h5>
              <p className="small text-light opacity-75 mb-0">Our senior field engineer will visit your venue to measure ground capacity and electrical layout.</p>
            </div>
            <a href="tel:+919908862243" className="btn btn-gvr-gold fw-bold px-4 py-2 flex-shrink-0">
              <i className="bi bi-geo-alt-fill me-1"></i> Book Free Site Inspection
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
