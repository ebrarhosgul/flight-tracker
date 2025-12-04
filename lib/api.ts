import { FlightData } from '@/types';

export async function getFlightData(code: string): Promise<FlightData | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  try {
    const res = await fetch(`${baseUrl}/api/flights?code=${code}`, {
      cache: 'no-store',
    });

    if (!res.ok) return null;

    const json = await res.json();

    return json.data && json.data[0] ? json.data[0] : null;
  } catch (error) {
    console.error('Fetch Error:', error);

    return null;
  }
}
