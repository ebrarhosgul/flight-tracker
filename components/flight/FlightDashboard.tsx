'use client';

import { useState, useEffect } from 'react';
import { FlightData, AirportResponse, StatBoxProps } from '@/types';
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
import BackButton from '../ui/BackButton';

interface Props {
  initialData: FlightData;
  departure: AirportResponse | null;
  arrival: AirportResponse | null;
}

const TelemetryChart = dynamic(() => import('@/components/flight/TelemetryChart'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[200px] flex items-center justify-center bg-[#121214] border border-zinc-800 rounded-3xl">
      <span className="text-zinc-600 font-mono text-xs tracking-widest animate-pulse">LOADING ALTITUDE CHART...</span>
    </div>
  ),
});

const FlightMap = dynamic(() => import('@/components/map/FlightMap'), {
  ssr: false,
  loading: () => (
    <div className="loading-placeholder" role="status" aria-live="polite">
      LOADING MAP DATA...
    </div>
  ),
});

const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

const getSmartVerticalSpeed = (flight: any, departure: any, arrival: any) => {
  if (flight.v_speed !== undefined && flight.v_speed !== null && flight.v_speed !== 0) {
    return Math.round(flight.v_speed * 196.85);
  }

  return null;
};

const calculateSimulatedSpeed = (flight: any, departure: any, arrival: any) => {
  const currentAltMeters = flight.alt;
  const LOW_ALTITUDE_LIMIT = 4000;
  const NEAR_AIRPORT_LIMIT = 150;

  if (departure?.latitude_deg && departure?.longitude_deg) {
    const distToDep = getDistanceFromLatLonInKm(
      flight.lat,
      flight.lng,
      departure.latitude_deg,
      departure.longitude_deg
    );
    if (distToDep < NEAR_AIRPORT_LIMIT && currentAltMeters < LOW_ALTITUDE_LIMIT) {
      return 1800 + Math.floor(Math.random() * 1200);
    }
  }

  if (arrival?.latitude_deg && arrival?.longitude_deg) {
    const distToArr = getDistanceFromLatLonInKm(flight.lat, flight.lng, arrival.latitude_deg, arrival.longitude_deg);
    if (distToArr < NEAR_AIRPORT_LIMIT && currentAltMeters < LOW_ALTITUDE_LIMIT) {
      return -1 * (1000 + Math.floor(Math.random() * 1000));
    }
  }

  return Math.floor(Math.random() * 80) - 40;
};

export default function FlightDashboard({ initialData, departure, arrival }: Props) {
  const [vSpeed, setVSpeed] = useState(0);

  useEffect(() => {
    const realSpeed = getSmartVerticalSpeed(initialData, departure, arrival);

    if (realSpeed !== null) {
      setVSpeed(realSpeed);
    } else {
      setVSpeed(calculateSimulatedSpeed(initialData, departure, arrival));
    }
  }, [initialData, departure, arrival]);

  const getFlightStatus = () => {
    const vs = vSpeed;

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
        <BackButton />

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
                  vSpeed > 0 ? 'text-climb' : vSpeed < 0 ? 'text-descend' : 'text-level'
                }`}
                aria-label={`${vSpeed} feet per minute, ${vSpeed > 0 ? 'Climbing' : vSpeed < 0 ? 'Descending' : 'Level flight'}`}
              >
                {vSpeed > 0 ? (
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                ) : vSpeed < 0 ? (
                  <ArrowDownRight className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                )}
                <span className="text-lg md:text-xl" aria-hidden="true">
                  {vSpeed} <span className="text-sm text-zinc-400">fpm</span>
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
