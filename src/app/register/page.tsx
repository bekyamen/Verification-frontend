'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Phone, Lock, Building2, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/services/api';
import PayCheckLogo from '@/components/ui/PayCheckLogo';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [accountType, setAccountType] = useState<'BUSINESS' | 'PERSONAL'>('BUSINESS');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setNotice('');

    if (!fullName.trim()) {
      setError('Please provide your full name.');
      setIsLoading(false);
      return;
    }

    const cleanedPhone = phone.replace(/[\s\-]/g, '');
    const phoneRegex = /^(?:\+251|251|0)?[79]\d{8}$/;
    if (!cleanedPhone || !phoneRegex.test(cleanedPhone)) {
      setError('Please enter a valid phone number (e.g. 0911223355 or 0711223355).');
      setIsLoading(false);
      return;
    }

    const pinRegex = /^\d{4,6}$/;
    if (!pinCode.trim() || !pinRegex.test(pinCode.trim())) {
      setError('Please provide a 4-digit security PIN (e.g. 1234).');
      setIsLoading(false);
      return;
    }

    if (!agreeTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy to continue.');
      setIsLoading(false);
      return;
    }

    try {
      const data = await fetchApi('/auth/register', {
        method: 'POST',
        requireAuth: false,
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: phone.trim(),
          pinCode: pinCode.trim(),
          accountType: accountType,
        }),
      });

      login(data.token, data.user);
      localStorage.setItem('cashierPin', pinCode.trim());
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check your details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page-root">
      {/* Decorative ambient elements */}
      <div className="auth-ambient-blur-1" aria-hidden="true" />
      <div className="auth-ambient-blur-2" aria-hidden="true" />

      <main className="auth-card-container">
        <div className="auth-card">
          {/* Top Brand Logo & Headers */}
          <div className="auth-header">
            <Link href="/" style={{ textDecoration: 'none' }}>
              <PayCheckLogo orientation="vertical" size="md" />
            </Link>
            <h1 className="auth-heading">Create your account</h1>
            <p className="auth-subheading">
              Start accepting and verifying payments in minutes
            </p>
          </div>

          {/* Feedback Banners */}
          {error && (
            <div className="auth-error-banner" role="alert">
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {notice && (
            <div className="auth-toast-banner" role="status">
              <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
              <span>{notice}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleRegister} className="auth-form" noValidate>
            {/* Full Name Field */}
            <div className="auth-field">
              <div className="auth-input-box">
                <input
                  id="register-fullname"
                  type="text"
                  className="auth-input"
                  placeholder="Full Name (e.g. Abebe Kebede)"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  autoComplete="name"
                />
                <div className="auth-input-icon-left">
                  <User size={18} strokeWidth={2} />
                </div>
              </div>
            </div>

            {/* Phone Field */}
            <div className="auth-field">
              <div className="auth-input-box">
                <input
                  id="register-phone"
                  type="tel"
                  className="auth-input"
                  placeholder="Phone number (e.g. 0911223355)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  autoComplete="tel"
                />
                <div className="auth-input-icon-left">
                  <Phone size={18} strokeWidth={2} />
                </div>
              </div>
            </div>

            {/* PIN Code Field */}
            <div className="auth-field">
              <div className="auth-input-box has-right-action">
                <input
                  id="register-pincode"
                  type={showPassword ? 'text' : 'password'}
                  inputMode="numeric"
                  className="auth-input"
                  placeholder="PIN code (e.g. 1234)"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <div className="auth-input-icon-left">
                  <Lock size={18} strokeWidth={2} />
                </div>
                <button
                  type="button"
                  className="auth-password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide PIN' : 'Show PIN'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Account Type Dropdown */}
            <div className="auth-field">
              <div className="auth-input-box auth-select-box">
                <select
                  id="register-account-type"
                  className="auth-input auth-select"
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value as 'BUSINESS' | 'PERSONAL')}
                  aria-label="Account Type"
                >
                  <option value="BUSINESS">🏢  Business / Merchant</option>
                  <option value="PERSONAL">👤  Personal / Individual</option>
                </select>
                <div className="auth-input-icon-left">
                  {accountType === 'BUSINESS' ? <Building2 size={18} strokeWidth={2} /> : <User size={18} strokeWidth={2} />}
                </div>
                <div className="auth-select-chevron" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Terms & Conditions Checkbox */}
            <label className="auth-checkbox-label">
              <input
                id="register-terms-checkbox"
                type="checkbox"
                className="auth-checkbox-input"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <span>
                I agree to the{' '}
                <a href="#" className="auth-terms-link" onClick={(e) => e.preventDefault()}>
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="auth-terms-link" onClick={(e) => e.preventDefault()}>
                  Privacy Policy
                </a>
              </span>
            </label>

            {/* Get Started Button */}
            <button
              id="register-submit-btn"
              type="submit"
              className="auth-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="auth-submit-btn-spinner" />
              ) : (
                <>
                  <span>Get Started</span>
                  <ArrowRight size={17} strokeWidth={2.5} />
                </>
              )}
            </button>
          </form>


          {/* Switch Prompt */}
          <div className="auth-switch-prompt">
            Already have an account?{' '}
            <Link href="/login" className="auth-switch-link">
              Sign in
            </Link>
          </div>
        </div>

        {/* Bottom Footer links */}
        <footer className="auth-footer">
          <a href="#" className="auth-footer-link">Terms</a>
          <a href="#" className="auth-footer-link">Privacy</a>
          <a href="#" className="auth-footer-link">Support</a>
        </footer>
      </main>
    </div>
  );
}
