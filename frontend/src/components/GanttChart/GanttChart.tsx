import { useMemo, useState, useEffect } from 'react';
import type { Schedule, ScheduledTask } from '../../types';
import { MachineRow } from './MachineRow';
import { TimeMarker } from './TimeMarker';
import './GanttChart.css';

interface GanttChartProps {
  schedule: Schedule;
  onTaskClick?: (taskId: number) => void;
}

export function GanttChart({ schedule, onTaskClick }: GanttChartProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const dinnerTime = new Date(schedule.dinnerTime);

  // Calculate time range: find earliest task start, end at dinner time
  const timeRange = useMemo(() => {
    if (schedule.scheduledTasks.length === 0) {
      // Default to 4 hours before dinner
      const start = new Date(dinnerTime.getTime() - 4 * 60 * 60 * 1000);
      return { start, end: dinnerTime };
    }

    const earliestStart = schedule.scheduledTasks.reduce((min, task) => {
      const taskStart = new Date(task.startTime);
      return taskStart < min ? taskStart : min;
    }, new Date(schedule.scheduledTasks[0].startTime));

    return { start: earliestStart, end: dinnerTime };
  }, [schedule.scheduledTasks, dinnerTime]);

  // Group tasks by machine
  const tasksByMachine = useMemo(() => {
    const grouped: Record<string, ScheduledTask[]> = {};
    
    // Initialize with all machines from config
    schedule.machines.forEach(m => {
      grouped[m.name] = [];
    });
    
    // Add "Resting" for tasks without machine
    grouped['Resting'] = [];

    schedule.scheduledTasks.forEach(task => {
      const machine = task.machineName || 'Resting';
      if (!grouped[machine]) {
        grouped[machine] = [];
      }
      grouped[machine].push(task);
    });

    return grouped;
  }, [schedule.scheduledTasks, schedule.machines]);

  // Generate time labels
  const timeLabels = useMemo(() => {
    const labels: { time: Date; label: string }[] = [];
    const start = new Date(timeRange.start);
    start.setMinutes(0, 0, 0); // Round to hour
    
    let current = start;
    while (current <= timeRange.end) {
      labels.push({
        time: new Date(current),
        label: current.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
      });
      current = new Date(current.getTime() + 60 * 60 * 1000); // Add 1 hour
    }
    return labels;
  }, [timeRange]);

  const totalMs = timeRange.end.getTime() - timeRange.start.getTime();

  return (
    <div className="gantt-chart">
      <div className="gantt-header">
        <div className="machine-label-header">Resource</div>
        <div className="timeline-header">
          {timeLabels.map((label, i) => {
            const percent = ((label.time.getTime() - timeRange.start.getTime()) / totalMs) * 100;
            return (
              <div 
                key={i} 
                className="time-label"
                style={{ left: `${percent}%` }}
              >
                {label.label}
              </div>
            );
          })}
          <div className="dinner-time-label">
            🍽️ Dinner
          </div>
        </div>
      </div>

      <div className="gantt-body">
        {Object.entries(tasksByMachine).map(([machine, tasks]) => (
          <MachineRow
            key={machine}
            machineName={machine}
            tasks={tasks}
            timeRange={timeRange}
            onTaskClick={onTaskClick}
          />
        ))}
        
        <div className="time-marker-container">
          <TimeMarker currentTime={currentTime} timeRange={timeRange} />
        </div>
      </div>
    </div>
  );
}

