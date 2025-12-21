import { useMemo } from 'react';
import type { ScheduledTask } from '../../types';
import { TaskBlock } from './TaskBlock';
import './GanttChart.css';

interface MachineRowProps {
  machineName: string;
  tasks: ScheduledTask[];
  timeRange: { start: Date; end: Date };
  hoveredDish: string | null;
  onHoverDish: (dishName: string | null) => void;
  onMarkTaskComplete: (taskId: number) => void;
}

// Assign lanes to overlapping tasks so they stack vertically
function assignLanes(tasks: ScheduledTask[]): Map<number, number> {
  const laneAssignments = new Map<number, number>();
  
  // Sort by start time
  const sorted = [...tasks].sort((a, b) => 
    new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );
  
  // Track when each lane becomes free (end time of task in that lane)
  const laneEndTimes: number[] = [];
  
  for (const task of sorted) {
    const taskStart = new Date(task.startTime).getTime();
    
    // Find the first lane where the task fits (no overlap)
    let assignedLane = -1;
    for (let i = 0; i < laneEndTimes.length; i++) {
      if (laneEndTimes[i] <= taskStart) {
        assignedLane = i;
        break;
      }
    }
    
    // If no existing lane fits, create a new one
    if (assignedLane === -1) {
      assignedLane = laneEndTimes.length;
      laneEndTimes.push(0);
    }
    
    // Update lane end time and assign
    laneEndTimes[assignedLane] = new Date(task.endTime).getTime();
    laneAssignments.set(task.id, assignedLane);
  }
  
  return laneAssignments;
}

export function MachineRow({ 
  machineName, 
  tasks, 
  timeRange, 
  hoveredDish,
  onHoverDish,
  onMarkTaskComplete 
}: MachineRowProps) {
  const totalMs = timeRange.end.getTime() - timeRange.start.getTime();

  const laneAssignments = useMemo(() => assignLanes(tasks), [tasks]);
  const laneCount = useMemo(() => {
    const maxLane = Math.max(...Array.from(laneAssignments.values()), 0);
    return maxLane + 1;
  }, [laneAssignments]);

  const getTaskPosition = (task: ScheduledTask) => {
    const taskStart = new Date(task.startTime).getTime();
    const taskEnd = new Date(task.endTime).getTime();
    const startPercent = ((taskStart - timeRange.start.getTime()) / totalMs) * 100;
    const widthPercent = ((taskEnd - taskStart) / totalMs) * 100;
    return { startPercent, widthPercent };
  };

  const rowHeight = 48 * laneCount;

  return (
    <div className="machine-row" style={{ minHeight: `${rowHeight}px` }}>
      <div className="machine-label">{machineName}</div>
      <div className="machine-timeline" style={{ minHeight: `${rowHeight}px` }}>
        {tasks.map((task) => {
          const { startPercent, widthPercent } = getTaskPosition(task);
          const lane = laneAssignments.get(task.id) ?? 0;
          return (
            <TaskBlock
              key={task.id}
              task={task}
              startPercent={startPercent}
              widthPercent={widthPercent}
              lane={lane}
              isHighlighted={hoveredDish === task.dishName}
              onHoverDish={onHoverDish}
              onMarkComplete={() => onMarkTaskComplete(task.id)}
            />
          );
        })}
      </div>
    </div>
  );
}
