import { formatIconString, removeCSSPrefix } from './IconCombobox';

describe('removeCSSPrefix', () => {
  test('removes css: prefix', () => {
    expect(removeCSSPrefix('css:ti-home')).toBe('ti-home');
  });

  test('returns empty string for undefined', () => {
    expect(removeCSSPrefix(undefined)).toBe('');
  });

  test('returns string unchanged if no prefix', () => {
    expect(removeCSSPrefix('ti-home')).toBe('ti-home');
  });
});

describe('formatIconString', () => {
  test('removes ti- prefix and replaces - with space', () => {
    expect(formatIconString('ti-home-heart')).toBe('home heart');
  });

  test('removes multiple ti- prefixes', () => {
    expect(formatIconString('ti-ti-heart')).toBe('heart');
  });

  test('returns empty string for undefined', () => {
    expect(formatIconString(undefined)).toBe('');
  });

  test('returns empty string for empty input', () => {
    expect(formatIconString('')).toBe('');
  });
});
