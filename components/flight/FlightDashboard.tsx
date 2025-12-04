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

interface Props {
  initialData: FlightData;
  departure: AirportResponse | null;
  arrival: AirportResponse | null;
}

const FlightMap = dynamic(() => import('@/components/map/FlightMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-zinc-900/50 text-zinc-600 font-mono text-sm animate-pulse">
      LOADING MAP DATA...
    </div>
  ),
});

export default function FlightDashboard({ initialData, departure, arrival }: Props) {
  const getFlightStatus = () => {
    const vs = initialData.v_speed;
    if (vs > 50) return { icon: <PlaneTakeoff className="w-6 h-6 md:w-8 md:h-8 text-emerald-400" />, text: 'CLIMBING' };
    if (vs < -50)
      return { icon: <PlaneLanding className="w-6 h-6 md:w-8 md:h-8 text-amber-400" />, text: 'DESCENDING' };
    return { icon: <Plane className="w-6 h-6 md:w-8 md:h-8 text-sky-400" />, text: 'CRUISING' };
  };

  const status = getFlightStatus();

  return (
    <div className="relative w-full h-full flex flex-col bg-[#09090b] overflow-y-auto">
      <header className="w-full p-4 md:p-6 flex justify-between items-start pointer-events-none">
        <Link
          href="/"
          className="pointer-events-auto flex items-center gap-2 px-3 py-2 md:px-4 bg-zinc-900/80 border border-white/10 rounded-full text-white hover:bg-zinc-800 transition-all font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs md:text-sm">New Search</span>
        </Link>

        <div className="pointer-events-auto px-3 py-2 md:px-4 bg-emerald-950/30 border border-emerald-500/20 rounded-full text-emerald-500 font-mono flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-breathe" />
          <span className="text-[10px] md:text-xs">LIVE</span>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4 z-10 md:py-0">
        <div className="dashboard-card group">
          <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-zinc-700 to-transparent opacity-50" />

          <div className="flex flex-col md:flex-row items-center justify-between md:gap-12 text-center md:text-left mb-8 md:mb-12">
            <div className="flex-1 min-w-[120px]">
              <span className="airport-code">{departure?.iata_code || initialData.dep_iata}</span>
              <span className="airport-city">{departure?.municipality || initialData.dep_iata}</span>
              <span className="airport-name mx-auto md:mx-0">{departure?.name || 'Departure Airport'}</span>
            </div>

            <div className="flight-icon-container group w-full md:w-auto">
              <div className="status-badge-pill">{status.text}</div>

              <div className="flight-icon-circle">{status.icon}</div>

              <div className="hidden md:block absolute top-1/2 left-full w-16 lg:w-24 h-px bg-zinc-800 -translate-y-1/2 ml-4" />
              <div className="hidden md:block absolute top-1/2 right-full w-16 lg:w-24 h-px bg-zinc-800 -translate-y-1/2 mr-4" />
            </div>

            <div className="flex-1 min-w-[120px] text-center md:text-right">
              <span className="airport-code">{arrival?.iata_code || initialData.arr_iata}</span>
              <span className="airport-city">{arrival?.municipality || initialData.arr_iata}</span>
              <span className="airport-name mx-auto md:ml-auto md:mr-0">{arrival?.name || 'Arrival Airport'}</span>
            </div>
          </div>

          <div className="stat-grid">
            <StatBox label="Flight No">
              <span className="stat-value">{initialData.flight_iata}</span>
            </StatBox>

            <StatBox label="Altitude">
              <span className="stat-value">
                {Math.round(initialData.alt)} <span className="text-sm text-zinc-500">ft</span>
              </span>
            </StatBox>

            <StatBox label="Ground Speed">
              <span className="stat-value">
                {Math.round(initialData.speed)} <span className="text-sm text-zinc-500">km/h</span>
              </span>
            </StatBox>

            <StatBox label="V. Speed">
              <div
                className={`flex items-center gap-1.5 font-mono font-medium truncate ${initialData.v_speed > 0 ? 'text-climb' : initialData.v_speed < 0 ? 'text-descend' : 'text-level'}`}
              >
                {initialData.v_speed > 0 ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : initialData.v_speed < 0 ? (
                  <ArrowDownRight className="w-4 h-4" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
                <span className="text-lg md:text-xl">{initialData.v_speed}</span>
              </div>
            </StatBox>

            <StatBox label="Aircraft" className="wide">
              <span className="stat-value">{initialData.aircraft_icao || 'Unknown Type'}</span>
            </StatBox>

            {/* <StatBox label="GPS Coordinates" className="wide row-layout">
              <div>
                <span className="stat-label">Live Location</span>
                <span className="stat-value text-sky-500 text-sm md:text-base">
                  {initialData.lat.toFixed(4)}, {initialData.lng.toFixed(4)}
                </span>
              </div>
              <MapIcon className="w-5 h-5 text-zinc-600 shrink-0 ml-2" />
            </StatBox> */}
          </div>

          <div className="w-full h-72 md:h-96 rounded-3xl overflow-hidden border border-zinc-800 relative shadow-2xl mt-8">
            <div className="absolute top-4 left-4 z-1 bg-[#121214]/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 pointer-events-none flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full animate-pulse ${status.text === 'CLIMBING' ? 'bg-emerald-500' : status.text === 'DESCENDING' ? 'bg-amber-500' : 'bg-sky-500'}`}
                ></span>
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
        </div>
      </div>
    </div>
  );
}

const StatBox = ({ label, children, className = '' }: StatBoxProps) => (
  <div className={`stat-card ${className}`}>
    {!className.includes('row-layout') && <p className="stat-label">{label}</p>}
    {children}
  </div>
);
