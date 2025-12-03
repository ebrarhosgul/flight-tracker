import SearchBar from '@/components/ui/SearchBar';

const StatItem = ({ value, label }: { value: string; label: string }) => (
  <li className="stat-item">
    <span className="stat-value font-bold block">{value}</span>
    <span className="stat-label text-sm text-gray-400">{label}</span>
  </li>
);

export default function Home() {
  return (
    <main className="layout-container">
      <div className="bg-layer-grid" aria-hidden="true" />
      <div className="ambient-glow" aria-hidden="true" />

      <div className="content-wrapper">
        <div className="space-y-4">
          <div className="status-badge" role="status">
            <span className="status-dot-wrapper" aria-hidden="true">
              <span className="status-dot-ping"></span>
              <span className="status-dot-core"></span>
            </span>
            <span className="font-medium tracking-wide">LIVE AIR TRAFFIC DATA</span>
          </div>

          <h1 className="hero-heading">
            <span className="text-gradient-white">Track Any Flight,</span>
            <br aria-hidden="true" />
            <span className="text-gradient-blue">Anywhere.</span>
          </h1>

          <p className="hero-description">
            Advanced real-time flight monitoring system. Access altitude, speed, and route data with precision
            engineering.
          </p>
        </div>

        <SearchBar />

        <ul className="stats-container" aria-label="System Statistics">
          <StatItem value="12+" label="Active Flights" />
          <StatItem value="450+" label="Airlines" />
          <StatItem value="Global" label="Coverage" />
          <StatItem value="0.5s" label="Latency" />
        </ul>
      </div>
    </main>
  );
}
