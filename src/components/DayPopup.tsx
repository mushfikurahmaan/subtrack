'use client';

import { Subscription } from '@/types';
import { formatCurrency } from '@/lib/subscriptionUtils';

interface DayPopupProps {
  subscriptions: Subscription[];
  position: 'top' | 'bottom';
}

export function DayPopup({ subscriptions, position }: DayPopupProps) {
  const total = subscriptions.reduce((sum, s) => sum + s.amount, 0);

  return (
    <div
      className={`day-popup ${position === 'top' ? 'popup-top' : 'popup-bottom'}`}
      style={{
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        ...(position === 'top' ? { bottom: 'calc(100% + 8px)' } : { top: 'calc(100% + 8px)' }),
        zIndex: 50,
        minWidth: '220px',
        maxWidth: '280px',
        backgroundColor: 'var(--popup-bg)',
        border: '1px solid var(--popup-border)',
        borderRadius: '16px',
        boxShadow: 'var(--popup-shadow)',
        padding: '16px',
        pointerEvents: 'none',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {subscriptions.map((sub) => (
          <div
            key={sub.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: `${sub.color}22`,
                border: `1px solid ${sub.color}44`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                flexShrink: 0,
              }}
            >
              {sub.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {sub.name}
              </div>
              <div
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '12px',
                  textTransform: 'capitalize',
                }}
              >
                {sub.billingCycle}
              </div>
            </div>
            <div
              style={{
                color: 'var(--text-primary)',
                fontSize: '14px',
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              {formatCurrency(sub.amount, sub.currency)}
            </div>
          </div>
        ))}
      </div>

      {subscriptions.length > 1 && (
        <>
          <div
            style={{
              height: '1px',
              backgroundColor: 'var(--popup-border)',
              margin: '12px 0',
            }}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Total</span>
            <span style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: 700 }}>
              {total.toFixed(2)}
            </span>
          </div>
        </>
      )}

      {/* Arrow */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          ...(position === 'top'
            ? { bottom: '-6px', borderTop: '6px solid var(--popup-border)', borderLeft: '6px solid transparent', borderRight: '6px solid transparent' }
            : { top: '-6px', borderBottom: '6px solid var(--popup-border)', borderLeft: '6px solid transparent', borderRight: '6px solid transparent' }),
          width: 0,
          height: 0,
        }}
      />
    </div>
  );
}
