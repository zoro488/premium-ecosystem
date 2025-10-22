/**
 * Tests para KPICard component
 */
import { fireEvent, render, screen } from '@testing-library/react';
import { Package } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';

import { KPICard } from './KPICard';

describe('KPICard', () => {
  const defaultProps = {
    title: 'Test KPI',
    value: '1,234',
    icon: Package,
    color: 'blue',
    gradient: 'from-blue-400 to-cyan-500',
    bgGradient: 'from-blue-500/10 to-cyan-500/5',
    change: '+12%',
    description: 'test description',
  };

  it('should render with all props', () => {
    render(<KPICard {...defaultProps} />);

    expect(screen.getByText('Test KPI')).toBeInTheDocument();
    expect(screen.getByText('1,234')).toBeInTheDocument();
    expect(screen.getByText('+12%')).toBeInTheDocument();
    expect(screen.getByText('test description')).toBeInTheDocument();
  });

  it('should call onClick when clickable', () => {
    const handleClick = vi.fn();
    render(<KPICard {...defaultProps} onClick={handleClick} />);

    const card = screen.getByRole('button');
    fireEvent.click(card);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should have proper ARIA label', () => {
    render(<KPICard {...defaultProps} ariaLabel="Custom ARIA label" />);

    expect(screen.getByLabelText('Custom ARIA label')).toBeInTheDocument();
  });

  it('should handle keyboard navigation', () => {
    const handleClick = vi.fn();
    render(<KPICard {...defaultProps} onClick={handleClick} />);

    const card = screen.getByRole('button');

    // Test Enter key
    fireEvent.keyDown(card, { key: 'Enter' });
    expect(handleClick).toHaveBeenCalledTimes(1);

    // Test Space key
    fireEvent.keyDown(card, { key: ' ' });
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it('should not be clickable without onClick', () => {
    render(<KPICard {...defaultProps} />);

    const card = screen.getByRole('article');
    expect(card).not.toHaveAttribute('tabindex');
  });

  it('should apply correct color classes', () => {
    const { container } = render(<KPICard {...defaultProps} color="green" />);

    const card = container.querySelector('.border-green-500\\/20');
    expect(card).toBeInTheDocument();
  });
});
