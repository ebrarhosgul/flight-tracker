import { SearchX, Radar } from 'lucide-react';
import SearchBar from '@/components/ui/SearchBar';
import BackButton from '@/components/ui/BackButton';

export default function FlightNotFound() {
  return (
    <div className="not-found-container">
      <div className="tech-grid-overlay" />

      <header className="not-found-header">
        <BackButton label="Home" />
      </header>

      <div className="not-found-content">
        <div className="not-found-card">
          <div className="card-decoration-red" />

          <div className="radar-icon-wrapper">
            <div className="radar-spin-ring" />
            <div className="radar-center-circle">
              <SearchX className="w-8 h-8 text-red-500" />
            </div>
            <Radar className="radar-pulse-effect" />
          </div>

          <h2 className="status-heading">Signal Lost</h2>

          <p className="status-description">
            The requested flight could not be found. <br />
            Please check the code and try again.
          </p>

          <div className="w-full">
            <SearchBar />
          </div>

          <div className="card-footer-area">
            <p className="card-footer-status-code">STATUS: RADAR_CONTACT_LOST</p>
          </div>
        </div>
      </div>
    </div>
  );
}
