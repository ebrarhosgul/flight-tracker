'use client';

import { memo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FlightData } from '@/types';
import { useTelemetry } from '@/hooks/useTelemetry';

interface Props {
  initialData: FlightData;
}

const TelemetryChart = ({ initialData }: Props) => {
  const { history, isCruising } = useTelemetry(initialData);

  const minAlt = Math.min(...history.map((d) => d.alt));
  const maxAlt = Math.max(...history.map((d) => d.alt));
  const padding = isCruising ? 50 : 200;

  return (
    <div className="telemetry-container">
      <div className="telemetry-header">
        <div className="telemetry-title-wrapper">
          <span className="live-indicator-box">
            <span className="live-ping-effect" style={{ animationDuration: '3s' }}></span>
            <span className="live-dot-static"></span>
          </span>
          <span className="telemetry-title-text">Live Telemetry</span>
        </div>

        <div className="telemetry-legend-wrapper">
          <span className="legend-dot-indicator"></span>
          <span className="legend-label-text">Altitude (ft)</span>
        </div>
      </div>

      <div className="telemetry-chart-area">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAlt" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />

            <XAxis
              dataKey="time"
              stroke="#52525b"
              tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }}
              tickLine={false}
              axisLine={false}
              minTickGap={60}
              padding={{ left: 0, right: 20 }}
            />

            <YAxis
              stroke="#52525b"
              tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }}
              tickLine={false}
              axisLine={false}
              domain={[minAlt - padding, maxAlt + padding]}
              width={60}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: '#18181b',
                borderColor: '#27272a',
                borderRadius: '8px',
                fontSize: '12px',
                fontFamily: 'monospace',
              }}
              itemStyle={{ color: '#0ea5e9' }}
              labelStyle={{ color: '#a1a1aa', marginBottom: '4px' }}
              separator=""
              formatter={(value: number) => [`${value} ft`, '']}
            />

            <Area
              type="monotone"
              dataKey="alt"
              stroke="#0ea5e9"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorAlt)"
              isAnimationActive={false}
              animationDuration={0}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default memo(TelemetryChart);
