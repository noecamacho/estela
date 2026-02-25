import { describe, it, expect, vi, afterEach } from 'vitest';
import { formatDate, toLocalInput } from '../lib/date-utils';
import { es, en } from '../i18n/translations';

const mockTimestamp = (date: Date) => ({
  toDate: () => date,
  seconds: date.getTime() / 1000,
  nanoseconds: 0,
});

vi.mock('firebase/firestore', () => ({
  Timestamp: {
    now: () => ({ seconds: Date.now() / 1000, nanoseconds: 0 }),
    fromDate: (d: Date) => ({
      toDate: () => d,
      seconds: d.getTime() / 1000,
      nanoseconds: 0,
    }),
  },
}));

describe('date-utils', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  describe('formatDate', () => {
    it('formats a date with Spanish translations', () => {
      const date = new Date(2026, 0, 15, 14, 30);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = formatDate(mockTimestamp(date) as any, es);
      expect(result).toContain('Jueves');
      expect(result).toContain('15');
      expect(result).toContain('enero');
      expect(result).toContain('2026');
      expect(result).toContain('2:30pm');
    });

    it('formats a date with English translations', () => {
      const date = new Date(2026, 0, 15, 14, 30);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = formatDate(mockTimestamp(date) as any, en);
      expect(result).toContain('Thursday');
      expect(result).toContain('15');
      expect(result).toContain('January');
      expect(result).toContain('2:30pm');
    });

    it('shows "Hoy" prefix for today in Spanish', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 5, 10, 12, 0));
      const today = new Date(2026, 5, 10, 9, 0);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = formatDate(mockTimestamp(today) as any, es);
      expect(result).toContain('Hoy');
    });

    it('shows "Ayer" prefix for yesterday in Spanish', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 5, 10, 12, 0));
      const yesterday = new Date(2026, 5, 9, 15, 0);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = formatDate(mockTimestamp(yesterday) as any, es);
      expect(result).toContain('Ayer');
    });

    it('shows "Today" prefix for today in English', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 5, 10, 12, 0));
      const today = new Date(2026, 5, 10, 9, 0);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = formatDate(mockTimestamp(today) as any, en);
      expect(result).toContain('Today');
    });

    it('shows no prefix for older dates', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 5, 10, 12, 0));
      const oldDate = new Date(2026, 5, 5, 9, 0);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = formatDate(mockTimestamp(oldDate) as any, es);
      expect(result).not.toContain('Hoy');
      expect(result).not.toContain('Ayer');
    });

    it('formats AM times correctly', () => {
      const date = new Date(2026, 0, 15, 9, 5);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = formatDate(mockTimestamp(date) as any, es);
      expect(result).toContain('9:05am');
    });

    it('formats 12pm correctly (noon)', () => {
      const date = new Date(2026, 0, 15, 12, 0);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = formatDate(mockTimestamp(date) as any, es);
      expect(result).toContain('12:00pm');
    });

    it('formats midnight as 12am', () => {
      const date = new Date(2026, 0, 15, 0, 0);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = formatDate(mockTimestamp(date) as any, es);
      expect(result).toContain('12:00am');
    });
  });

  describe('toLocalInput', () => {
    it('converts timestamp to datetime-local format', () => {
      const date = new Date(2026, 0, 5, 9, 7);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = toLocalInput(mockTimestamp(date) as any);
      expect(result).toBe('2026-01-05T09:07');
    });

    it('pads single-digit values', () => {
      const date = new Date(2026, 2, 3, 4, 5);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = toLocalInput(mockTimestamp(date) as any);
      expect(result).toBe('2026-03-03T04:05');
    });
  });
});
