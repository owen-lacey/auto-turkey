import './GanttChart.css';

interface TimeMarkerProps {
  currentTime: Date;
  timeRange: { start: Date; end: Date };
}

export function TimeMarker({ currentTime, timeRange }: TimeMarkerProps) {
  const totalMs = timeRange.end.getTime() - timeRange.start.getTime();
  const currentMs = currentTime.getTime() - timeRange.start.getTime();
  const percent = (currentMs / totalMs) * 100;

  // Don't show if outside range
  if (percent < 0 || percent > 100) {
    return null;
  }

  return (
    <div 
      className="time-marker"
      style={{ left: `${percent}%` }}
    >
      <div className="time-marker-label">Now</div>
    </div>
  );
}

