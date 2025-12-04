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
}

export interface StatBoxProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}
