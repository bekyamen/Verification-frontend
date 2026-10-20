'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Phone, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/services/api';
import PayCheckLogo from '@/components/ui/PayCheckLogo';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setNotice('');

    const cleanedPhone = phone.replace(/[\s\-]/g, '');
    const phoneRegex = /^(?:\+251|251|0)?[79]\d{8}$/;
    if (!cleanedPhone || !phoneRegex.test(cleanedPhone)) {
      setError('Please enter a valid phone number (e.g. 0911223355 or 0711223355).');
      setIsLoading(false);
      return;
    }

    const pinRegex = /^\d{4,6}$/;
    if (!pinCode.trim() || !pinRegex.test(pinCode.trim())) {
      setError('Please enter your 4-digit PIN code (e.g. 1234).');
      setIsLoading(false);
      return;
    }

    try {
      const data = await fetchApi('/auth/login', {
        method: 'POST',
        requireAuth: false,
        body: JSON.stringify({
          phone: phone.trim(),
          pinCode: pinCode.trim(),
        }),
      });

      login(data.token, data.user);
      localStorage.setItem('cashierPin', pinCode.trim());
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPin = () => {
    if (!phone.trim()) {
      setError('Please enter your phone number first.');
      return;
    }
    setError('');
    setNotice(`PIN reset instructions will be sent via SMS to ${phone}`);
    setTimeout(() => setNotice(''), 4000);
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
            <h1 className="auth-heading">Sign in with Phone & PIN</h1>
            <p className="auth-subheading">
              Enter your mobile number and security PIN to access your account
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
          <form onSubmit={handleLogin} className="auth-form" noValidate>
            {/* Phone Field */}
            <div className="auth-field">
              <div className="auth-input-box">
                <input
                  id="login-phone"
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
                  id="login-pincode"
                  type={showPassword ? 'text' : 'password'}
                  inputMode="numeric"
                  className="auth-input"
                  placeholder="PIN code (e.g. 1234)"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  required
                  autoComplete="current-password"
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

            {/* Forgot PIN */}
            <div className="auth-forgot-row">
              <button
                type="button"
                onClick={handleForgotPin}
                className="auth-forgot-link"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                Forgot PIN?
              </button>
            </div>

            {/* Get Started Button */}
            <button
              id="login-submit-btn"
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
            Don't have an account?{' '}
            <Link href="/register" className="auth-switch-link">
              Sign up
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
