import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  formatDate,
  formatDateTime,
  formatDuration,
  formatNumber,
  formatCalories,
  formatDistance,
  formatBloodPressure,
  formatHeartRate,
  calculateBMI,
  getBMICategory,
  debounce,
  throttle,
  generateId,
  capitalize,
  truncate,
  isEmpty,
  getRelativeTime,
  getInitials,
  storage,
} from '../../src/utils/helpers';

describe('Helpers - Date Formatting', () => {
  it('formatDate should format date correctly', () => {
    const date = new Date('2024-03-15');
    const formatted = formatDate(date);
    expect(formatted).toContain('Mar');
    expect(formatted).toContain('15');
    expect(formatted).toContain('2024');
  });

  it('formatDate should handle string date input', () => {
    const dateStr = '2024-12-25';
    const formatted = formatDate(dateStr);
    expect(formatted).toContain('Dec');
    expect(formatted).toContain('25');
    expect(formatted).toContain('2024');
  });

  it('formatDateTime should include time in the output', () => {
    const date = new Date('2024-03-15T14:30:00');
    const formatted = formatDateTime(date);
    expect(formatted).toContain('Mar');
    expect(formatted).toContain('15');
    // Should contain some time representation
    expect(formatted.length).toBeGreaterThan(10);
  });
});

describe('Helpers - Duration Formatting', () => {
  it('formatDuration should handle minutes less than 60', () => {
    expect(formatDuration(30)).toBe('30 min');
    expect(formatDuration(45)).toBe('45 min');
    expect(formatDuration(1)).toBe('1 min');
  });

  it('formatDuration should convert to hours for 60+ minutes', () => {
    expect(formatDuration(60)).toBe('1h');
    expect(formatDuration(120)).toBe('2h');
    expect(formatDuration(90)).toBe('1h 30m');
    expect(formatDuration(150)).toBe('2h 30m');
  });
});

describe('Helpers - Number Formatting', () => {
  it('formatNumber should add commas to large numbers', () => {
    expect(formatNumber(1000)).toBe('1,000');
    expect(formatNumber(1000000)).toBe('1,000,000');
    expect(formatNumber(123456789)).toBe('123,456,789');
  });

  it('formatNumber should handle small numbers without commas', () => {
    expect(formatNumber(100)).toBe('100');
    expect(formatNumber(999)).toBe('999');
  });

  it('formatCalories should format with kcal suffix', () => {
    expect(formatCalories(500)).toBe('500 kcal');
    expect(formatCalories(1500)).toBe('1,500 kcal');
    expect(formatCalories(150.7)).toBe('151 kcal'); // rounds
  });

  it('formatDistance should format correctly', () => {
    expect(formatDistance(5.25)).toBe('5.25 km');
    expect(formatDistance(0.5)).toBe('500 m');
    expect(formatDistance(10)).toBe('10.00 km');
  });
});

describe('Helpers - Medical Formatting', () => {
  it('formatBloodPressure should format systolic/diastolic correctly', () => {
    expect(formatBloodPressure(120, 80)).toBe('120/80 mmHg');
    expect(formatBloodPressure(140, 90)).toBe('140/90 mmHg');
  });

  it('formatHeartRate should format with bpm suffix', () => {
    expect(formatHeartRate(72)).toBe('72 bpm');
    expect(formatHeartRate(100)).toBe('100 bpm');
  });
});

describe('Helpers - BMI Calculations', () => {
  it('calculateBMI should compute correct BMI value', () => {
    // 70kg, 175cm -> BMI ≈ 22.86
    const bmi = calculateBMI(70, 175);
    expect(bmi).toBeCloseTo(22.86, 1);
  });

  it('calculateBMI should handle different body measurements', () => {
    // 90kg, 180cm -> BMI ≈ 27.78
    const bmi = calculateBMI(90, 180);
    expect(bmi).toBeCloseTo(27.78, 1);
  });

  it('getBMICategory should return correct category', () => {
    expect(getBMICategory(17)).toBe('Underweight');
    expect(getBMICategory(22)).toBe('Normal');
    expect(getBMICategory(27)).toBe('Overweight');
    expect(getBMICategory(32)).toBe('Obese');
  });

  it('getBMICategory should handle boundary values', () => {
    expect(getBMICategory(18.4)).toBe('Underweight');
    expect(getBMICategory(18.5)).toBe('Normal');
    expect(getBMICategory(24.9)).toBe('Normal');
    expect(getBMICategory(25)).toBe('Overweight');
    expect(getBMICategory(29.9)).toBe('Overweight');
    expect(getBMICategory(30)).toBe('Obese');
  });
});

describe('Helpers - Debounce and Throttle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('debounce should delay function execution', () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 100);

    debouncedFn();
    debouncedFn();
    debouncedFn();

    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('throttle should limit function calls', () => {
    const fn = vi.fn();
    const throttledFn = throttle(fn, 100);

    throttledFn();
    throttledFn();
    throttledFn();

    expect(fn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);
    throttledFn();

    expect(fn).toHaveBeenCalledTimes(2);
  });
});

describe('Helpers - String Utilities', () => {
  it('generateId should return unique IDs', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
    expect(typeof id1).toBe('string');
    expect(id1.length).toBeGreaterThan(0);
  });

  it('capitalize should capitalize first letter', () => {
    expect(capitalize('hello')).toBe('Hello');
    expect(capitalize('HELLO')).toBe('Hello');
    expect(capitalize('hELLO')).toBe('Hello');
  });

  it('truncate should truncate long strings', () => {
    expect(truncate('Hello World', 5)).toBe('Hello...');
    expect(truncate('Hi', 5)).toBe('Hi');
    expect(truncate('Hello', 5)).toBe('Hello');
  });

  it('getInitials should extract initials from names', () => {
    expect(getInitials('John', 'Doe')).toBe('JD');
    expect(getInitials('Alice')).toBe('A');
    expect(getInitials('jane', 'smith')).toBe('JS');
  });
});

describe('Helpers - isEmpty', () => {
  it('isEmpty should return true for null and undefined', () => {
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty(undefined)).toBe(true);
  });

  it('isEmpty should return true for empty strings', () => {
    expect(isEmpty('')).toBe(true);
    expect(isEmpty('   ')).toBe(true);
  });

  it('isEmpty should return true for empty arrays and objects', () => {
    expect(isEmpty([])).toBe(true);
    expect(isEmpty({})).toBe(true);
  });

  it('isEmpty should return false for non-empty values', () => {
    expect(isEmpty('hello')).toBe(false);
    expect(isEmpty([1, 2, 3])).toBe(false);
    expect(isEmpty({ key: 'value' })).toBe(false);
  });
});

describe('Helpers - getRelativeTime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-03-15T12:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('getRelativeTime should return "Just now" for recent times', () => {
    const recentDate = new Date('2024-03-15T11:59:30');
    expect(getRelativeTime(recentDate)).toBe('Just now');
  });

  it('getRelativeTime should return minutes ago', () => {
    const minutesAgo = new Date('2024-03-15T11:55:00');
    expect(getRelativeTime(minutesAgo)).toBe('5 minutes ago');
  });

  it('getRelativeTime should return hours ago', () => {
    const hoursAgo = new Date('2024-03-15T09:00:00');
    expect(getRelativeTime(hoursAgo)).toBe('3 hours ago');
  });

  it('getRelativeTime should return days ago', () => {
    const daysAgo = new Date('2024-03-13T12:00:00');
    expect(getRelativeTime(daysAgo)).toBe('2 days ago');
  });
});

describe('Helpers - Storage', () => {
  beforeEach(() => {
    // Clear localStorage mock before each test
    vi.restoreAllMocks();
  });

  it('storage.get should return default value when key not found', () => {
    // The storage helper uses localStorage internally
    // When no item exists, it should return the default value
    const result = storage.get('nonexistent-key-123', 'default');
    expect(result).toBe('default');
  });

  it('storage.get should parse JSON from localStorage', () => {
    // Set item directly
    localStorage.setItem('test-parse', '{"key":"value"}');
    const result = storage.get('test-parse', null);
    expect(result).toEqual({ key: 'value' });
    localStorage.removeItem('test-parse');
  });

  it('storage.set should stringify and save to localStorage', () => {
    storage.set('test-set', { key: 'value' });
    const stored = localStorage.getItem('test-set');
    expect(stored).toBe('{"key":"value"}');
    localStorage.removeItem('test-set');
  });

  it('storage.remove should remove item from localStorage', () => {
    localStorage.setItem('test-remove', 'value');
    storage.remove('test-remove');
    const result = localStorage.getItem('test-remove');
    expect(result).toBeNull();
  });
});
