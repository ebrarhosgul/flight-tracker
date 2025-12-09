import { useState, useEffect, useRef } from 'react';
import { FlightData, ChartPoint } from '@/types';
import { REFRESH_RATE_MS, HISTORY_POINTS_COUNT } from '@/lib/constants';

export const useTelemetry = (initialData: FlightData) => {
  const [history, setHistory] = useState<ChartPoint[]>([]);
  const currentAlt = useRef(initialData.alt);

  const vSpeedPerTick = (initialData.v_speed || 0) * (REFRESH_RATE_MS / 60000);
  const isCruising = Math.abs(initialData.v_speed) < 100;

  useEffect(() => {
    const initialPoints: ChartPoint[] = [];
    const now = new Date();

    for (let i = HISTORY_POINTS_COUNT; i >= 0; i--) {
      const t = new Date(now.getTime() - i * REFRESH_RATE_MS);

      const noise = isCruising ? Math.random() * 2 - 1 : Math.random() * 10 - 5;
      const simulatedAlt = currentAlt.current - vSpeedPerTick * i + noise;

      initialPoints.push({
        time: t.toLocaleTimeString(undefined, { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        alt: Math.max(0, Math.round(simulatedAlt)),
      });
    }
    setHistory(initialPoints);

    const interval = setInterval(() => {
      const currentTime = new Date();
      const timeStr = currentTime.toLocaleTimeString(undefined, {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      const noise = isCruising ? Math.random() * 2 - 1 : Math.random() * 10 - 5;

      currentAlt.current = currentAlt.current + vSpeedPerTick + noise;

      const newPoint: ChartPoint = {
        time: timeStr,
        alt: Math.max(0, Math.round(currentAlt.current)),
      };

      setHistory((prev) => [...prev.slice(1), newPoint]);
    }, REFRESH_RATE_MS);

    return () => clearInterval(interval);
  }, [initialData.alt, vSpeedPerTick, isCruising]);

  return { history, isCruising };
};
