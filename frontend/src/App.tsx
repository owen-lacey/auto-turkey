import { useState } from 'react';
import { useSchedule } from './hooks/useSchedule';
import { GanttChart } from './components/GanttChart';
import { PrepSection } from './components/PrepSection';
import { generateSchedule } from './services/api';
import './App.css';

function App() {
  const { schedule, loading, error, refetch, togglePrepTask, toggleScheduledTask } = useSchedule();
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const handleGenerateSchedule = async () => {
    try {
      setGenerating(true);
      setGenerateError(null);
      await generateSchedule();
      await refetch();
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : 'Failed to generate schedule');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
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
          <h1>🦃 Auto-Turkey</h1>
          <p className="subtitle">Christmas Dinner Planner</p>
        </header>
        <main className="app-main">
          <div className="no-schedule">
            <h2>No Schedule Yet</h2>
            <p>Generate an optimized schedule to get started with your Christmas dinner planning!</p>
            {generateError && <p className="generate-error">{generateError}</p>}
            <button 
              className="generate-btn" 
              onClick={handleGenerateSchedule}
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
          <h1>🦃 Auto-Turkey</h1>
          <p className="subtitle">Christmas Dinner Planner</p>
        </header>
        <main className="app-main">
          <div className="no-schedule">
            <h2>No Schedule Yet</h2>
            <p>Generate an optimized schedule to get started with your Christmas dinner planning!</p>
            {generateError && <p className="generate-error">{generateError}</p>}
            <button 
              className="generate-btn" 
              onClick={handleGenerateSchedule}
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

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🦃 Auto-Turkey</h1>
          <p className="subtitle">Christmas Dinner Planner</p>
        </div>
        <div className="header-actions">
          <button 
            className="regenerate-btn" 
            onClick={handleGenerateSchedule}
            disabled={generating}
          >
            {generating ? 'Regenerating...' : '🔄 Regenerate'}
          </button>
          <div className="dinner-info">
            <span className="dinner-label">Dinner at</span>
            <span className="dinner-time">
              {dinnerTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
            </span>
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
            onTaskClick={toggleScheduledTask}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
