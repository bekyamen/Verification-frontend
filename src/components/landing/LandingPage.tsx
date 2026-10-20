'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Zap,
  Lock,
  Search,
  ArrowRight,
  Play,
  Check,
  Building2,
  Users,
  Receipt,
  FileCheck2,
  Menu,
  X,
  Send,
  UploadCloud
} from 'lucide-react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  // Interactive Hero Mockup State
  const [heroTab, setHeroTab] = useState<'manual' | 'image'>('manual');
  const [heroProvider, setHeroProvider] = useState<'CBE' | 'TELEBIRR'>('CBE');
  const [heroRef, setHeroRef] = useState('FT201445G2ST');
  const [heroAcc, setHeroAcc] = useState('1000213429489');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedFeedback, setVerifiedFeedback] = useState(false);

  const handleProviderSelect = (provider: 'CBE' | 'TELEBIRR') => {
    setHeroProvider(provider);
    if (provider === 'CBE') {
      setHeroRef('FT201445G2ST');
      setHeroAcc('1000213429489');
    } else {
      setHeroRef('TB9948210492');
      setHeroAcc('0911223344');
    }
  };

  const handleHeroVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerifiedFeedback(true);
      setTimeout(() => setVerifiedFeedback(false), 3500);
    }, 700);
  };

  return (
    <div className="lp-root">
      {/* Background ambient lighting */}
      <div className="lp-hero-ambient-glow" aria-hidden="true" />
      <div className="lp-hero-ambient-glow-left" aria-hidden="true" />

      {/* ===================================================================
          1. NAVIGATION HEADER
          =================================================================== */}
      <header className="lp-header">
        <div className="lp-container">
          <div className="lp-header-inner">
            {/* Logo */}
            <Link href="/" className="lp-brand">
              <div className="lp-brand-icon">
                <ShieldCheck size={22} strokeWidth={2.5} />
              </div>
              <div className="lp-brand-text">
                <span className="lp-brand-title">PayCheck</span>
                <span className="lp-brand-subtitle">Verify Payments. Build Trust.</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="lp-nav">
              <a href="#" className="lp-nav-link active">Home</a>
              <a href="#features" className="lp-nav-link">Features</a>
              <a href="#how-it-works" className="lp-nav-link">How It Works</a>
              <a href="#pricing" className="lp-nav-link">Pricing</a>
              <a href="#help" className="lp-nav-link">Help</a>
            </nav>

            {/* Desktop Action Buttons */}
            <div className="lp-header-actions">
              <Link href="/login" className="lp-btn-login">
                Login
              </Link>
              <Link href="/dashboard" className="lp-btn-primary">
                Get Started
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <button 
              className="lp-hamburger-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lp-mobile-drawer">
            <a href="#" onClick={() => setMobileMenuOpen(false)}>Home</a>
            <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
            <a href="#help" onClick={() => setMobileMenuOpen(false)}>Help</a>
            <div className="lp-mobile-drawer-actions">
              <Link href="/login" className="lp-btn-outline" style={{ width: '100%' }}>
                Login
              </Link>
              <Link href="/dashboard" className="lp-btn-primary" style={{ width: '100%' }}>
                Get Started
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ===================================================================
          2. HERO SECTION
          =================================================================== */}
      <section className="lp-hero-section">
        <div className="lp-container">
          <div className="lp-hero-grid">
            
            {/* Left Hero Column */}
            <div className="lp-hero-content">
              {/* Badge */}
              <div className="lp-badge-pill">
                <ShieldCheck size={16} color="#0D6EFD" />
                <span>CBE &amp; Telebirr Payment Verification</span>
              </div>

              {/* Headline */}
              <h1 className="lp-hero-title">
                Stop Fake Payments.<br />
                <span className="text-darkblue">Verify</span> Before You<br />
                <span className="text-primary">Release.</span>
              </h1>

              {/* Subheading */}
              <p className="lp-hero-desc">
                PayCheck helps Ethiopian businesses verify CBE and Telebirr payments in seconds. 
                Confirm real transactions, prevent fraud, and build customer trust.
              </p>

              {/* Action Buttons */}
              <div className="lp-hero-cta-group">
                <Link href="/dashboard" className="lp-btn-primary lp-hero-btn-cta">
                  <span>Start Verifying Now</span>
                  <ArrowRight size={18} />
                </Link>
                <button 
                  onClick={() => setDemoModalOpen(true)}
                  className="lp-btn-outline lp-hero-btn-cta"
                >
                  <div className="lp-play-icon-wrap">
                    <Play size={10} style={{ fill: '#0D6EFD', marginLeft: '2px' }} />
                  </div>
                  <span>Watch Demo</span>
                </button>
              </div>

              {/* 3 Trust Points */}
              <div className="lp-trust-row">
                <div className="lp-trust-item">
                  <div className="lp-trust-heading">
                    <Zap size={16} color="#0D6EFD" />
                    <span>Fast</span>
                  </div>
                  <span className="lp-trust-sub">Results in seconds</span>
                </div>

                <div className="lp-trust-item">
                  <div className="lp-trust-heading">
                    <ShieldCheck size={16} color="#0D6EFD" />
                    <span>Secure</span>
                  </div>
                  <span className="lp-trust-sub">Official bank data</span>
                </div>

                <div className="lp-trust-item">
                  <div className="lp-trust-heading">
                    <Lock size={16} color="#0D6EFD" />
                    <span>Reliable</span>
                  </div>
                  <span className="lp-trust-sub">Trusted by businesses</span>
                </div>
              </div>

            </div>

            {/* Right Hero Column: Interactive App Mockup & Floating Card */}
            <div className="lp-hero-visual">
              <div className="lp-mockup-wrapper">
                
                {/* 1. Main Verification Card */}
                <div className="lp-mockup-card">
                  {/* Card Header */}
                  <div className="lp-mockup-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="lp-brand-icon" style={{ width: '28px', height: '28px', borderRadius: '8px' }}>
                        <ShieldCheck size={16} />
                      </div>
                      <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0f172a' }}>PayCheck</span>
                    </div>
                    <div className="lp-mockup-user-icon">
                      <Users size={14} />
                    </div>
                  </div>

                  {/* Title & Helper */}
                  <h3 className="lp-mockup-title">Verify Payment</h3>
                  <p className="lp-mockup-subtitle">Enter details or upload a receipt to verify the payment</p>

                  {/* Tabs: Manual vs Upload */}
                  <div className="lp-mockup-tabs">
                    <button
                      type="button"
                      onClick={() => setHeroTab('manual')}
                      className={`lp-mockup-tab-btn ${heroTab === 'manual' ? 'active' : ''}`}
                    >
                      Manual Verification
                    </button>
                    <button
                      type="button"
                      onClick={() => setHeroTab('image')}
                      className={`lp-mockup-tab-btn ${heroTab === 'image' ? 'active' : ''}`}
                    >
                      Upload Receipt Image
                    </button>
                  </div>

                  {/* Select Provider */}
                  <div>
                    <span className="lp-provider-label">Select Provider</span>
                    <div className="lp-provider-grid">
                      {/* CBE Option */}
                      <button
                        type="button"
                        onClick={() => handleProviderSelect('CBE')}
                        className={`lp-provider-btn ${heroProvider === 'CBE' ? 'active' : ''}`}
                      >
                        <div className="lp-provider-icon-cbe">
                          CB
                        </div>
                        <span className="lp-provider-name">CBE</span>
                      </button>

                      {/* Telebirr Option */}
                      <button
                        type="button"
                        onClick={() => handleProviderSelect('TELEBIRR')}
                        className={`lp-provider-btn ${heroProvider === 'TELEBIRR' ? 'active' : ''}`}
                      >
                        <div className="lp-provider-icon-telebirr">
                          t
                        </div>
                        <span className="lp-provider-name">Telebirr</span>
                      </button>
                    </div>
                  </div>

                  {/* Input Fields / Dropzone */}
                  {heroTab === 'manual' ? (
                    <div>
                      <div className="lp-form-field">
                        <label className="lp-field-label">
                          {heroProvider === 'CBE' ? 'Transaction Reference (FT...)' : 'Transaction Number'}
                        </label>
                        <input
                          type="text"
                          value={heroRef}
                          onChange={(e) => setHeroRef(e.target.value)}
                          placeholder={heroProvider === 'CBE' ? 'e.g. FT201445G2ST' : 'e.g. TB9948210492'}
                          className="lp-text-input"
                        />
                      </div>
                      <div className="lp-form-field">
                        <label className="lp-field-label">
                          {heroProvider === 'CBE' ? 'Receiving Account Number' : 'Merchant Phone Number'}
                        </label>
                        <input
                          type="text"
                          value={heroAcc}
                          onChange={(e) => setHeroAcc(e.target.value)}
                          placeholder={heroProvider === 'CBE' ? 'e.g. 1000213429489' : 'e.g. 0911223344'}
                          className="lp-text-input"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="lp-file-dropzone">
                      <UploadCloud size={28} color="#0D6EFD" style={{ margin: '0 auto' }} />
                      <p className="lp-file-dropzone-title">Drop your screenshot here</p>
                      <p className="lp-file-dropzone-sub">PNG, JPG or PDF receipts up to 10MB</p>
                    </div>
                  )}

                  {/* Verify Action Button */}
                  <button
                    type="button"
                    onClick={handleHeroVerify}
                    className="lp-btn-verify-action"
                  >
                    <Search size={14} />
                    <span>{isVerifying ? 'Verifying with Bank Records...' : 'Verify Payment'}</span>
                  </button>

                  {verifiedFeedback && (
                    <div className="lp-action-feedback">
                      ✓ Payment record verified with official provider!
                    </div>
                  )}
                </div>

                {/* 2. Overlapping Floating "Payment Verified" Result Card */}
                <div className="lp-verified-badge">
                  {/* Decorative Sparkle Accent */}
                  <div className="lp-badge-sparkles">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                      <line x1="14" y1="2" x2="14" y2="8" stroke="#0D6EFD" strokeWidth="2.5" strokeLinecap="round" />
                      <line x1="22" y1="6" x2="18" y2="10" stroke="#0D6EFD" strokeWidth="2.5" strokeLinecap="round" />
                      <line x1="26" y1="14" x2="20" y2="14" stroke="#0D6EFD" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  </div>

                  {/* Verified Header */}
                  <div className="lp-badge-header">
                    <div className="lp-badge-check-circle">
                      <Check size={18} strokeWidth={3} />
                    </div>
                    <span className="lp-badge-verified-text">Payment Verified</span>
                    <span className="lp-badge-amount">1,500 ETB</span>
                  </div>

                  {/* Transaction Metadata Table */}
                  <div className="lp-badge-details">
                    <div className="lp-detail-row">
                      <span>Provider</span>
                      <span className="lp-detail-value">{heroProvider}</span>
                    </div>
                    <div className="lp-detail-row">
                      <span>Reference</span>
                      <span className="lp-detail-value font-mono">{heroRef}</span>
                    </div>
                    <div className="lp-detail-row">
                      <span>Payer</span>
                      <span className="lp-detail-value">Abebe Kebede</span>
                    </div>
                    <div className="lp-detail-row">
                      <span>Date &amp; Time</span>
                      <span className="lp-detail-value">Jun 12, 2025 10:24 AM</span>
                    </div>
                    <div className="lp-detail-row" style={{ paddingTop: '4px', borderTop: '1px solid #f1f5f9' }}>
                      <span>Status</span>
                      <span className="lp-status-tag">Completed</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===================================================================
          3. HOW IT WORKS SECTION
          =================================================================== */}
      <section id="how-it-works" className="lp-how-it-works-section">
        <div className="lp-container">
          
          {/* Section Header */}
          <div className="lp-section-header">
            <span className="lp-section-tag">HOW IT WORKS</span>
            <h2 className="lp-section-title">Simple Steps. Trusted Results.</h2>
            <p className="lp-section-desc">
              Verify CBE and Telebirr payments in just a few steps.
            </p>
          </div>

          {/* Stepper Flow Grid */}
          <div className="lp-steps-grid">
            
            {/* Step 1 */}
            <div className="lp-step-card">
              <div className="lp-step-icon-wrap">
                <div className="lp-step-icon-box">
                  <Receipt size={26} />
                </div>
                <div className="lp-step-number">1</div>
              </div>
              <h3 className="lp-step-card-title">Enter Details</h3>
              <p className="lp-step-card-text">
                Provide the transaction reference and receiving account number.
              </p>

              {/* Desktop Connecting Arrow */}
              <div className="lp-step-arrow">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Step 2 */}
            <div className="lp-step-card">
              <div className="lp-step-icon-wrap">
                <div className="lp-step-icon-box">
                  <FileCheck2 size={26} />
                </div>
                <div className="lp-step-number">2</div>
              </div>
              <h3 className="lp-step-card-title">Upload Receipt (Optional)</h3>
              <p className="lp-step-card-text">
                Or upload a screenshot of the receipt for automatic extraction.
              </p>

              {/* Desktop Connecting Arrow */}
              <div className="lp-step-arrow">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Step 3 */}
            <div className="lp-step-card">
              <div className="lp-step-icon-wrap">
                <div className="lp-step-icon-box">
                  <Search size={26} />
                </div>
                <div className="lp-step-number">3</div>
              </div>
              <h3 className="lp-step-card-title">Get Result</h3>
              <p className="lp-step-card-text">
                We check the transaction with official CBE and Telebirr records.
              </p>

              {/* Desktop Connecting Arrow */}
              <div className="lp-step-arrow">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Step 4 */}
            <div className="lp-step-card">
              <div className="lp-step-icon-wrap">
                <div className="lp-step-icon-box">
                  <ShieldCheck size={26} />
                </div>
                <div className="lp-step-number">4</div>
              </div>
              <h3 className="lp-step-card-title">Take Action</h3>
              <p className="lp-step-card-text">
                Confirm the payment and complete the order.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ===================================================================
          4. WHY CHOOSE PAYCHECK SECTION
          =================================================================== */}
      <section id="features" className="lp-why-section">
        <div className="lp-container">
          <div className="lp-why-grid">
            
            {/* Left Content Column */}
            <div className="lp-why-content">
              <span className="lp-section-tag">WHY CHOOSE PAYCHECK</span>
              <h2 className="lp-why-title">Built for Ethiopian Businesses</h2>
              <p className="lp-why-desc">
                Whether you run an online shop, restaurant, delivery service or retail store, 
                PayCheck gives you the confidence to accept real payments and avoid fraud.
              </p>
              <Link href="/dashboard" className="lp-btn-primary lp-hero-btn-cta">
                <span>Get Started Free</span>
                <ArrowRight size={18} />
              </Link>
            </div>

            {/* Right 2x2 Feature Grid */}
            <div className="lp-features-grid">
              
              {/* Feature 1: Fraud Prevention */}
              <div className="lp-feature-card">
                <div className="lp-feature-icon-box">
                  <ShieldCheck size={22} />
                </div>
                <h3 className="lp-feature-title">Fraud Prevention</h3>
                <p className="lp-feature-desc">
                  Detect fake or manipulated receipts and screenshots before dispatching goods.
                </p>
              </div>

              {/* Feature 2: Real-Time Verification */}
              <div className="lp-feature-card">
                <div className="lp-feature-icon-box">
                  <Zap size={22} />
                </div>
                <h3 className="lp-feature-title">Real-Time Verification</h3>
                <p className="lp-feature-desc">
                  Get results in seconds, not minutes, keeping customer checkout flow rapid and seamless.
                </p>
              </div>

              {/* Feature 3: CBE & Telebirr Support */}
              <div className="lp-feature-card">
                <div className="lp-feature-icon-box">
                  <Building2 size={22} />
                </div>
                <h3 className="lp-feature-title">CBE &amp; Telebirr Support</h3>
                <p className="lp-feature-desc">
                  Verify payments from the most used financial providers in Ethiopia in one unified place.
                </p>
              </div>

              {/* Feature 4: Merchant Tools */}
              <div className="lp-feature-card">
                <div className="lp-feature-icon-box">
                  <Users size={22} />
                </div>
                <h3 className="lp-feature-title">Merchant Tools</h3>
                <p className="lp-feature-desc">
                  Transaction history, audit reports, and multiple staff cashier accounts to scale operations.
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ===================================================================
          5. CALL TO ACTION BANNER
          =================================================================== */}
      <section id="pricing" className="lp-cta-section">
        <div className="lp-container">
          <div className="lp-cta-banner">
            <div className="lp-cta-text">
              <h2 className="lp-cta-title">Ready to stop payment fraud?</h2>
              <p className="lp-cta-subtitle">
                Join thousands of Ethiopian businesses using PayCheck.
              </p>
            </div>
            
            <div className="lp-cta-action">
              <Link href="/dashboard" className="lp-btn-cta-white">
                <span>Get Started Now</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          6. FOOTER
          =================================================================== */}
      <footer id="help" className="lp-footer">
        <div className="lp-container">
          <div className="lp-footer-inner">
            
            {/* Left: Brand */}
            <Link href="/" className="lp-footer-brand">
              <div className="lp-brand-icon" style={{ width: '32px', height: '32px', borderRadius: '9px' }}>
                <ShieldCheck size={18} />
              </div>
              <span className="lp-footer-brand-title">PayCheck</span>
            </Link>

            {/* Center: Nav links */}
            <div className="lp-footer-links">
              <a href="#" className="lp-footer-link">Home</a>
              <a href="#features" className="lp-footer-link">Features</a>
              <a href="#how-it-works" className="lp-footer-link">How It Works</a>
              <a href="#pricing" className="lp-footer-link">Pricing</a>
              <a href="#help" className="lp-footer-link">Help</a>
            </div>

            {/* Right: Social & Copyright */}
            <div className="lp-footer-right">
              <div className="lp-social-group">
                <a href="#" className="lp-social-btn" aria-label="Facebook">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a href="#" className="lp-social-btn" aria-label="Telegram">
                  <Send size={14} />
                </a>
                <a href="#" className="lp-social-btn" aria-label="Twitter">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
              <span className="lp-copyright">
                &copy; {new Date().getFullYear()} PayCheck. All rights reserved.
              </span>
            </div>

          </div>
        </div>
      </footer>

      {/* ===================================================================
          7. WATCH DEMO MODAL
          =================================================================== */}
      {demoModalOpen && (
        <div className="lp-modal-backdrop" onClick={() => setDemoModalOpen(false)}>
          <div className="lp-modal-card" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setDemoModalOpen(false)}
              className="lp-modal-close"
              aria-label="Close demo modal"
            >
              <X size={20} />
            </button>

            <div className="lp-modal-header">
              <div className="lp-modal-icon">
                <Play size={20} style={{ fill: '#0D6EFD', marginLeft: '2px' }} />
              </div>
              <div>
                <h3 className="lp-modal-title">PayCheck In Action</h3>
                <p className="lp-modal-subtitle">How Ethiopian merchants protect their business</p>
              </div>
            </div>

            <div className="lp-modal-timeline">
              <div className="lp-modal-step">
                <div className="lp-modal-step-badge">1</div>
                <div>
                  <h4 className="lp-modal-step-title">A customer presents a payment receipt</h4>
                  <p className="lp-modal-step-desc">
                    Rather than trusting a photoshopped SMS or screenshot, cashier enters the FT reference code.
                  </p>
                </div>
              </div>

              <div className="lp-modal-step">
                <div className="lp-modal-step-badge">2</div>
                <div>
                  <h4 className="lp-modal-step-title">Real-time official bank confirmation</h4>
                  <p className="lp-modal-step-desc">
                    PayCheck cross-checks the official CBE / Telebirr records to verify funds landed in your merchant account.
                  </p>
                </div>
              </div>

              <div className="lp-modal-step">
                <div className="lp-modal-step-badge">3</div>
                <div>
                  <h4 className="lp-modal-step-title">Zero risk, instant delivery</h4>
                  <p className="lp-modal-step-desc">
                    You get an instant green badge with confirmed amount, date, and payer name. Goods can be safely released!
                  </p>
                </div>
              </div>
            </div>

            <div className="lp-modal-actions">
              <Link 
                href="/dashboard" 
                onClick={() => setDemoModalOpen(false)}
                className="lp-btn-primary"
                style={{ padding: '12px' }}
              >
                Try It Live Now
              </Link>
              <button 
                onClick={() => setDemoModalOpen(false)}
                className="lp-btn-outline"
                style={{ padding: '12px' }}
              >
                Close Demo
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
