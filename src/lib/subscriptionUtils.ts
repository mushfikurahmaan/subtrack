import { Subscription, PopularService } from '@/types';

export function getSubscriptionsForDay(
  subscriptions: Subscription[],
  day: number,
  year: number,
  month: number
): Subscription[] {
  return subscriptions.filter((sub) => {
    const startDate = new Date(sub.startDate);
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth();

    if (sub.billingCycle === 'monthly') {
      // Check subscription hasn't ended before this month
      if (year < startYear || (year === startYear && month < startMonth)) {
        return false;
      }
      return sub.billingDay === day;
    }

    if (sub.billingCycle === 'yearly') {
      const billingMonth = startDate.getMonth();
      const billingDay = startDate.getDate();
      // Check year hasn't passed before start
      if (year < startYear) return false;
      return month === billingMonth && day === billingDay;
    }

    return false;
  });
}

export function getMonthlyTotal(
  subscriptions: Subscription[],
  year: number,
  month: number
): number {
  return subscriptions.reduce((total, sub) => {
    const startDate = new Date(sub.startDate);
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth();

    if (sub.billingCycle === 'monthly') {
      if (year < startYear || (year === startYear && month < startMonth)) {
        return total;
      }
      return total + sub.amount;
    }

    if (sub.billingCycle === 'yearly') {
      const billingMonth = startDate.getMonth();
      if (year < startYear) return total;
      if (month === billingMonth) return total + sub.amount;
      return total;
    }

    return total;
  }, 0);
}

export function formatCurrency(amount: number, currency: string): string {
  const symbols: Record<string, string> = { USD: '$', EUR: '€', GBP: '£' };
  const symbol = symbols[currency] || '$';
  return `${symbol}${amount.toFixed(2)}`;
}

export const POPULAR_SERVICES: PopularService[] = [
  { name: 'Spotify', icon: '🎵', color: '#1DB954', defaultAmount: 9.99 },
  { name: 'Netflix', icon: '🎬', color: '#E50914', defaultAmount: 15.99 },
  { name: 'YouTube Premium', icon: '▶️', color: '#FF0000', defaultAmount: 13.99 },
  { name: 'Apple Music', icon: '🎧', color: '#FA2D48', defaultAmount: 10.99 },
  { name: 'Disney+', icon: '✨', color: '#113CCF', defaultAmount: 10.99 },
  { name: 'HBO Max', icon: '📺', color: '#5822B4', defaultAmount: 15.99 },
  { name: 'Amazon Prime', icon: '📦', color: '#FF9900', defaultAmount: 14.99 },
  { name: 'ChatGPT Plus', icon: '🤖', color: '#10a37f', defaultAmount: 20.00 },
  { name: 'Notion', icon: '📝', color: '#ffffff', defaultAmount: 15.99 },
  { name: 'Figma', icon: '🎨', color: '#F24E1E', defaultAmount: 15.00 },
  { name: 'GitHub', icon: '🐙', color: '#333333', defaultAmount: 10.00 },
  { name: 'Adobe CC', icon: '🅰️', color: '#FF0000', defaultAmount: 54.99 },
  { name: 'Perplexity', icon: '🔍', color: '#20B2AA', defaultAmount: 16.99 },
  { name: 'Cursor', icon: '⚡', color: '#6B6BFF', defaultAmount: 20.00 },
  { name: 'iCloud', icon: '☁️', color: '#3478F6', defaultAmount: 2.99 },
  { name: 'Google One', icon: '🔵', color: '#4285F4', defaultAmount: 2.99 },
  { name: 'Dropbox', icon: '📂', color: '#0061FF', defaultAmount: 11.99 },
  { name: 'Slack', icon: '💬', color: '#4A154B', defaultAmount: 7.25 },
  { name: 'Linear', icon: '📐', color: '#5E6AD2', defaultAmount: 8.00 },
  { name: 'Custom', icon: '⭐', color: '#8B5CF6', defaultAmount: 0 },
];

export const EMOJI_OPTIONS = [
  '⭐', '🔥', '💎', '🚀', '🎯', '🎮', '📱', '💻', '🎵', '🎬',
  '📚', '✏️', '🏃', '🍕', '☕', '🌟', '💡', '🔑', '🛡️', '⚡',
  '🎨', '🤖', '📊', '🔮', '🧩', '🌈', '🏆', '💪', '🎁', '🔔',
];
