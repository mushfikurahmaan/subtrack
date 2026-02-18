'use client';

import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { Subscription } from '@/types';
import { POPULAR_SERVICES, EMOJI_OPTIONS } from '@/lib/subscriptionUtils';

interface AddSubscriptionModalProps {
  onClose: () => void;
  onAdd: (sub: Omit<Subscription, 'id'>) => void;
  editSubscription?: Subscription | null;
  onUpdate?: (id: string, updates: Partial<Subscription>) => void;
}

export function AddSubscriptionModal({
  onClose,
  onAdd,
  editSubscription,
  onUpdate,
}: AddSubscriptionModalProps) {
  const [step, setStep] = useState<'service' | 'details'>(editSubscription ? 'details' : 'service');
  const [name, setName] = useState(editSubscription?.name ?? '');
  const [icon, setIcon] = useState(editSubscription?.icon ?? '⭐');
  const [color, setColor] = useState(editSubscription?.color ?? '#8B5CF6');
  const [amount, setAmount] = useState(editSubscription?.amount?.toString() ?? '');
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'GBP'>(editSubscription?.currency ?? 'USD');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(editSubscription?.billingCycle ?? 'monthly');
  const [billingDay, setBillingDay] = useState(editSubscription?.billingDay?.toString() ?? '1');
  const [customEmoji, setCustomEmoji] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const selectService = (service: (typeof POPULAR_SERVICES)[0]) => {
    setName(service.name);
    setIcon(service.icon);
    setColor(service.color);
    setAmount(service.defaultAmount.toString());
    setStep('details');
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Name is required';
    const amtNum = parseFloat(amount);
    if (isNaN(amtNum) || amtNum <= 0) errs.amount = 'Enter a valid amount';
    const dayNum = parseInt(billingDay);
    if (isNaN(dayNum) || dayNum < 1 || dayNum > 31) errs.billingDay = 'Day must be 1–31';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const dayNum = parseInt(billingDay);
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), dayNum).toISOString();

    if (editSubscription && onUpdate) {
      onUpdate(editSubscription.id, {
        name,
        icon,
        color,
        amount: parseFloat(amount),
        currency,
        billingCycle,
        billingDay: dayNum,
        startDate,
      });
    } else {
      onAdd({
        name,
        icon,
        color,
        amount: parseFloat(amount),
        currency,
        billingCycle,
        billingDay: dayNum,
        startDate,
      });
    }
    onClose();
  };

  const currencySymbols: Record<string, string> = { USD: '$', EUR: '€', GBP: '£' };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-panel">
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {editSubscription ? 'Edit Subscription' : step === 'service' ? 'Choose Service' : 'Subscription Details'}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-cell)',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {step === 'service' && !editSubscription ? (
            <div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '8px',
                  marginBottom: '16px',
                }}
              >
                {POPULAR_SERVICES.map((service) => (
                  <button
                    key={service.name}
                    onClick={() => selectService(service)}
                    className="service-btn"
                  >
                    <span style={{ fontSize: '20px' }}>{service.icon}</span>
                    <span style={{ fontSize: '13px', fontWeight: 500 }}>{service.name}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep('details')}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: 'transparent',
                  border: '1px dashed var(--border-color)',
                  borderRadius: '12px',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                + Enter manually
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Icon + Name */}
              <div>
                <label className="form-label">Icon & Name</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setCustomEmoji(!customEmoji)}
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '10px',
                      backgroundColor: `${color}22`,
                      border: `1px solid ${color}44`,
                      fontSize: '22px',
                      cursor: 'pointer',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {icon}
                  </button>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Subscription name"
                    className="form-input"
                    style={{ flex: 1 }}
                  />
                </div>
                {errors.name && <p className="form-error">{errors.name}</p>}
                {customEmoji && (
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '6px',
                      marginTop: '10px',
                      backgroundColor: 'var(--bg-cell)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '10px',
                    }}
                  >
                    {EMOJI_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => { setIcon(emoji); setCustomEmoji(false); }}
                        style={{
                          fontSize: '20px',
                          background: icon === emoji ? 'var(--bg-cell-hover)' : 'none',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          padding: '4px 6px',
                        }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Color */}
              <div>
                <label className="form-label">Brand Color</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    style={{
                      width: '48px',
                      height: '40px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      cursor: 'pointer',
                      backgroundColor: 'transparent',
                      padding: '2px',
                    }}
                  />
                  <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{color}</span>
                </div>
              </div>

              {/* Amount + Currency */}
              <div>
                <label className="form-label">Amount</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as 'USD' | 'EUR' | 'GBP')}
                    className="form-input"
                    style={{ width: '80px', flexShrink: 0 }}
                  >
                    {(['USD', 'EUR', 'GBP'] as const).map((c) => (
                      <option key={c} value={c}>{currencySymbols[c]} {c}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="form-input"
                    style={{ flex: 1 }}
                  />
                </div>
                {errors.amount && <p className="form-error">{errors.amount}</p>}
              </div>

              {/* Billing Cycle */}
              <div>
                <label className="form-label">Billing Cycle</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {(['monthly', 'yearly'] as const).map((cycle) => (
                    <button
                      key={cycle}
                      onClick={() => setBillingCycle(cycle)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '10px',
                        border: '1px solid',
                        borderColor: billingCycle === cycle
                          ? (cycle === 'monthly' ? 'var(--color-accent-monthly)' : 'var(--color-accent-yearly)')
                          : 'var(--border-color)',
                        backgroundColor: billingCycle === cycle
                          ? (cycle === 'monthly' ? 'var(--color-accent-monthly-subtle)' : 'var(--color-accent-yearly-subtle)')
                          : 'var(--bg-cell)',
                        color: billingCycle === cycle
                          ? (cycle === 'monthly' ? 'var(--color-accent-monthly)' : 'var(--color-accent-yearly)')
                          : 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: billingCycle === cycle ? 600 : 400,
                        textTransform: 'capitalize',
                        transition: 'all 0.15s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      <span
                        className={`color-dot ${cycle === 'monthly' ? 'color-dot-monthly' : 'color-dot-yearly'}`}
                        style={{ width: '8px', height: '8px' }}
                      />
                      {cycle}
                    </button>
                  ))}
                </div>
              </div>

              {/* Billing Day */}
              <div>
                <label className="form-label">
                  {billingCycle === 'monthly' ? 'Billing Day (1–31)' : 'Billing Day of Month (1–31)'}
                </label>
                <input
                  type="number"
                  value={billingDay}
                  onChange={(e) => setBillingDay(e.target.value)}
                  min="1"
                  max="31"
                  className="form-input"
                />
                {errors.billingDay && <p className="form-error">{errors.billingDay}</p>}
                {billingCycle === 'yearly' && (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '4px' }}>
                    For yearly billing, the month is based on today&apos;s month.
                  </p>
                )}
              </div>

              {/* Back to service picker */}
              {!editSubscription && (
                <button
                  onClick={() => setStep('service')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    fontSize: '13px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    padding: 0,
                  }}
                >
                  ← Back to service list
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {(step === 'details' || editSubscription) && (
          <div
            style={{
              padding: '16px 24px',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              gap: '10px',
            }}
          >
            <button
              onClick={onClose}
              className="btn-ghost"
              style={{ flex: 1, padding: '12px', borderRadius: '12px', fontSize: '14px' }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="btn-primary"
              style={{ flex: 2, padding: '12px', borderRadius: '12px' }}
            >
              {editSubscription ? 'Save Changes' : 'Add Subscription'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
