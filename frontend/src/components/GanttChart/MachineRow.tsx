import type { ScheduledTask } from '../../types';
import { TaskBlock } from './TaskBlock';
import './GanttChart.css';

interface MachineRowProps {
  machineName: string;
  tasks: ScheduledTask[];
  timeRange: { start: Date; end: Date };
  onTaskClick?: (taskId: number) => void;
}

export function MachineRow({ machineName, tasks, timeRange, onTaskClick }: MachineRowProps) {
  const totalMs = timeRange.end.getTime() - timeRange.start.getTime();

  const getTaskPosition = (task: ScheduledTask) => {
    const taskStart = new Date(task.startTime).getTime();
    const taskEnd = new Date(task.endTime).getTime();
    const startPercent = ((taskStart - timeRange.start.getTime()) / totalMs) * 100;
    const widthPercent = ((taskEnd - taskStart) / totalMs) * 100;
    return { startPercent, widthPercent };
  };

  return (
    <div className="machine-row">
      <div className="machine-label">{machineName}</div>
      <div className="machine-timeline">
        {tasks.map((task) => {
          const { startPercent, widthPercent } = getTaskPosition(task);
          return (
            <TaskBlock
              key={task.id}
              task={task}
              startPercent={startPercent}
              widthPercent={widthPercent}
              onClick={() => onTaskClick?.(task.id)}
            />
          );
        })}
      </div>
    </div>
  );
}

