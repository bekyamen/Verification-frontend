'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { fetchApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import {
  Plus,
  Building2,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  RefreshCw,
  User,
  CreditCard,
  Hash,
  Settings2,
} from 'lucide-react';

interface ReceivingAccount {
  id: string;
  organizationId: string;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdById: string;
  updatedById: string;
}

type BankName = 'CBE' | 'TELEBIRR';

const PROVIDER_META: Record<BankName, { label: string; color: string; bg: string; border: string }> = {
  CBE: {
    label: 'Commercial Bank of Ethiopia',
    color: '#1d4ed8',
    bg: '#eff6ff',
    border: '#bfdbfe',
  },
  TELEBIRR: {
    label: 'Telebirr Wallet',
    color: '#7c3aed',
    bg: '#f5f3ff',
    border: '#ddd6fe',
  },
};

export default function SettingsPage() {
  const { user } = useAuth();

  /* ── Form state ── */
  const [bankName, setBankName] = useState<BankName>('CBE');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ── Accounts list state ── */
  const [accounts, setAccounts] = useState<ReceivingAccount[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
  const [listError, setListError] = useState('');

  /* ── Load existing accounts ── */
  const loadAccounts = async () => {
    setIsLoadingAccounts(true);
    setListError('');
    try {
      const data = await fetchApi('/settings/accounts', { method: 'GET' });
      // API may return { accounts: [] } or []
      setAccounts(Array.isArray(data) ? data : data.accounts ?? []);
    } catch {
      setListError('Could not load accounts. Please try again.');
    } finally {
      setIsLoadingAccounts(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  /* ── Validation ── */
  const validate = (): string | null => {
    if (!accountHolderName.trim()) return 'Account holder name is required.';
    if (!accountNumber.trim()) return 'Account / phone number is required.';
    if (bankName === 'CBE' && !/^\d{13}$/.test(accountNumber.trim())) {
      return 'CBE account number must be exactly 13 digits.';
    }
    if (bankName === 'TELEBIRR' && !/^(?:0|\+251|251)[79]\d{8}$/.test(accountNumber.replace(/\s/g, ''))) {
      return 'Telebirr phone must be a valid Ethiopian mobile number (e.g. 0932571087).';
    }
    return null;
  };

  /* ── Submit ── */
  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    const validationError = validate();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await fetchApi('/settings/accounts', {
        method: 'POST',
        body: JSON.stringify({
          bankName,
          accountNumber: accountNumber.trim(),
          accountHolderName: accountHolderName.trim(),
        }),
      });

      // Prepend the new account to the list
      setAccounts((prev) => [data.account, ...prev]);
      setFormSuccess(`${PROVIDER_META[bankName].label} account registered successfully.`);
      setAccountNumber('');
      setAccountHolderName('');
      setTimeout(() => setFormSuccess(''), 5000);
    } catch (err: any) {
      setFormError(err.message || 'Failed to add account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Helpers ── */
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  return (
    <AppLayout>
      <div className="settings-page">
        {/* Page Header */}
        <div className="settings-page-header">
          <div className="settings-page-header-icon">
            <Settings2 size={22} />
          </div>
          <div>
            <h1 className="settings-page-title">Account Settings</h1>
            <p className="settings-page-subtitle">
              Manage receiving accounts for payment verification
            </p>
          </div>
        </div>

        <div className="settings-layout">
          {/* ── Left: Add Account Form ── */}
          <section className="settings-form-section">
            <div className="card settings-card">
              <div className="settings-card-header">
                <div className="settings-card-header-icon">
                  <Plus size={18} />
                </div>
                <div>
                  <h2 className="settings-card-title">Add Receiving Account</h2>
                  <p className="settings-card-subtitle">
                    Register a CBE bank account or Telebirr wallet
                  </p>
                </div>
              </div>

              <form onSubmit={handleAddAccount} className="settings-form" noValidate>
                {/* Provider Toggle */}
                <div className="settings-input-group">
                  <label className="settings-label">
                    <CreditCard size={14} />
                    Provider
                  </label>
                  <div className="settings-provider-toggle">
                    {(['CBE', 'TELEBIRR'] as BankName[]).map((provider) => {
                      const meta = PROVIDER_META[provider];
                      const isActive = bankName === provider;
                      return (
                        <button
                          key={provider}
                          type="button"
                          className={`settings-provider-btn${isActive ? ' active' : ''}`}
                          style={
                            isActive
                              ? {
                                  background: meta.bg,
                                  borderColor: meta.border,
                                  color: meta.color,
                                }
                              : {}
                          }
                          onClick={() => {
                            setBankName(provider);
                            setAccountNumber('');
                            setFormError('');
                          }}
                        >
                          {provider === 'CBE' ? (
                            <Building2 size={18} />
                          ) : (
                            <Smartphone size={18} />
                          )}
                          <span>
                            {provider === 'CBE' ? 'CBE Bank' : 'Telebirr'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="settings-provider-hint">
                    {PROVIDER_META[bankName].label}
                  </p>
                </div>

                {/* Account Holder Name */}
                <div className="settings-input-group">
                  <label htmlFor="settings-holder-name" className="settings-label">
                    <User size={14} />
                    Account Holder Name
                  </label>
                  <div className="settings-input-wrapper">
                    <input
                      id="settings-holder-name"
                      type="text"
                      className="settings-input"
                      placeholder={
                        bankName === 'CBE'
                          ? 'e.g. Yordanos Lulu Kibret'
                          : 'e.g. SADA'
                      }
                      value={accountHolderName}
                      onChange={(e) => setAccountHolderName(e.target.value)}
                      autoComplete="name"
                      required
                    />
                  </div>
                </div>

                {/* Account Number */}
                <div className="settings-input-group">
                  <label htmlFor="settings-account-number" className="settings-label">
                    <Hash size={14} />
                    {bankName === 'CBE' ? 'Account Number' : 'Phone Number'}
                  </label>
                  <div className="settings-input-wrapper">
                    <input
                      id="settings-account-number"
                      type={bankName === 'CBE' ? 'text' : 'tel'}
                      inputMode="numeric"
                      className="settings-input"
                      placeholder={
                        bankName === 'CBE'
                          ? 'e.g. 1000076330763 (13 digits)'
                          : 'e.g. 0932571087'
                      }
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      required
                    />
                    <div className="settings-input-badge">
                      {bankName === 'CBE' ? 'CBE' : 'ETB'}
                    </div>
                  </div>
                </div>

                {/* Feedback */}
                {formError && (
                  <div className="settings-alert settings-alert-error">
                    <AlertCircle size={15} />
                    <span>{formError}</span>
                  </div>
                )}
                {formSuccess && (
                  <div className="settings-alert settings-alert-success">
                    <CheckCircle2 size={15} />
                    <span>{formSuccess}</span>
                  </div>
                )}

                <button
                  id="settings-add-account-btn"
                  type="submit"
                  className="settings-submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="settings-spinner" />
                      Registering…
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      Register Account
                    </>
                  )}
                </button>
              </form>
            </div>
          </section>

          {/* ── Right: Registered Accounts List ── */}
          <section className="settings-list-section">
            <div className="card settings-card">
              <div className="settings-card-header">
                <div className="settings-card-header-icon settings-card-header-icon--green">
                  <CheckCircle2 size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <h2 className="settings-card-title">Registered Accounts</h2>
                  <p className="settings-card-subtitle">
                    {accounts.length} account{accounts.length !== 1 ? 's' : ''} connected
                  </p>
                </div>
                <button
                  type="button"
                  className="settings-refresh-btn"
                  onClick={loadAccounts}
                  disabled={isLoadingAccounts}
                  aria-label="Refresh accounts"
                >
                  <RefreshCw size={15} className={isLoadingAccounts ? 'settings-spinner' : ''} />
                </button>
              </div>

              {/* Loading skeleton */}
              {isLoadingAccounts && (
                <div className="settings-account-list">
                  {[1, 2].map((i) => (
                    <div key={i} className="settings-account-skeleton" />
                  ))}
                </div>
              )}

              {/* Error */}
              {!isLoadingAccounts && listError && (
                <div className="settings-alert settings-alert-error" style={{ marginTop: '1rem' }}>
                  <AlertCircle size={15} />
                  <span>{listError}</span>
                </div>
              )}

              {/* Empty state */}
              {!isLoadingAccounts && !listError && accounts.length === 0 && (
                <div className="settings-empty-state">
                  <div className="settings-empty-icon">
                    <CreditCard size={28} />
                  </div>
                  <p className="settings-empty-title">No accounts yet</p>
                  <p className="settings-empty-sub">
                    Add a CBE account or Telebirr wallet using the form.
                  </p>
                </div>
              )}

              {/* Account cards */}
              {!isLoadingAccounts && accounts.length > 0 && (
                <div className="settings-account-list">
                  {accounts.map((account) => {
                    const meta = PROVIDER_META[account.bankName as BankName] ?? PROVIDER_META.CBE;
                    return (
                      <div key={account.id} className="settings-account-item">
                        {/* Avatar */}
                        <div
                          className="settings-account-avatar"
                          style={{ background: meta.bg, color: meta.color, border: `1.5px solid ${meta.border}` }}
                        >
                          {getInitials(account.accountHolderName)}
                        </div>

                        {/* Info */}
                        <div className="settings-account-info">
                          <div className="settings-account-name">
                            {account.accountHolderName}
                          </div>
                          <div className="settings-account-number">
                            {account.accountNumber}
                          </div>
                          <div className="settings-account-meta">
                            Added {formatDate(account.createdAt)}
                          </div>
                        </div>

                        {/* Right side */}
                        <div className="settings-account-right">
                          <span
                            className="settings-bank-badge"
                            style={{
                              background: meta.bg,
                              color: meta.color,
                              border: `1px solid ${meta.border}`,
                            }}
                          >
                            {account.bankName === 'CBE' ? (
                              <Building2 size={11} />
                            ) : (
                              <Smartphone size={11} />
                            )}
                            {account.bankName}
                          </span>
                          {account.isActive && (
                            <span className="settings-active-dot" title="Active" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
