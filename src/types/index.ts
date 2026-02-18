export interface Subscription {
  id: string;
  name: string;
  icon: string;
  color: string;
  amount: number;
  currency: 'USD' | 'EUR' | 'GBP';
  billingCycle: 'monthly' | 'yearly';
  billingDay: number;
  startDate: string;
}

export interface PopularService {
  name: string;
  icon: string;
  color: string;
  defaultAmount: number;
}

export type Theme = 'dark' | 'light';
