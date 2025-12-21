import type { ScheduledTask } from '../../types';
import './GanttChart.css';

interface TaskPopoverProps {
  task: ScheduledTask;
  onMarkComplete: () => void;
  onClose: () => void;
}

export function TaskPopover({ task, onMarkComplete, onClose }: TaskPopoverProps) {
  const startTime = new Date(task.startTime);
  const endTime = new Date(task.endTime);
  const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 60000);
  
  const formatTime = (date: Date) => 
    date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      <div className="popover-backdrop" onClick={onClose} />
      <div className="task-popover" onClick={(e) => e.stopPropagation()}>
        <div className="popover-header">
          <span className="popover-dish">{task.dishName}</span>
          <button className="popover-close" onClick={onClose}>×</button>
        </div>
        
        <h3 className="popover-task-name">{task.taskName}</h3>
        
        <div className="popover-details">
          <div className="popover-detail">
            <span className="detail-label">Time</span>
            <span className="detail-value">{formatTime(startTime)} – {formatTime(endTime)}</span>
          </div>
          <div className="popover-detail">
            <span className="detail-label">Duration</span>
            <span className="detail-value">{durationMinutes} minutes</span>
          </div>
          {task.machineName && (
            <div className="popover-detail">
              <span className="detail-label">Using</span>
              <span className="detail-value">{task.machineName}</span>
            </div>
          )}
        </div>

        <div className="popover-actions">
          {task.recipeUrl && (
            <a
              href={task.recipeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="popover-btn popover-btn-secondary"
            >
              📖 View Recipe
            </a>
          )}
          <button 
            className={`popover-btn ${task.isComplete ? 'popover-btn-undo' : 'popover-btn-primary'}`}
            onClick={() => {
              onMarkComplete();
              onClose();
            }}
          >
            {task.isComplete ? '↩ Mark Incomplete' : '✓ Mark Complete'}
          </button>
        </div>
      </div>
    </>
  );
}


