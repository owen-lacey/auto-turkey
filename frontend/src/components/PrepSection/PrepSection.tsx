import type { PrepTask, PrepTaskWhen } from '../../types';
import { PrepTaskItem } from './PrepTaskItem';
import './PrepSection.css';

interface PrepSectionProps {
  prepTasks: PrepTask[];
  onToggleTask: (id: number) => void;
}

interface PrepGroupConfig {
  key: PrepTaskWhen;
  title: string;
  subtitle: string;
}

const prepGroups: PrepGroupConfig[] = [
  { key: 'BeforeDay', title: 'Before the Day', subtitle: 'Can be done days in advance' },
  { key: 'Morning', title: 'Morning Of', subtitle: 'Do these on the morning of cooking day' },
];

export function PrepSection({ prepTasks, onToggleTask }: PrepSectionProps) {
  if (prepTasks.length === 0) {
    return null;
  }

  const completedCount = prepTasks.filter(t => t.isComplete).length;
  const totalCount = prepTasks.length;

  const tasksByWhen = prepGroups.map(group => ({
    ...group,
    tasks: prepTasks.filter(t => t.when === group.key)
  })).filter(group => group.tasks.length > 0);

  return (
    <section className="prep-section">
      <div className="prep-header">
        <h2>Prep Work</h2>
        <span className="prep-progress">
          {completedCount} / {totalCount} done
        </span>
      </div>
      
      {tasksByWhen.map(group => (
        <div key={group.key} className="prep-group">
          <div className="prep-group-header">
            <h3>{group.title}</h3>
            <span className="prep-group-progress">
              {group.tasks.filter(t => t.isComplete).length} / {group.tasks.length}
            </span>
          </div>
          <p className="prep-subtitle">{group.subtitle}</p>
          
          <div className="prep-tasks-grid">
            {group.tasks.map(task => (
              <PrepTaskItem
                key={task.id}
                task={task}
                onToggle={() => onToggleTask(task.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

