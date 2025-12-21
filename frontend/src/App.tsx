import { useState, useEffect, useCallback } from 'react';
import { useSchedule } from './hooks/useSchedule';
import { useMockTime } from './hooks/useMockTime';
import { GanttChart } from './components/GanttChart';
import { PrepSection } from './components/PrepSection';
import { DevTimeControls } from './components/DevTimeControls';
import { generateSchedule, getTotalDuration, getDinnerTime, setDinnerTime, clearDinnerTime } from './services/api';
import './App.css';

function App() {
  const { schedule, loading, error, refetch, togglePrepTask, toggleScheduledTask } = useSchedule();
  const { currentTime, isMocked, setMockTime, advanceTime } = useMockTime(60000);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [totalDuration, setTotalDuration] = useState<number | null>(null);
  const [savedDinnerTime, setSavedDinnerTime] = useState<string | null>(null);
  const [dinnerTimeLoading, setDinnerTimeLoading] = useState(true);

  // Load total duration and saved dinner time on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [durationResult, dinnerTimeResult] = await Promise.all([
          getTotalDuration(),
          getDinnerTime()
        ]);
        setTotalDuration(durationResult.totalMinutes);
        setSavedDinnerTime(dinnerTimeResult.dinnerTime);
      } catch (err) {
        console.error('Failed to load initial data:', err);
      } finally {
        setDinnerTimeLoading(false);
      }
    };
    loadInitialData();
  }, []);

  // Calculate effective dinner time: saved time or default (now + duration)
  const getEffectiveDinnerTime = useCallback((): Date => {
    if (savedDinnerTime) {
      // Parse HH:mm and set to today
      const [hours, minutes] = savedDinnerTime.split(':').map(Number);
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      return date;
    }
    // Default: now + total cooking duration
    if (totalDuration) {
      return new Date(Date.now() + totalDuration * 60 * 1000);
    }
    // Fallback: 3 hours from now
    return new Date(Date.now() + 3 * 60 * 60 * 1000);
  }, [savedDinnerTime, totalDuration]);

  const handleGenerateSchedule = async (dinnerTimeOverride?: Date) => {
    try {
      setGenerating(true);
      setGenerateError(null);
      const effectiveTime = dinnerTimeOverride || getEffectiveDinnerTime();
      await generateSchedule(effectiveTime);
      await refetch();
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : 'Failed to generate schedule');
    } finally {
      setGenerating(false);
    }
  };

  const handleDinnerTimeChange = async (time: string) => {
    try {
      await setDinnerTime(time);
      setSavedDinnerTime(time);
      // Parse the time and regenerate schedule
      const [hours, minutes] = time.split(':').map(Number);
      const dinnerDate = new Date();
      dinnerDate.setHours(hours, minutes, 0, 0);
      await handleGenerateSchedule(dinnerDate);
    } catch (err) {
      console.error('Failed to set dinner time:', err);
    }
  };

  const handleClearDinnerTime = async () => {
    try {
      await clearDinnerTime();
      setSavedDinnerTime(null);
      // Regenerate with default time
      await handleGenerateSchedule();
    } catch (err) {
      console.error('Failed to clear dinner time:', err);
    }
  };

  if (loading || dinnerTimeLoading) {
    return (
      <div className="app">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading schedule...</p>
        </div>
      </div>
    );
  }

  if (error && !schedule) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>Auto-Turkey</h1>
          <p className="subtitle">Christmas Dinner Planner</p>
        </header>
        <main className="app-main">
          <div className="no-schedule">
            <h2>No Schedule Yet</h2>
            <p>Generate an optimized schedule to get started with your Christmas dinner planning!</p>
            {generateError && <p className="generate-error">{generateError}</p>}
            <button 
              className="generate-btn" 
              onClick={() => handleGenerateSchedule()}
              disabled={generating}
            >
              {generating ? 'Generating...' : 'Generate Schedule'}
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>Auto-Turkey</h1>
          <p className="subtitle">Christmas Dinner Planner</p>
        </header>
        <main className="app-main">
          <div className="no-schedule">
            <h2>No Schedule Yet</h2>
            <p>Generate an optimized schedule to get started with your Christmas dinner planning!</p>
            {generateError && <p className="generate-error">{generateError}</p>}
            <button 
              className="generate-btn" 
              onClick={() => handleGenerateSchedule()}
              disabled={generating}
            >
              {generating ? 'Generating...' : 'Generate Schedule'}
            </button>
          </div>
        </main>
      </div>
    );
  }

  const dinnerTime = new Date(schedule.dinnerTime);
  const displayTime = dinnerTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  const timeInputValue = savedDinnerTime || displayTime;

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>Auto-Turkey</h1>
          <p className="subtitle">Christmas Dinner Planner</p>
        </div>
        <div className="header-actions">
          <button 
            className="regenerate-btn" 
            onClick={() => handleGenerateSchedule()}
            disabled={generating}
          >
            {generating ? 'Regenerating...' : '🔄 Regenerate'}
          </button>
          <div className="dinner-info">
            <span className="dinner-label">Dinner at</span>
            <input
              type="time"
              className="dinner-time-input"
              value={timeInputValue}
              onChange={(e) => handleDinnerTimeChange(e.target.value)}
            />
            {savedDinnerTime && (
              <button 
                className="clear-time-btn"
                onClick={handleClearDinnerTime}
                title="Clear and use default time"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="app-main">
        <PrepSection 
          prepTasks={schedule.prepTasks}
          onToggleTask={togglePrepTask}
        />

        <section className="gantt-section">
          <h2>Cooking Schedule</h2>
          <GanttChart 
            schedule={schedule}
            currentTime={currentTime}
            onTaskComplete={toggleScheduledTask}
          />
        </section>
      </main>

      <DevTimeControls
        currentTime={currentTime}
        isMocked={isMocked}
        dinnerTime={dinnerTime}
        onSetMockTime={setMockTime}
        onAdvanceTime={advanceTime}
      />
    </div>
  );
}

export default App;
