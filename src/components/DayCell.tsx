'use client';

import { useState, useRef } from 'react';
import { Subscription } from '@/types';
import { isCurrentDay } from '@/lib/calendarUtils';
import { DayPopup } from './DayPopup';

interface DayCellProps {
  date: Date | null;
  subscriptions: Subscription[];
  rowIndex: number;
  totalRows: number;
}

export function DayCell({ date, subscriptions, rowIndex, totalRows }: DayCellProps) {
  const [hovered, setHovered] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (!date) {
    return <div style={{ aspectRatio: '1' }} />;
  }

  const isToday = isCurrentDay(date);
  const day = date.getDate();
  const hasSubscriptions = subscriptions.length > 0;
  const visibleSubs = subscriptions.slice(0, 2);
  const overflowCount = subscriptions.length - 2;
  const popupPosition = rowIndex >= totalRows - 2 ? 'top' : 'bottom';

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (hasSubscriptions) setHovered(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setHovered(false), 100);
  };

  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        style={{
          aspectRatio: '1',
          borderRadius: '0px',
          backgroundColor: isToday
            ? 'var(--bg-cell-today)'
            : hovered && hasSubscriptions
            ? 'var(--bg-cell-hover)'
            : 'var(--bg-cell)',
          display: 'flex',
          flexDirection: 'column',
          padding: '10px',
          cursor: hasSubscriptions ? 'pointer' : 'default',
          transition: 'background-color 0.15s ease',
          overflow: 'hidden',
          minHeight: '80px',
          border: isToday ? '1px solid var(--border-color)' : '1px solid transparent',
        }}
      >
        {/* Day number */}
        <div
          style={{
            fontSize: '14px',
            fontWeight: isToday ? 600 : 400,
            color: isToday ? 'var(--text-primary)' : 'var(--text-secondary)',
            lineHeight: 1,
            marginBottom: hasSubscriptions ? '8px' : 0,
          }}
        >
          {day}
        </div>

        {/* Subscription icons */}
        {hasSubscriptions && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              flex: 1,
              justifyContent: 'flex-end',
            }}
          >
            {visibleSubs.map((sub) => (
              <div
                key={sub.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <span style={{ fontSize: '14px', lineHeight: 1 }}>{sub.icon}</span>
                <span
                  className={`color-dot ${sub.billingCycle === 'monthly' ? 'color-dot-monthly' : 'color-dot-yearly'}`}
                  style={{ width: '6px', height: '6px' }}
                />
              </div>
            ))}
            {overflowCount > 0 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span
                  style={{
                    fontSize: '10px',
                    color: 'var(--text-secondary)',
                    backgroundColor: 'var(--bg-surface)',
                    borderRadius: '4px',
                    padding: '1px 4px',
                    fontWeight: 600,
                  }}
                >
                  +{overflowCount}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Popup */}
      {hovered && hasSubscriptions && (
        <DayPopup subscriptions={subscriptions} position={popupPosition} />
      )}
    </div>
  );
}
