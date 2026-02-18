'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2, Edit2 } from 'lucide-react';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useTheme } from '@/hooks/useTheme';
import { formatMonthYear, navigateMonth } from '@/lib/calendarUtils';
import { getMonthlyTotal, formatCurrency } from '@/lib/subscriptionUtils';
import { CalendarGrid } from './CalendarGrid';
import { AddSubscriptionModal } from './AddSubscriptionModal';
import { ThemeToggle } from './ThemeToggle';
import { Subscription } from '@/types';

export function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [showModal, setShowModal] = useState(false);
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);
  const [showManage, setShowManage] = useState(false);

  const { subscriptions, isLoaded, addSubscription, updateSubscription, deleteSubscription } =
    useSubscriptions();
  const { theme, toggleTheme } = useTheme();

  const navigate = (direction: 'prev' | 'next') => {
    const next = navigateMonth(year, month, direction);
    setYear(next.year);
    setMonth(next.month);
  };

  const monthTotal = getMonthlyTotal(subscriptions, year, month);

  const handleEdit = (sub: Subscription) => {
    setEditingSub(sub);
    setShowModal(true);
    setShowManage(false);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '32px 16px',
      }}
    >
      <div style={{ width: '100%', maxWidth: '960px' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '24px',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          {/* Left: Month + navigation */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              <button
                onClick={() => navigate('prev')}
                aria-label="Previous month"
                className="btn-icon"
              >
                <ChevronLeft size={20} />
              </button>
              <h1
                style={{
                  fontSize: 'clamp(24px, 4vw, 36px)',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                }}
              >
                {formatMonthYear(year, month)}
              </h1>
              <button
                onClick={() => navigate('next')}
                aria-label="Next month"
                className="btn-icon"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="color-dot color-dot-monthly" style={{ width: '8px', height: '8px' }} />
                <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Monthly</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="color-dot color-dot-yearly" style={{ width: '8px', height: '8px' }} />
                <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Yearly</span>
              </div>
            </div>
          </div>

          {/* Right: Total + actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span
              style={{
                color: 'var(--text-secondary)',
                fontSize: '15px',
              }}
            >
              Total:{' '}
              <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '16px' }}>
                {formatCurrency(monthTotal, 'USD')}
              </span>
            </span>

            <ThemeToggle theme={theme} onToggle={toggleTheme} />

            <button
              onClick={() => setShowManage(!showManage)}
              aria-label="Manage subscriptions"
              className="btn-ghost"
              style={{
                height: '38px',
                padding: '0 14px',
                fontSize: '13px',
                color: showManage ? 'var(--text-primary)' : undefined,
              }}
            >
              <Edit2 size={14} />
              Manage
            </button>

            <button
              onClick={() => { setEditingSub(null); setShowModal(true); }}
              className="btn-primary"
              style={{ height: '38px', padding: '0 16px' }}
            >
              <Plus size={16} />
              Add Subscription
            </button>
          </div>
        </div>

        {/* Manage panel */}
        {showManage && subscriptions.length > 0 && (
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: '0px',
              padding: '16px',
              marginBottom: '20px',
            }}
          >
            <h3
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '12px',
              }}
            >
              All Subscriptions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {subscriptions.map((sub) => (
                <div
                  key={sub.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    backgroundColor: 'var(--bg-cell)',
                    borderRadius: '0px',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{sub.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: 500 }}>
                      {sub.name}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                      {formatCurrency(sub.amount, sub.currency)} · {sub.billingCycle} · day {sub.billingDay}
                    </div>
                  </div>
                  <span
                    className={`color-dot ${sub.billingCycle === 'monthly' ? 'color-dot-monthly' : 'color-dot-yearly'}`}
                    style={{ width: '8px', height: '8px' }}
                  />
                  <button
                    onClick={() => handleEdit(sub)}
                    aria-label={`Edit ${sub.name}`}
                    className="btn-icon"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => deleteSubscription(sub.id)}
                    aria-label={`Delete ${sub.name}`}
                    className="btn-danger"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {showManage && subscriptions.length === 0 && (
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: '0px',
              padding: '24px',
              marginBottom: '20px',
              textAlign: 'center',
              color: 'var(--text-secondary)',
              fontSize: '14px',
            }}
          >
            No subscriptions yet. Add one to get started!
          </div>
        )}

        {/* Calendar */}
        {isLoaded && (
          <CalendarGrid year={year} month={month} subscriptions={subscriptions} />
        )}

        {/* Loading skeleton */}
        {!isLoaded && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '8px',
            }}
          >
            {Array.from({ length: 35 }).map((_, i) => (
              <div
                key={i}
                style={{
                  aspectRatio: '1',
                  borderRadius: '0px',
                  backgroundColor: 'var(--bg-cell)',
                  opacity: 0.5,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <AddSubscriptionModal
          onClose={() => { setShowModal(false); setEditingSub(null); }}
          onAdd={addSubscription}
          editSubscription={editingSub}
          onUpdate={updateSubscription}
        />
      )}
    </div>
  );
}
