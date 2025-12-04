import { AirportResponse } from '@/types';
import { MOCK_AIRPORTS } from '@/mocks/airports';

export async function getAirportDetails(icaoCode: string): Promise<AirportResponse | null> {
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    return MOCK_AIRPORTS[icaoCode] || null;
  }

  const apiToken = process.env.AIRPORTDB_TOKEN;
  if (!apiToken) return null;

  try {
    const res = await fetch(`https://airportdb.io/api/v1/airport/${icaoCode}?apiToken=${apiToken}`, {
      next: { revalidate: 86400 },
    });

    if (!res.ok) return null;

    const data = await res.json();

    return {
      name: data.name,
      municipality: data.municipality,
      iso_country: data.iso_country,
      iata_code: data.iata_code,
      icao_code: data.icao_code,
      latitude_deg: data.latitude_deg,
      longitude_deg: data.longitude_deg,
    };
  } catch (error) {
    console.error('Airport API Error:', error);

    return null;
  }
}
