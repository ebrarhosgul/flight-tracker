'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle, ArrowRight } from 'lucide-react';

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const code = query.trim().toUpperCase();

    setError('');

    if (!code) {
      setError('Please enter a flight code.');
      return;
    }

    const flightCodeRegex = /^[A-Z]{2,3}[0-9]{1,4}$/;

    if (!flightCodeRegex.test(code)) {
      setError('Invalid format. Use Airline Code + Number (e.g., TK1923, BA14)');
      return;
    }

    setIsLoading(true);

    router.push(`/flight/${code}`);
  };

  const inputId = 'flight-code-input';
  const errorId = 'flight-code-error';

  return (
    <div className="search-wrapper" role="search">
      <form onSubmit={handleSearch} className="search-form" noValidate>
        <label htmlFor={inputId} className="sr-only">
          Search Flight Code
        </label>

        <input
          id={inputId}
          type="text"
          name="flightCode"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value.toUpperCase());
            if (error) {
              setError('');
            }
          }}
          placeholder="Flight Code (e.g., TK1923)"
          className={`search-input ${error ? 'has-error' : ''}`}
          maxLength={8}
          autoComplete="off"
          spellCheck="false"
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          aria-required="true"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="search-btn"
          aria-label={isLoading ? 'Searching flight...' : 'Search Flight'}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
          ) : (
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          )}
        </button>
      </form>

      {error && (
        <div id={errorId} className="error-badge" role="alert" aria-live="assertive">
          <AlertCircle className="w-3 h-3" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
