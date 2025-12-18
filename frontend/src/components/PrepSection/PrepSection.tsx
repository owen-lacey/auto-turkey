import type { PrepTask } from '../../types';
import { PrepTaskItem } from './PrepTaskItem';
import './PrepSection.css';

interface PrepSectionProps {
  prepTasks: PrepTask[];
  onToggleTask: (id: number) => void;
}

export function PrepSection({ prepTasks, onToggleTask }: PrepSectionProps) {
  if (prepTasks.length === 0) {
    return null;
  }

  const completedCount = prepTasks.filter(t => t.isComplete).length;
  const totalCount = prepTasks.length;

  return (
    <section className="prep-section">
      <div className="prep-header">
        <h2>Prep Work</h2>
        <span className="prep-progress">
          {completedCount} / {totalCount} done
        </span>
      </div>
      <p className="prep-subtitle">Complete these tasks ahead of cooking day</p>
      
      <div className="prep-tasks-grid">
        {prepTasks.map(task => (
          <PrepTaskItem
            key={task.id}
            task={task}
            onToggle={() => onToggleTask(task.id)}
          />
        ))}
      </div>
    </section>
  );
}

