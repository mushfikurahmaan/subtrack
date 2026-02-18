'use client';

import { Subscription } from '@/types';
import { getCalendarDays } from '@/lib/calendarUtils';
import { getSubscriptionsForDay } from '@/lib/subscriptionUtils';
import { DayCell } from './DayCell';

const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

interface CalendarGridProps {
  year: number;
  month: number;
  subscriptions: Subscription[];
}

export function CalendarGrid({ year, month, subscriptions }: CalendarGridProps) {
  const cells = getCalendarDays(year, month);
  const totalRows = Math.ceil(cells.length / 7);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* Weekday headers */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '8px',
        }}
      >
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            style={{
              textAlign: 'center',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--text-muted)',
              padding: '10px 0',
              backgroundColor: 'var(--bg-cell)',
              borderRadius: '0px',
              letterSpacing: '0.05em',
            }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '8px',
        }}
      >
        {cells.map((date, index) => {
          const rowIndex = Math.floor(index / 7);
          const daySubs = date
            ? getSubscriptionsForDay(subscriptions, date.getDate(), year, month)
            : [];

          return (
            <DayCell
              key={index}
              date={date}
              subscriptions={daySubs}
              rowIndex={rowIndex}
              totalRows={totalRows}
            />
          );
        })}
      </div>
    </div>
  );
}
