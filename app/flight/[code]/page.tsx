import { notFound } from 'next/navigation';
import { getFlightData } from '@/lib/api';
import { getAirportDetails } from '@/lib/airportApi';
import FlightDashboard from '@/components/flight/FlightDashboard';

interface PageProps {
  params: Promise<{ code: string }>;
}

export default async function FlightPage({ params }: PageProps) {
  const { code } = await params;

  const flight = await getFlightData(code);

  if (!flight) {
    notFound();
  }

  const [departureAirport, arrivalAirport] = await Promise.all([
    getAirportDetails(flight.dep_icao),
    getAirportDetails(flight.arr_icao),
  ]);

  return (
    <main className="flight-page-main">
      <div className="tech-grid-overlay" />

      <FlightDashboard initialData={flight} departure={departureAirport} arrival={arrivalAirport} />
    </main>
  );
}
