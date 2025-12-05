'use client';

import { FlightData, AirportResponse, StatBoxProps } from '@/types';
import Link from 'next/link';
import {
  ArrowLeft,
  Plane,
  PlaneTakeoff,
  PlaneLanding,
  Map as MapIcon,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import TelemetryChart from '@/components/flight/TelemetryChart';

interface Props {
  initialData: FlightData;
  departure: AirportResponse | null;
  arrival: AirportResponse | null;
}

const FlightMap = dynamic(() => import('@/components/map/FlightMap'), {
  ssr: false,
  loading: () => (
    <div className="loading-placeholder" role="status" aria-live="polite">
      LOADING MAP DATA...
    </div>
  ),
});

export default function FlightDashboard({ initialData, departure, arrival }: Props) {
  const getFlightStatus = () => {
    const vs = initialData.v_speed;

    if (vs > 50) {
      return {
        icon: <PlaneTakeoff className="w-6 h-6 md:w-8 md:h-8 text-emerald-400" aria-hidden="true" />,
        text: 'CLIMBING',
        dotColor: 'bg-emerald-500',
      };
    }

    if (vs < -50) {
      return {
        icon: <PlaneLanding className="w-6 h-6 md:w-8 md:h-8 text-amber-400" aria-hidden="true" />,
        text: 'DESCENDING',
        dotColor: 'bg-amber-500',
      };
    }

    return {
      icon: <Plane className="w-6 h-6 md:w-8 md:h-8 text-sky-400" aria-hidden="true" />,
      text: 'CRUISING',
      dotColor: 'bg-sky-500',
    };
  };

  const status = getFlightStatus();

  return (
    <div className="relative w-full h-full flex flex-col overflow-y-auto">
      <header className="dashboard-header">
        <Link href="/" className="btn-back" aria-label="Go back to new search">
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>New Search</span>
        </Link>

        <div className="badge-live" role="status">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
          <span className="sr-only">Status:</span>
          <span>LIVE</span>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="dashboard-card group">
          <div
            className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-zinc-700 to-transparent opacity-50"
            aria-hidden="true"
          />

          <section
            aria-label="Flight Route Information"
            className="flex flex-col md:flex-row items-center justify-between md:gap-12 text-center md:text-left mb-8 md:mb-12"
          >
            <div className="flex-1 min-w-[120px]">
              <div className="text-xs text-zinc-500 mb-1 sr-only">Departure</div>
              <span className="airport-code block">{departure?.iata_code || initialData.dep_iata}</span>
              <span className="airport-city block">{departure?.municipality || initialData.dep_iata}</span>
              <span className="airport-name block mx-auto md:mx-0">{departure?.name || 'Departure Airport'}</span>
            </div>

            <div className="flight-icon-container group w-full md:w-auto" aria-hidden="true">
              <div className="status-badge-pill">{status.text}</div>
              <div className="flight-icon-circle">{status.icon}</div>

              <div className="hidden md:block absolute top-1/2 left-full w-16 lg:w-24 h-px bg-zinc-800 -translate-y-1/2 ml-4" />
              <div className="hidden md:block absolute top-1/2 right-full w-16 lg:w-24 h-px bg-zinc-800 -translate-y-1/2 mr-4" />
            </div>

            <div className="sr-only">Current Status: {status.text}</div>

            <div className="flex-1 min-w-[120px] text-center md:text-right">
              <div className="text-xs text-zinc-500 mb-1 sr-only">Arrival</div>
              <span className="airport-code block">{arrival?.iata_code || initialData.arr_iata}</span>
              <span className="airport-city block">{arrival?.municipality || initialData.arr_iata}</span>
              <span className="airport-name block mx-auto md:ml-auto md:mr-0">
                {arrival?.name || 'Arrival Airport'}
              </span>
            </div>
          </section>

          <div className="stat-grid">
            <StatBox label="Flight Number">
              <span className="stat-value">{initialData.flight_iata}</span>
            </StatBox>

            <StatBox label="Altitude">
              <span className="stat-value">
                {Math.round(initialData.alt)}{' '}
                <span className="text-sm text-zinc-400" aria-label="feet">
                  ft
                </span>
              </span>
            </StatBox>

            <StatBox label="Ground Speed">
              <span className="stat-value">
                {Math.round(initialData.speed)}{' '}
                <span className="text-sm text-zinc-400" aria-label="kilometers per hour">
                  km/h
                </span>
              </span>
            </StatBox>

            <StatBox label="Vertical Speed">
              <div
                role="img"
                className={`flex items-center gap-1.5 font-mono font-medium truncate ${
                  initialData.v_speed > 0 ? 'text-climb' : initialData.v_speed < 0 ? 'text-descend' : 'text-level'
                }`}
                aria-label={`${initialData.v_speed} feet per minute, ${initialData.v_speed > 0 ? 'Climbing' : initialData.v_speed < 0 ? 'Descending' : 'Level flight'}`}
              >
                {initialData.v_speed > 0 ? (
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                ) : initialData.v_speed < 0 ? (
                  <ArrowDownRight className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                )}
                <span className="text-lg md:text-xl" aria-hidden="true">
                  {initialData.v_speed}
                </span>
              </div>
            </StatBox>

            <StatBox label="Aircraft Type" className="wide">
              <span className="stat-value">{initialData.aircraft_icao || 'Unknown Type'}</span>
            </StatBox>

            <StatBox label="GPS Coordinates" className="wide row-layout">
              <div className="flex flex-col">
                <span className="stat-label md:hidden mb-1">Live Location</span>
                <span className="stat-value text-sky-500 text-sm md:text-base block">
                  <span aria-label={`Latitude ${initialData.lat.toFixed(4)}`}>{initialData.lat.toFixed(4)}</span>,{' '}
                  <span aria-label={`Longitude ${initialData.lng.toFixed(4)}`}>{initialData.lng.toFixed(4)}</span>
                </span>
              </div>
              <MapIcon className="w-5 h-5 text-zinc-600 shrink-0 ml-2" aria-hidden="true" />
            </StatBox>
          </div>

          <div className="map-wrapper" role="region" aria-label="Interactive Flight Map">
            <div className="map-overlay-info" aria-hidden="true">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${status.dotColor} animate-pulse`} />
                <span className="text-[10px] text-zinc-300 font-mono tracking-widest uppercase">Live Route</span>
              </div>
              <span className="text-xs text-white font-medium">
                {departure?.iata_code || '???'} <span className="text-zinc-500">→</span> {arrival?.iata_code || '???'}
              </span>
            </div>

            <FlightMap
              lat={initialData.lat}
              lng={initialData.lng}
              dir={initialData.dir}
              flightCode={initialData.flight_iata}
              v_speed={initialData.v_speed}
              alt={initialData.alt}
              speed={initialData.speed}
              departure={departure}
              arrival={arrival}
            />
          </div>

          <figure className="chart-wrapper" aria-label="Flight Telemetry Chart">
            <figcaption className="sr-only">
              Real-time telemetry chart showing altitude and speed changes over time.
            </figcaption>
            <TelemetryChart initialData={initialData} />
          </figure>
        </div>
      </div>
    </div>
  );
}

const StatBox = ({ label, children, className = '' }: StatBoxProps) => (
  <div className={`stat-card ${className}`}>
    {!className.includes('row-layout') && <div className="stat-label">{label}</div>}
    <div className={className.includes('row-layout') ? 'w-full' : ''}>{children}</div>
  </div>
);
