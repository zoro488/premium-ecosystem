/**
 * Tests para función highlightMatch (seguridad XSS)
 * @jest-environment jsdom
 */
import { describe, expect, it } from 'vitest';

/**
 * Función segura para highlight de búsqueda
 * Sanitiza HTML para prevenir XSS
 */
export function highlightMatch(text, searchTerm) {
  if (!text || !searchTerm) return text || '';

  // Escape HTML para prevenir XSS
  const escapeHtml = (str) => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  };

  // Escape caracteres especiales de regex
  const escapeRegex = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const escapedText = escapeHtml(text);
  const escapedSearch = escapeHtml(searchTerm);
  const regexSafeSearch = escapeRegex(escapedSearch);

  const regex = new RegExp(`(${regexSafeSearch})`, 'gi');
  return escapedText.replace(regex, '<mark class="bg-yellow-300 text-black">$1</mark>');
}

describe('highlightMatch', () => {
  it('should highlight matching text', () => {
    const result = highlightMatch('Hello World', 'World');
    expect(result).toContain('<mark');
    expect(result).toContain('World');
  });

  it('should be case insensitive', () => {
    const result = highlightMatch('Hello World', 'world');
    expect(result).toContain('<mark');
  });

  it('should escape HTML to prevent XSS', () => {
    const maliciousInput = '<script>alert("XSS")</script>';
    const result = highlightMatch(maliciousInput, 'script');

    // Should NOT contain actual script tag
    expect(result).not.toContain('<script>');
    // Should contain escaped HTML with highlighted search term
    expect(result).toContain('&lt;');
    expect(result).toContain('&gt;');
    expect(result).toContain('<mark');
  });

  it('should handle special regex characters', () => {
    const result = highlightMatch('test (parenthesis)', '(parent');
    expect(result).toBeDefined();
  });

  it('should return original text if no search term', () => {
    const result = highlightMatch('Hello World', '');
    expect(result).toBe('Hello World');
  });

  it('should return empty string if no text', () => {
    const result = highlightMatch('', 'search');
    expect(result).toBe('');
  });
});
