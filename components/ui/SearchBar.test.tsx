import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from './SearchBar';

const pushMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

describe('SearchBar Component', () => {
  beforeEach(() => {
    pushMock.mockClear();
  });

  it('renders correctly', () => {
    render(<SearchBar />);

    expect(screen.getByPlaceholderText(/Flight Code/i)).toBeDefined();
    expect(screen.getByRole('button')).toBeDefined();
  });

  it('shows error when input is empty', () => {
    render(<SearchBar />);
    const button = screen.getByRole('button');

    fireEvent.click(button);

    expect(screen.getByText(/Please enter a flight code/i)).toBeDefined();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it('shows error for invalid format (e.g. only numbers)', () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText(/Flight Code/i);
    const button = screen.getByRole('button');

    fireEvent.change(input, { target: { value: '12345' } });
    fireEvent.click(button);

    expect(screen.getByText(/Invalid format/i)).toBeDefined();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it('navigates to flight page on valid input', () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText(/Flight Code/i);
    const button = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'TK1920' } });
    fireEvent.click(button);

    const errorMessage = screen.queryByText(/Invalid format/i);
    expect(errorMessage).toBeNull();

    expect(pushMock).toHaveBeenCalledWith('/flight/TK1920');
  });
});
