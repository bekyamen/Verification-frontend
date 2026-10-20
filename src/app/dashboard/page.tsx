'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  ShieldCheck,
  UploadCloud,
  Edit3,
  Image as ImageIcon,
  Check,
  Search,
  Zap,
  Lock,
  Headset,
  Info,
  AlertCircle,
  X,
  CheckCircle2,
  XCircle,
  Loader2,
  FileImage,
  Hash,
  User,
  Phone,
  Banknote,
  Clock,
  RefreshCw,
  KeyRound,
  Eye,
  EyeOff,
} from 'lucide-react';
import { fetchApi, BASE_URL } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface VerificationResult {
  id: string;
  branchId: string;
  cashierId: string;
  provider: string;
  txnReference: string;
  amount: string;
  expectedAmount: string | null;
  receivingAccount: string | null;
  senderAccount: string | null;
  payerPhone: string | null;
  payerName: string | null;
  receiptUrl: string | null;
  receiptImageUrl: string | null;
  status: 'VERIFIED' | 'FAILED' | 'PENDING' | string;
  rawScannedText: string | null;
  verifiedAt: string;
}

/* ─────────────────────────────────────────────
   PIN Modal
───────────────────────────────────────────── */
function PinModal({
  isOpen,
  onConfirm,
  onCancel,
}: {
  isOpen: boolean;
  onConfirm: (pin: string) => void;
  onCancel: () => void;
}) {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="verify-modal-backdrop" role="dialog" aria-modal="true">
      <div className="verify-modal-box">
        <button className="verify-modal-close" onClick={onCancel} aria-label="Cancel">
          <X size={18} />
        </button>
        <div className="verify-modal-icon">
          <KeyRound size={22} />
        </div>
        <h3 className="verify-modal-title">Enter Cashier PIN</h3>
        <p className="verify-modal-sub">No saved PIN found. Enter your PIN once — it will be remembered for future verifications.</p>
        <div className="verify-pin-wrapper">
          <input
            ref={inputRef}
            id="cashier-pin-input"
            type={showPin ? 'text' : 'password'}
            inputMode="numeric"
            maxLength={6}
            className="verify-pin-input"
            placeholder="••••"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && pin.length >= 4) onConfirm(pin);
            }}
          />
          <button
            type="button"
            className="verify-pin-toggle"
            onClick={() => setShowPin((v) => !v)}
            tabIndex={-1}
          >
            {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <div className="verify-modal-actions">
          <button className="verify-modal-cancel" onClick={onCancel}>Cancel</button>
          <button
            className="verify-modal-confirm"
            disabled={pin.length < 4}
            onClick={() => onConfirm(pin)}
          >
            Confirm &amp; Verify
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Result Panel
───────────────────────────────────────────── */
function ResultPanel({
  result,
  onReset,
}: {
  result: VerificationResult;
  onReset: () => void;
}) {
  const verified = result.status === 'VERIFIED';
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const Field = ({
    icon,
    label,
    value,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string | null | undefined;
  }) => {
    if (!value || value === 'MANUAL_ENTRY' || value === 'UPLOADED_FILE_PROOF') return null;
    return (
      <div className="verify-result-field">
        <div className="verify-result-field-icon">{icon}</div>
        <div className="verify-result-field-body">
          <span className="verify-result-field-label">{label}</span>
          <span className="verify-result-field-value">{value}</span>
        </div>
      </div>
    );
  };

  return (
    <div className={`verify-result-panel ${verified ? 'verified' : 'failed'}`}>
      {/* Status Badge */}
      <div className="verify-result-status">
        <div className={`verify-result-status-icon ${verified ? 'verified' : 'failed'}`}>
          {verified ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
        </div>
        <div>
          <div className={`verify-result-status-label ${verified ? 'verified' : 'failed'}`}>
            {verified ? 'Payment Verified' : 'Verification Failed'}
          </div>
          <div className="verify-result-status-sub">
            {result.provider} · {formatDate(result.verifiedAt)}
          </div>
        </div>
        <button className="verify-result-reset" onClick={onReset} title="Verify another">
          <RefreshCw size={15} />
          Again
        </button>
      </div>

      {/* Fields */}
      <div className="verify-result-fields">
        <Field icon={<Hash size={14} />} label="Transaction Reference" value={result.txnReference} />
        <Field icon={<Banknote size={14} />} label="Amount" value={result.amount ? `ETB ${result.amount}` : null} />
        <Field icon={<User size={14} />} label="Payer Name" value={result.payerName} />
        <Field icon={<Phone size={14} />} label="Payer Phone" value={result.payerPhone} />
        <Field icon={<Hash size={14} />} label="Receiving Account" value={result.receivingAccount} />
        <Field icon={<Hash size={14} />} label="Sender Account" value={result.senderAccount} />
        <Field icon={<Clock size={14} />} label="Verified At" value={formatDate(result.verifiedAt)} />
      </div>

      {/* Raw scanned text (collapsible) if exists and meaningful */}
      {result.rawScannedText &&
        result.rawScannedText !== 'MANUAL_ENTRY' &&
        result.rawScannedText !== 'UPLOADED_FILE_PROOF' && (
          <details className="verify-result-raw">
            <summary>Raw Extracted Text</summary>
            <pre>{result.rawScannedText}</pre>
          </details>
        )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
export default function DashboardPage() {
  const { user } = useAuth();

  /* Tabs */
  const [activeTab, setActiveTab] = useState<'manual' | 'image'>('manual');

  /* Shared form state */
  const [provider, setProvider] = useState<'CBE' | 'TELEBIRR'>('CBE');

  /* Manual form */
  const [txnReference, setTxnReference] = useState('');
  const [receivingAccount, setReceivingAccount] = useState('');

  /* Image form */
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* PIN modal (fallback only) */
  const [showPinModal, setShowPinModal] = useState(false);
  const pendingActionRef = useRef<((pin: string) => Promise<void>) | null>(null);

  /* Status */
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<VerificationResult | null>(null);

  /* ── File helpers ── */
  const handleFileSelected = (file: File) => {
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      setError('Please select a JPG, PNG, WebP, or PDF file.');
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setError('File too large. Maximum allowed size is 12 MB.');
      return;
    }
    setError('');
    setSelectedFile(file);
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelected(file);
  }, []);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  /* ── Trigger verification: auto-use saved PIN, fall back to modal ── */
  const triggerVerify = (action: (pin: string) => Promise<void>) => {
    setError('');
    setResult(null);

    const savedPin = localStorage.getItem('cashierPin');
    if (savedPin) {
      // PIN is already known — run immediately without prompting
      setIsLoading(true);
      action(savedPin)
        .catch((err: any) => setError(err.message || 'Verification failed. Please try again.'))
        .finally(() => setIsLoading(false));
    } else {
      // No PIN stored — prompt the user once
      pendingActionRef.current = action;
      setShowPinModal(true);
    }
  };

  const handlePinConfirm = async (pin: string) => {
    setShowPinModal(false);
    if (!pendingActionRef.current) return;
    // Persist it so future verifications are seamless
    localStorage.setItem('cashierPin', pin);
    setIsLoading(true);
    setError('');
    try {
      await pendingActionRef.current(pin);
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Manual Verification ── */
  const handleManualVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txnReference.trim()) {
      setError('Transaction reference is required.');
      return;
    }
    if (!receivingAccount.trim()) {
      setError(provider === 'CBE' ? 'Receiving account number is required.' : 'Receiving phone number is required.');
      return;
    }

    triggerVerify(async (pin) => {
      const data = await fetchApi('/verify/manual', {
        method: 'POST',
        pin,
        branchId: user?.branchId || '',
        body: JSON.stringify({
          provider,
          txnReference: txnReference.trim(),
          receivingAccount: receivingAccount.trim(),
        }),
      });
      setResult(data);
    });
  };

  /* ── Image Verification ── */
  const handleImageVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a receipt image first.');
      return;
    }

    triggerVerify(async (pin) => {
      const formData = new FormData();
      formData.append('receipt', selectedFile);

      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      if (pin) headers['x-cashier-pin'] = pin;
      if (user?.branchId) headers['x-branch-id'] = user.branchId;

      const response = await fetch(`${BASE_URL}/verify/image`, {
        method: 'POST',
        headers,
        body: formData,
      });

      const responseData = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(responseData.message || responseData.error || 'Image verification failed');
      }
      setResult(responseData);
    });
  };

  /* ── Reset ── */
  const handleReset = () => {
    setResult(null);
    setError('');
    setTxnReference('');
    setReceivingAccount('');
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  /* ── Provider change ── */
  const handleProviderChange = (p: 'CBE' | 'TELEBIRR') => {
    setProvider(p);
    setReceivingAccount('');
    setError('');
    setResult(null);
  };

  return (
    <AppLayout>
      <PinModal
        isOpen={showPinModal}
        onConfirm={handlePinConfirm}
        onCancel={() => setShowPinModal(false)}
      />

      <div className="verify-page-header">
        <h2 className="verify-page-title">Verify Payment</h2>
        <p className="verify-page-sub">
          Choose a method to verify your CBE or Telebirr payment — manual reference entry or receipt image upload.
        </p>
      </div>

      <div className="dashboard-grid">

        {/* ── Left/Main Column ── */}
        <div className="dashboard-main verify-main-col">

          {/* Result panel takes over when result is present */}
          {result ? (
            <ResultPanel result={result} onReset={handleReset} />
          ) : (
            <>
              {/* 1. Provider Selection */}
              <div className="card">
                <h3 className="verify-section-title">Select Provider</h3>
                <div className="verify-provider-row">
                  <div
                    className={`provider-card${provider === 'CBE' ? ' active' : ''}`}
                    onClick={() => handleProviderChange('CBE')}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleProviderChange('CBE')}
                  >
                    <div className="verify-provider-logo cbe">CB</div>
                    <div>
                      <div className="verify-provider-name">CBE</div>
                      <div className="verify-provider-desc">Commercial Bank of Ethiopia</div>
                    </div>
                  </div>
                  <div
                    className={`provider-card${provider === 'TELEBIRR' ? ' active' : ''}`}
                    onClick={() => handleProviderChange('TELEBIRR')}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleProviderChange('TELEBIRR')}
                  >
                    <div className="verify-provider-logo telebirr">t</div>
                    <div>
                      <div className="verify-provider-name">Telebirr</div>
                      <div className="verify-provider-desc">Ethiopian Mobile Money</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Method Tab Toggle */}
              <div className="verify-tab-row">
                <div
                  className={`verify-tab-card${activeTab === 'image' ? ' active' : ''}`}
                  onClick={() => { setActiveTab('image'); setError(''); }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setActiveTab('image')}
                >
                  <div className={`verify-tab-icon${activeTab === 'image' ? ' active' : ''}`}>
                    <ImageIcon size={20} />
                  </div>
                  <div>
                    <div className="verify-tab-label">Upload Receipt</div>
                    <div className="verify-tab-sub">Use a screenshot or photo</div>
                  </div>
                </div>

                <div
                  className={`verify-tab-card${activeTab === 'manual' ? ' active' : ''}`}
                  onClick={() => { setActiveTab('manual'); setError(''); }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setActiveTab('manual')}
                >
                  <div className={`verify-tab-icon${activeTab === 'manual' ? ' active' : ''}`}>
                    <Edit3 size={20} />
                  </div>
                  <div>
                    <div className="verify-tab-label">Enter Transaction ID</div>
                    <div className="verify-tab-sub">Enter details manually</div>
                  </div>
                </div>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="verify-alert-error">
                  <AlertCircle size={15} />
                  <span>{error}</span>
                  <button onClick={() => setError('')} className="verify-alert-close">
                    <X size={14} />
                  </button>
                </div>
              )}

              {/* 3. Action Area */}

              {/* Manual */}
              {activeTab === 'manual' && (
                <form className="card verify-form" onSubmit={handleManualVerify} noValidate>
                  <div className="verify-form-header">
                    <ShieldCheck className="verify-form-header-icon" size={24} />
                    <div>
                      <h3 className="verify-form-title">Manual Verification</h3>
                      <p className="verify-form-sub">Enter the transaction reference and receiving details.</p>
                    </div>
                  </div>

                  <div className="verify-fields-row">
                    <div className="verify-input-group">
                      <label htmlFor="txn-ref" className="verify-label">
                        Transaction Reference <Info size={13} className="verify-label-info" />
                      </label>
                      <input
                        id="txn-ref"
                        type="text"
                        className="verify-input"
                        placeholder={
                          provider === 'CBE'
                            ? 'e.g. FT26282ND8WJ'
                            : 'e.g. DJ90KV28YU'
                        }
                        value={txnReference}
                        onChange={(e) => setTxnReference(e.target.value)}
                        autoComplete="off"
                        required
                      />
                    </div>

                    <div className="verify-input-group">
                      <label htmlFor="recv-account" className="verify-label">
                        {provider === 'CBE' ? "Recipient's Account Number" : "Recipient's Phone Number"}{' '}
                        <Info size={13} className="verify-label-info" />
                      </label>
                      <input
                        id="recv-account"
                        type={provider === 'CBE' ? 'text' : 'tel'}
                        inputMode="numeric"
                        className="verify-input"
                        placeholder={
                          provider === 'CBE'
                            ? 'e.g. 1000076330763'
                            : 'e.g. 0932571087'
                        }
                        value={receivingAccount}
                        onChange={(e) => setReceivingAccount(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <button
                    id="verify-manual-btn"
                    type="submit"
                    className="verify-submit-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <><Loader2 size={18} className="verify-spinner" /> Verifying…</>
                    ) : (
                      <><Search size={18} /> Verify Payment</>
                    )}
                  </button>

                  {/* Trust pills */}
                  <div className="verify-trust-row">
                    <div className="verify-trust-item">
                      <Zap size={14} className="verify-trust-icon" />
                      <span>Fast · seconds</span>
                    </div>
                    <div className="verify-trust-divider" />
                    <div className="verify-trust-item">
                      <ShieldCheck size={14} className="verify-trust-icon" />
                      <span>Official CBE &amp; Telebirr data</span>
                    </div>
                    <div className="verify-trust-divider" />
                    <div className="verify-trust-item">
                      <Lock size={14} className="verify-trust-icon" />
                      <span>Secure &amp; private</span>
                    </div>
                  </div>
                </form>
              )}

              {/* Image Upload */}
              {activeTab === 'image' && (
                <form className="card verify-form" onSubmit={handleImageVerify} noValidate>
                  <div className="verify-form-header">
                    <ShieldCheck className="verify-form-header-icon" size={24} />
                    <div>
                      <h3 className="verify-form-title">
                        Upload your {provider === 'TELEBIRR' ? 'Telebirr' : 'CBE'} Receipt
                      </h3>
                      <p className="verify-form-sub">
                        {provider === 'CBE'
                          ? 'Upload a screenshot or photo with a clear QR code.'
                          : 'Upload a screenshot showing the Telebirr transaction ID.'}
                      </p>
                    </div>
                  </div>

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelected(file);
                    }}
                  />

                  {/* Dropzone */}
                  {!selectedFile ? (
                    <div
                      className={`verify-dropzone${isDragging ? ' dragging' : ''}`}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onClick={() => fileInputRef.current?.click()}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                      aria-label="Upload receipt image"
                    >
                      <UploadCloud size={40} className="verify-dropzone-icon" />
                      <p className="verify-dropzone-title">Drag &amp; drop your receipt here</p>
                      <p className="verify-dropzone-or">or</p>
                      <button
                        type="button"
                        className="verify-dropzone-btn"
                        onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                      >
                        <UploadCloud size={14} /> Choose File
                      </button>
                      <p className="verify-dropzone-hint">JPG, PNG, WebP or PDF · max 12 MB</p>
                    </div>
                  ) : (
                    <div className="verify-file-preview">
                      {previewUrl ? (
                        <img src={previewUrl} alt="Receipt preview" className="verify-preview-img" />
                      ) : (
                        <div className="verify-preview-pdf">
                          <FileImage size={36} />
                          <span>PDF — {selectedFile.name}</span>
                        </div>
                      )}
                      <div className="verify-preview-meta">
                        <div className="verify-preview-filename">{selectedFile.name}</div>
                        <div className="verify-preview-filesize">
                          {(selectedFile.size / 1024).toFixed(0)} KB
                        </div>
                      </div>
                      <button
                        type="button"
                        className="verify-preview-remove"
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl(null);
                          setError('');
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        aria-label="Remove file"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}

                  {/* What we extract */}
                  <div className="verify-extract-list">
                    <h4 className="verify-extract-title">What we extract from your receipt</h4>
                    <ul>
                      {[
                        'Transaction reference (FT... / DJ...)',
                        'Amount transferred',
                        'Date & time of transaction',
                        `Recipient ${provider === 'CBE' ? 'account number' : 'phone number'}`,
                        'Transaction status',
                      ].map((item) => (
                        <li key={item}>
                          <Check size={13} className="verify-extract-check" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    id="verify-image-btn"
                    type="submit"
                    className="verify-submit-btn"
                    disabled={isLoading || !selectedFile}
                  >
                    {isLoading ? (
                      <><Loader2 size={18} className="verify-spinner" /> Verifying…</>
                    ) : (
                      <><ShieldCheck size={18} /> Verify Receipt</>
                    )}
                  </button>
                </form>
              )}
            </>
          )}

          {/* Bottom trust banner */}
          <div className="verify-trust-banner">
            <div className="verify-trust-banner-left">
              <div className="verify-trust-banner-icon">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h4 className="verify-trust-banner-title">Safe &amp; Trusted</h4>
                <p className="verify-trust-banner-sub">
                  We verify payments using official CBE and Telebirr data. Your information is always secure.
                </p>
              </div>
            </div>
            <div className="verify-trust-banner-badge">
              <ShieldCheck size={11} /> Powered by <strong>PayCheck</strong>
            </div>
          </div>
        </div>

        {/* ── Right Sidebar ── */}
        <div className="dashboard-side verify-sidebar">

          <div className="card verify-sidebar-promo">
            <div className="verify-promo-graphic">
              <div className="verify-promo-phone">
                <div className="verify-promo-phone-inner" />
              </div>
            </div>
            <h3 className="verify-promo-title">Stop Fake Payments</h3>
            <p className="verify-promo-sub">
              Don't trust the screenshot. Verify the payment before releasing the product or service.
            </p>
          </div>

          <div className="card">
            <h3 className="verify-sidebar-section-title">Supported Providers</h3>
            <div className="verify-provider-list">
              <div className="verify-provider-item">
                <div className="verify-provider-logo cbe">CB</div>
                <div>
                  <div className="verify-provider-name">CBE</div>
                  <div className="verify-provider-desc">Commercial Bank of Ethiopia</div>
                </div>
              </div>
              <div className="verify-provider-item">
                <div className="verify-provider-logo telebirr">t</div>
                <div>
                  <div className="verify-provider-name">Telebirr</div>
                  <div className="verify-provider-desc">Ethiopian Mobile Money</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card verify-help-card">
            <div className="verify-help-header">
              <div className="verify-help-icon">
                <Headset size={20} />
              </div>
              <h3 className="verify-sidebar-section-title" style={{ margin: 0 }}>Need help?</h3>
            </div>
            <p className="verify-help-sub">
              Our support team is available 24/7 to assist you with any verification issues.
            </p>
            <button className="btn btn-outline verify-help-btn">
              Contact Support →
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
