import { useState, useEffect, useCallback } from 'react';
import type { Schedule } from '../types';
import { getSchedule, togglePrepTaskComplete, toggleScheduledTaskComplete } from '../services/api';

export function useSchedule() {
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedule = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSchedule();
      setSchedule(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch schedule');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  const togglePrepTask = async (id: number) => {
    try {
      const updatedTask = await togglePrepTaskComplete(id);
      setSchedule(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          prepTasks: prev.prepTasks.map(t => 
            t.id === id ? { ...t, isComplete: updatedTask.isComplete } : t
          )
        };
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle task');
    }
  };

  const toggleScheduledTask = async (id: number) => {
    try {
      const updatedTask = await toggleScheduledTaskComplete(id);
      setSchedule(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          scheduledTasks: prev.scheduledTasks.map(t => 
            t.id === id ? { ...t, isComplete: updatedTask.isComplete } : t
          )
        };
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle task');
    }
  };

  return {
    schedule,
    loading,
    error,
    refetch: fetchSchedule,
    togglePrepTask,
    toggleScheduledTask,
  };
}

