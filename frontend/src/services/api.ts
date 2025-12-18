import type { Schedule, PrepTask, ScheduledTask, ConfigResponse } from '../types';

const API_BASE = 'http://localhost:5146/api';

export async function getSchedule(): Promise<Schedule | null> {
  const response = await fetch(`${API_BASE}/schedule`);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error('Failed to fetch schedule');
  }
  return response.json();
}

export async function generateSchedule(): Promise<Schedule> {
  const response = await fetch(`${API_BASE}/schedule`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Failed to generate schedule');
  }
  return response.json();
}

export async function getConfig(): Promise<ConfigResponse> {
  const response = await fetch(`${API_BASE}/config`);
  if (!response.ok) {
    throw new Error('Failed to fetch config');
  }
  return response.json();
}

export async function togglePrepTaskComplete(id: number): Promise<PrepTask> {
  const response = await fetch(`${API_BASE}/tasks/prep/${id}/complete`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Failed to toggle prep task');
  }
  return response.json();
}

export async function toggleScheduledTaskComplete(id: number): Promise<ScheduledTask> {
  const response = await fetch(`${API_BASE}/tasks/scheduled/${id}/complete`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Failed to toggle scheduled task');
  }
  return response.json();
}

