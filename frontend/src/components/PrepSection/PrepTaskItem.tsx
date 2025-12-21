import type { PrepTask } from '../../types';
import { RecipeLink } from '../RecipeLink';
import './PrepSection.css';

interface PrepTaskItemProps {
  task: PrepTask;
  onToggle: () => void;
}

export function PrepTaskItem({ task, onToggle }: PrepTaskItemProps) {
  return (
    <div 
      className={`prep-task-item ${task.isComplete ? 'completed' : ''}`}
      onClick={onToggle}
    >
      <div className="prep-checkbox">
        {task.isComplete ? '✓' : ''}
      </div>
      <div className="prep-task-content">
        <div className="prep-task-header">
          <span className="prep-task-dish">{task.dishName}</span>
          <span className="prep-task-name">{task.taskName}</span>
          {task.recipeUrl && (
            <RecipeLink url={task.recipeUrl} />
          )}
        </div>
        {task.description && (
          <p className="prep-task-description">{task.description}</p>
        )}
      </div>
    </div>
  );
}

