import React, { useState, useEffect } from 'react';
import PackageCard from '../components/PackageCard';
import { dbService } from '../services/dbService';

const PackagesPage = () => {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    const load = async () => setPackages(await dbService.getPackages());
    load();
  }, []);

  return (
    <div>
      {/* Banner */}
      <div className="bg-gvr-primary py-5 text-white">
        <div className="container py-3 text-center">
          <span className="badge badge-gold px-3 py-2 text-uppercase mb-2">Pre-Configured Bundles</span>
          <h1 className="display-5 fw-bold font-serif mb-2">All-In-One Event Packages</h1>
          <p className="lead text-light opacity-75 mx-auto" style={{ maxWidth: '650px' }}>
            Curated packages that combine tents, seating, stages, audio, lighting, and power backup at discounted combination rates.
          </p>
        </div>
      </div>

      <div className="container py-5">
        <div className="text-center mb-5">
          <span className="badge bg-secondary text-light px-3 py-2 text-uppercase mb-2">Save up to 25%</span>
          <h2 className="display-6 fw-bold font-serif text-dark section-title">Ready-To-Book Event Sets</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
            Choose an event package below. You can customize guest capacity or add extra equipment during the booking step.
          </p>
        </div>

        <div className="row g-4 mb-5">
          {packages.map((pkg) => (
            <div className="col-md-6 col-lg-4" key={pkg.id}>
              <PackageCard pkg={pkg} />
            </div>
          ))}
        </div>

        {/* Custom Package Consultation Box */}
        <div className="card bg-gvr-gold-soft border-warning border-opacity-50 rounded-4 p-4 p-md-5 mt-4">
          <div className="row align-items-center g-4">
            <div className="col-lg-8">
              <span className="badge bg-warning text-dark px-3 py-1 mb-2 fw-bold text-uppercase">Custom Tailoring</span>
              <h3 className="fw-bold font-serif text-dark mb-2">Need a Custom Setup for 2,000+ Guests?</h3>
              <p className="text-muted mb-0">
                We specialize in mega-exhibitions, political conventions, multi-day destination weddings, and custom hangar dimensions with central AC and heavy industrial power.
              </p>
            </div>
            <div className="col-lg-4 text-center text-lg-end">
              <a href="https://wa.me/919876543210?text=Hello%20GVR%20Suppliers,%20I%20need%20a%20custom%20event%20package%20quotation" target="_blank" rel="noreferrer" className="btn btn-success btn-lg px-4 py-3 fw-bold">
                <i className="bi bi-whatsapp me-2"></i> WhatsApp Our Planner
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackagesPage;
