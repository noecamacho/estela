import { describe, it, expect } from 'vitest';
import { es, en, getTranslations } from '../i18n/translations';

describe('translations', () => {
  it('getTranslations returns Spanish translations', () => {
    expect(getTranslations('es')).toBe(es);
  });

  it('getTranslations returns English translations', () => {
    expect(getTranslations('en')).toBe(en);
  });

  it('both languages have the same top-level keys', () => {
    expect(Object.keys(es).sort()).toEqual(Object.keys(en).sort());
  });

  it('common.add is a function in both languages', () => {
    expect(es.common.add('Test')).toBe('Agregar test');
    expect(en.common.add('Test')).toBe('Add test');
  });

  it('time.dateFormat is a function in both languages', () => {
    const parts = {
      prefix: '',
      day: 'Monday',
      date: 1,
      month: 'January',
      year: 2026,
      time: '10:00am',
    };
    expect(typeof es.time.dateFormat(parts)).toBe('string');
    expect(typeof en.time.dateFormat(parts)).toBe('string');
  });

  it('time arrays have correct lengths', () => {
    expect(es.time.days).toHaveLength(7);
    expect(es.time.months).toHaveLength(12);
    expect(en.time.days).toHaveLength(7);
    expect(en.time.months).toHaveLength(12);
  });

  it('Spanish format includes "de" separator', () => {
    const result = es.time.dateFormat({
      prefix: 'Hoy — ',
      day: 'Lunes',
      date: 5,
      month: 'enero',
      year: 2026,
      time: '3:00pm',
    });
    expect(result).toContain('de');
    expect(result).toContain('Hoy');
  });

  it('English format uses month-date order', () => {
    const result = en.time.dateFormat({
      prefix: '',
      day: 'Monday',
      date: 5,
      month: 'January',
      year: 2026,
      time: '3:00pm',
    });
    expect(result).toContain('January 5');
  });
});
