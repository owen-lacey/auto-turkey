import { useState } from 'react';
import './DevTimeControls.css';

interface DevTimeControlsProps {
  currentTime: Date;
  isMocked: boolean;
  dinnerTime: Date;
  onSetMockTime: (date: Date | null) => void;
  onAdvanceTime: (minutes: number) => void;
}

export function DevTimeControls({
  currentTime,
  isMocked,
  dinnerTime,
  onSetMockTime,
  onAdvanceTime,
}: DevTimeControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  const presets = [
    { label: '🌅 7am', hours: 7 },
    { label: '☀️ 9am', hours: 9 },
    { label: '🍳 11am', hours: 11 },
    { label: '🕐 12pm', hours: 12 },
    { label: '🍽️ -1hr', hours: dinnerTime.getHours() - 1 },
    { label: '⏰ -30m', hours: dinnerTime.getHours(), minutes: dinnerTime.getMinutes() - 30 },
  ];

  const setPreset = (hours: number, minutes: number = 0) => {
    const mockDate = new Date(dinnerTime);
    mockDate.setHours(hours, minutes, 0, 0);
    onSetMockTime(mockDate);
  };

  // Minimized view - just a small pill
  if (!isExpanded) {
    return (
      <button 
        className="dev-time-controls minimized"
        onClick={() => setIsExpanded(true)}
      >
        <span className="dev-badge">DEV</span>
        <span className="mini-time">
          {currentTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
        </span>
        {isMocked && <span className="mini-mock">⏱</span>}
      </button>
    );
  }

  return (
    <div className="dev-time-controls expanded">
      <div className="dev-header">
        <span className="dev-badge">DEV</span>
        <span className={`time-value ${isMocked ? 'mocked' : ''}`}>
          {currentTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
          {isMocked && <span className="mock-indicator">MOCK</span>}
        </span>
        <div className="header-actions">
          {isMocked && (
            <button className="reset-btn" onClick={() => onSetMockTime(null)} title="Reset">
              ↺
            </button>
          )}
          <button className="minimize-btn" onClick={() => setIsExpanded(false)} title="Minimize">
            −
          </button>
        </div>
      </div>

      <div className="time-presets">
        {presets.map((preset, i) => (
          <button
            key={i}
            className="preset-btn"
            onClick={() => setPreset(preset.hours, preset.minutes ?? 0)}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="time-adjusters">
        <button onClick={() => onAdvanceTime(-60)}>-1h</button>
        <button onClick={() => onAdvanceTime(-15)}>-15m</button>
        <button onClick={() => onAdvanceTime(15)}>+15m</button>
        <button onClick={() => onAdvanceTime(60)}>+1h</button>
      </div>
    </div>
  );
}

