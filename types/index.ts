export interface FlightData {
  hex: string;
  reg_number: string;
  flag: string;
  lat: number;
  lng: number;
  alt: number;
  dir: number;
  speed: number;
  v_speed: number;
  squawk?: string;
  flight_number: string;
  flight_icao: string;
  flight_iata: string;
  dep_icao: string;
  dep_iata: string;
  arr_icao: string;
  arr_iata: string;
  airline_icao: string;
  airline_iata: string;
  aircraft_icao: string;
  updated?: number;
  status: string;
}

export interface ApiResponse {
  source: 'mock' | 'live';
  data: FlightData[];
  error?: string;
}

export interface PageProps {
  params: Promise<{ code: string }>;
}

export interface AirportDetail {
  name: string;
  city: string;
  country: string;
}

export interface AirportResponse {
  name: string;
  municipality: string;
  iso_country: string;
  iata_code: string;
  icao_code: string;
  latitude_deg: number;
  longitude_deg: number;
}

export interface StatBoxProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

export interface FlightMapProps {
  lat: number;
  lng: number;
  dir: number;
  flightCode: string;
  v_speed: number;
  alt: number;
  speed: number;
  departure?: AirportResponse | null;
  arrival?: AirportResponse | null;
}

export interface ChartPoint {
  time: string;
  alt: number;
}

export interface BackButtonProps {
  href?: string;
  label?: string;
}
