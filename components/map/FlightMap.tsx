'use client';

import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FlightMapProps } from '@/types';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapController = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lng], map.getZoom(), { animate: true });
  }, [lat, lng, map]);

  return null;
};

export default function FlightMap({
  lat,
  lng,
  dir,
  flightCode,
  v_speed,
  alt,
  speed,
  departure,
  arrival,
}: FlightMapProps) {
  const flightStatusColor = v_speed > 50 ? '#10b981' : v_speed < -50 ? '#f59e0b' : '#0ea5e9';

  const planeIcon = useMemo(
    () =>
      L.divIcon({
        className: 'custom-plane-icon',
        html: `
      <div style="
        transform: rotate(${dir}deg); 
        width: 54px; 
        height: 54px; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        filter: drop-shadow(0 0 10px ${flightStatusColor});
        transition: transform 1s linear;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${flightStatusColor}" width="100%" height="100%" aria-hidden="true" focusable="false">
           <path d="M21,16v-2l-8-5V3.5c0-0.83-0.67-1.5-1.5-1.5S10,2.67,10,3.5V9l-8,5v2l8-2.5V19l-2,1.5V22l3.5-1l3.5,1v-1.5L13,19 v-5.5L21,16z"/>
        </svg>
      </div>
    `,
        iconSize: [54, 54],
        iconAnchor: [27, 27],
      }),
    [dir, flightStatusColor]
  );

  const depIcon = useMemo(
    () =>
      L.divIcon({
        className: 'airport-icon',
        html: `
      <div style="display: flex; align-items: center; justify-content: center; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.8));">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#10b981" width="28px" height="28px" aria-hidden="true" focusable="false">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          <circle cx="12" cy="9" r="2.5" fill="#000" fill-opacity="0.2"/>
        </svg>
      </div>
    `,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28],
      }),
    []
  );

  const arrIcon = useMemo(
    () =>
      L.divIcon({
        className: 'airport-icon',
        html: `
      <div style="display: flex; align-items: center; justify-content: center; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.8));">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ef4444" width="28px" height="28px" aria-hidden="true" focusable="false">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          <circle cx="12" cy="9" r="2.5" fill="#000" fill-opacity="0.2"/>
        </svg>
      </div>
    `,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28],
      }),
    []
  );

  const routePositions: L.LatLngExpression[] = [];

  if (departure?.latitude_deg && departure?.longitude_deg) {
    routePositions.push([departure.latitude_deg, departure.longitude_deg]);
  }

  routePositions.push([lat, lng]);

  if (arrival?.latitude_deg && arrival?.longitude_deg) {
    routePositions.push([arrival.latitude_deg, arrival.longitude_deg]);
  }

  return (
    <div className="map-container-wrapper" role="region" aria-label="Flight Tracking Map">
      <div className="map-legend-box" aria-hidden="true">
        <div className="map-legend-header">
          <span className="map-legend-title">Route Map</span>
          <div className="legend-route-indicator">
            <div className="dot-emerald"></div>
            <div className="line-dashed"></div>
            <div className="dot-red"></div>
          </div>
        </div>

        <div className="map-route-details">
          <div className="text-left">
            <span className="route-text-label">DEP</span>
            <span className="route-text-code-dep">{departure?.iata_code || '---'}</span>
          </div>

          <div className="plane-icon-legend">✈</div>

          <div className="text-right">
            <span className="route-text-label">ARR</span>
            <span className="route-text-code-arr">{arrival?.iata_code || '---'}</span>
          </div>
        </div>
      </div>

      <MapContainer
        preferCanvas={true}
        center={[lat, lng]}
        zoom={6}
        style={{ height: '100%', width: '100%', background: 'transparent' }}
        zoomControl={false}
        attributionControl={false}
        keyboard={true}
      >
        <MapController lat={lat} lng={lng} />

        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

        {routePositions.length > 1 && (
          <Polyline
            positions={routePositions}
            color={flightStatusColor}
            weight={2}
            opacity={0.6}
            dashArray="6, 8"
            interactive={false}
          />
        )}

        {departure?.latitude_deg && departure?.longitude_deg && (
          <Marker
            position={[departure.latitude_deg, departure.longitude_deg]}
            icon={depIcon}
            title={`Departure Airport: ${departure.name}`}
            alt={`Departure Airport: ${departure.name}`}
            keyboard={true}
          >
            <Popup className="font-mono text-xs text-center">
              <strong className="text-emerald-600 block">DEPARTURE</strong>
              {departure.name}
            </Popup>
          </Marker>
        )}

        {arrival?.latitude_deg && arrival?.longitude_deg && (
          <Marker
            position={[arrival.latitude_deg, arrival.longitude_deg]}
            icon={arrIcon}
            title={`Arrival Airport: ${arrival.name}`}
            alt={`Arrival Airport: ${arrival.name}`}
            keyboard={true}
          >
            <Popup className="font-mono text-xs text-center">
              <strong className="text-red-600 block">ARRIVAL</strong>
              {arrival.name}
            </Popup>
          </Marker>
        )}

        <Marker
          position={[lat, lng]}
          icon={planeIcon}
          title={`Current Location of Flight ${flightCode}`}
          alt={`Plane icon for flight ${flightCode}`}
          keyboard={true}
          zIndexOffset={1000}
        >
          <Popup className="font-mono text-xs">
            <div className="text-center">
              <strong className="text-base block mb-1">{flightCode}</strong>
              <span className="block text-zinc-500">Alt: {Math.round(alt)} ft</span>
              <span className="block text-zinc-500">Spd: {Math.round(speed)} km/h</span>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
