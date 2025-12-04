import { NextResponse } from 'next/server';
import { MOCK_FLIGHTS } from '@/mocks/flights';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code')?.toUpperCase();
  const codeRegex = /^[A-Z0-9]{2,10}$/;

  if (code && !codeRegex.test(code)) {
    return NextResponse.json(
      { error: 'Invalid flight code format. Use generic alphanumeric format (e.g., TK1920).' },
      { status: 400 }
    );
  }

  const API_KEY = process.env.AIRLABS_API_KEY;
  const IS_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

  if (IS_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (code) {
      const filtered = MOCK_FLIGHTS.filter((f) => f.flight_iata === code || f.flight_icao === code);

      if (filtered.length === 0) {
        return NextResponse.json({ error: 'Flight not found in mock data' }, { status: 404 });
      }

      return NextResponse.json({ source: 'mock', data: filtered });
    }

    return NextResponse.json({ source: 'mock', data: MOCK_FLIGHTS });
  }

  if (!API_KEY) {
    return NextResponse.json({ error: 'Server Configuration Error: API Key missing' }, { status: 500 });
  }

  try {
    let apiUrl = `https://airlabs.co/api/v9/flights?api_key=${API_KEY}`;
    const fields = 'lat,lng,alt,dir,speed,flight_iata,flight_icao,dep_iata,arr_iata,status,aircraft_icao,airline_iata';

    apiUrl += `&_fields=${fields}`;

    if (code) {
      apiUrl += `&flight_iata=${code}`;
    }

    console.log(`📡 [LIVE REQUEST] ${code ? `Searching for ${code}` : 'Global Fetch'}`);

    const response = await fetch(apiUrl, { next: { revalidate: 30 } });

    if (!response.ok) {
      return NextResponse.json({ error: `Upstream API Error: ${response.statusText}` }, { status: 502 });
    }

    const data = await response.json();

    if (code && (!data.response || data.response.length === 0)) {
      return NextResponse.json({ error: 'Flight not found or currently not active.' }, { status: 404 });
    }

    return NextResponse.json({
      source: 'live',
      data: data.response,
    });
  } catch (error: any) {
    console.error('API Internal Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
