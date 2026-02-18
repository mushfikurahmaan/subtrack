import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  format,
  isToday,
  isSameMonth,
  addMonths,
  subMonths,
} from 'date-fns';

export function getCalendarDays(year: number, month: number): (Date | null)[] {
  const firstDay = startOfMonth(new Date(year, month, 1));
  const lastDay = endOfMonth(firstDay);
  const days = eachDayOfInterval({ start: firstDay, end: lastDay });

  // getDay returns 0=Sun … 6=Sat; we want 0=Mon … 6=Sun
  let startWeekday = getDay(firstDay); // 0=Sun
  startWeekday = startWeekday === 0 ? 6 : startWeekday - 1; // convert to Mon-based

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (const day of days) cells.push(day);

  // Pad to complete the last row
  while (cells.length % 7 !== 0) cells.push(null);

  return cells;
}

export function formatMonthYear(year: number, month: number): string {
  return format(new Date(year, month, 1), 'MMMM, yyyy');
}

export function isCurrentDay(date: Date): boolean {
  return isToday(date);
}

export function navigateMonth(
  year: number,
  month: number,
  direction: 'prev' | 'next'
): { year: number; month: number } {
  const current = new Date(year, month, 1);
  const target = direction === 'next' ? addMonths(current, 1) : subMonths(current, 1);
  return { year: target.getFullYear(), month: target.getMonth() };
}

export { isSameMonth, format };
