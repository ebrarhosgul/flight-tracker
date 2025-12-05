import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import TelemetryChart from './TelemetryChart';
import { FlightData } from '@/types';

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserver;

const mockData: FlightData = {
  flight_iata: 'TK1920',
  lat: 41.0,
  lng: 29.0,
  dir: 180,
  alt: 30000,
  speed: 800,
  v_speed: 10,
  hex: 'abc',
  reg_number: 'TC-JVG',
  flag: 'TR',
  flight_number: '1920',
  flight_icao: 'THY1920',
  dep_icao: 'LTFM',
  dep_iata: 'IST',
  arr_icao: 'KJFK',
  arr_iata: 'JFK',
  airline_icao: 'THY',
  airline_iata: 'TK',
  aircraft_icao: 'B77W',
  status: 'en-route',
};

describe('TelemetryChart Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders without crashing', () => {
    render(<TelemetryChart initialData={mockData} />);

    expect(screen.getByText(/Live Telemetry/i)).toBeDefined();
    expect(screen.getByText(/Altitude/i)).toBeDefined();
  });

  it('formats time correctly based on locale', () => {
    const date = new Date(2025, 12, 5, 12, 0, 0);
    vi.setSystemTime(date);

    const toLocaleTimeStringSpy = vi.spyOn(Date.prototype, 'toLocaleTimeString');

    render(<TelemetryChart initialData={mockData} />);

    expect(toLocaleTimeStringSpy).toHaveBeenCalledWith(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    toLocaleTimeStringSpy.mockRestore();
  });

  it('updates data over time (Simulation Check)', () => {
    vi.useFakeTimers();

    render(<TelemetryChart initialData={mockData} />);

    vi.advanceTimersByTime(4000);
  });
});
