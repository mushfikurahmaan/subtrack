'use client';

import { useState, useEffect, useCallback } from 'react';
import { Subscription } from '@/types';

const STORAGE_KEY = 'subtrack_subscriptions';

const DEMO_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'demo-1',
    name: 'Spotify',
    icon: '🎵',
    color: '#1DB954',
    amount: 9.99,
    currency: 'USD',
    billingCycle: 'monthly',
    billingDay: 11,
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 11).toISOString(),
  },
  {
    id: 'demo-2',
    name: 'Netflix',
    icon: '🎬',
    color: '#E50914',
    amount: 15.99,
    currency: 'USD',
    billingCycle: 'monthly',
    billingDay: 22,
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 22).toISOString(),
  },
  {
    id: 'demo-3',
    name: 'ChatGPT Plus',
    icon: '🤖',
    color: '#10a37f',
    amount: 20.00,
    currency: 'USD',
    billingCycle: 'monthly',
    billingDay: 17,
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 17).toISOString(),
  },
  {
    id: 'demo-4',
    name: 'Notion',
    icon: '📝',
    color: '#ffffff',
    amount: 15.99,
    currency: 'USD',
    billingCycle: 'yearly',
    billingDay: 11,
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 11).toISOString(),
  },
  {
    id: 'demo-5',
    name: 'Perplexity',
    icon: '🔍',
    color: '#20B2AA',
    amount: 16.99,
    currency: 'USD',
    billingCycle: 'monthly',
    billingDay: 11,
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 11).toISOString(),
  },
];

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSubscriptions(JSON.parse(stored));
      } else {
        setSubscriptions(DEMO_SUBSCRIPTIONS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_SUBSCRIPTIONS));
      }
    } catch {
      setSubscriptions(DEMO_SUBSCRIPTIONS);
    }
    setIsLoaded(true);
  }, []);

  const save = useCallback((updated: Subscription[]) => {
    setSubscriptions(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Storage might be unavailable
    }
  }, []);

  const addSubscription = useCallback(
    (sub: Omit<Subscription, 'id'>) => {
      const newSub: Subscription = {
        ...sub,
        id: `sub-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      };
      save([...subscriptions, newSub]);
      return newSub;
    },
    [subscriptions, save]
  );

  const updateSubscription = useCallback(
    (id: string, updates: Partial<Subscription>) => {
      save(subscriptions.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    },
    [subscriptions, save]
  );

  const deleteSubscription = useCallback(
    (id: string) => {
      save(subscriptions.filter((s) => s.id !== id));
    },
    [subscriptions, save]
  );

  return {
    subscriptions,
    isLoaded,
    addSubscription,
    updateSubscription,
    deleteSubscription,
  };
}
