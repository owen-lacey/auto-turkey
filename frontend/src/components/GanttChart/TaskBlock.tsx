import { useState } from 'react';
import type { ScheduledTask } from '../../types';
import { TaskPopover } from './TaskPopover';
import { getDishColor } from './dishColors';
import './GanttChart.css';

interface TaskBlockProps {
  task: ScheduledTask;
  startPercent: number;
  widthPercent: number;
  lane: number;
  isHighlighted: boolean;
  onHoverDish: (dishName: string | null) => void;
  onMarkComplete: () => void;
}

const LANE_HEIGHT = 48;
const TASK_HEIGHT = 36;
const TASK_MARGIN = 6;

export function TaskBlock({ 
  task, 
  startPercent, 
  widthPercent, 
  lane,
  isHighlighted,
  onHoverDish,
  onMarkComplete 
}: TaskBlockProps) {
  const [showPopover, setShowPopover] = useState(false);
  const label = `${task.dishName}: ${task.taskName}`;
  const topOffset = lane * LANE_HEIGHT + TASK_MARGIN;
  const dishColor = getDishColor(task.dishName);
  
  return (
    <>
      <div
        className={`task-block ${task.isComplete ? 'completed' : ''} ${isHighlighted ? 'highlighted' : ''}`}
        style={{
          left: `${startPercent}%`,
          width: `${widthPercent}%`,
          top: `${topOffset}px`,
          height: `${TASK_HEIGHT}px`,
          background: task.isComplete ? undefined : dishColor.bg,
          borderLeft: `3px solid ${dishColor.border}`,
        }}
        onClick={() => setShowPopover(true)}
        onMouseEnter={() => onHoverDish(task.dishName)}
        onMouseLeave={() => onHoverDish(null)}
        title={label}
      >
        <span className="task-label">{label}</span>
      </div>
      
      {showPopover && (
        <TaskPopover
          task={task}
          onMarkComplete={onMarkComplete}
          onClose={() => setShowPopover(false)}
        />
      )}
    </>
  );
}
