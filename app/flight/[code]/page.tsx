import { notFound } from 'next/navigation';
import { getFlightData } from '@/lib/api';
import { getAirportDetails } from '@/lib/airportApi';
import FlightDashboard from '@/components/flight/FlightDashboard';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code } = await params;

  return {
    title: `Flight ${code.toUpperCase()} Status & Details`,
    description: `Real-time tracking details for flight ${code}.`,
  };
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
    <main className="flight-page-main" aria-label={`Details for flight ${code}`}>
      <div className="tech-grid-overlay" aria-hidden="true" />

      <FlightDashboard initialData={flight} departure={departureAirport} arrival={arrivalAirport} />
    </main>
  );
}
