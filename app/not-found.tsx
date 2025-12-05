import Link from 'next/link';
import { SearchX, Radar, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="not-found-container">
      <div className="tech-grid-overlay" />

      <header className="not-found-header">
        <Link
          href="/"
          className="pointer-events-auto flex items-center gap-2 px-3 py-2 md:px-4 bg-zinc-900/80 border border-white/10 rounded-full text-white hover:bg-zinc-800 transition-all font-medium text-xs md:text-sm w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Base</span>
        </Link>
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

          <h2 className="status-heading">Page Not Found</h2>

          <p className="status-description">
            The coordinates you are looking for do not exist. <br />
            You seem to be off the radar.
          </p>

          <div className="w-full flex justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-white text-black font-medium rounded-full hover:bg-zinc-200 transition-colors text-sm w-full md:w-auto"
            >
              Return to Base
            </Link>
          </div>

          <div className="card-footer-area">
            <p className="card-footer-status-code">ERROR: 404_LOST_IN_SPACE</p>
          </div>
        </div>
      </div>
    </div>
  );
}
