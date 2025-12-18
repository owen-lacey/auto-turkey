import type { ScheduledTask } from '../../types';
import './GanttChart.css';

interface TaskBlockProps {
  task: ScheduledTask;
  startPercent: number;
  widthPercent: number;
  onClick?: () => void;
}

export function TaskBlock({ task, startPercent, widthPercent, onClick }: TaskBlockProps) {
  const label = `${task.dishName}: ${task.taskName}`;
  
  return (
    <div
      className={`task-block ${task.isComplete ? 'completed' : ''}`}
      style={{
        left: `${startPercent}%`,
        width: `${widthPercent}%`,
      }}
      onClick={onClick}
      title={label}
    >
      <span className="task-label">{label}</span>
      {task.recipeUrl && (
        <a
          href={task.recipeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="recipe-link"
          onClick={(e) => e.stopPropagation()}
        >
          📖
        </a>
      )}
    </div>
  );
}

