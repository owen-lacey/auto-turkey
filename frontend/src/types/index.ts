export interface Machine {
  name: string;
  maxCapacity: number;
}

export interface PrepTask {
  id: number;
  dishName: string;
  taskName: string;
  description?: string;
  recipeUrl?: string;
  isComplete: boolean;
}

export interface ScheduledTask {
  id: number;
  dishName: string;
  taskName: string;
  machineName?: string;
  recipeUrl?: string;
  startTime: string;
  endTime: string;
  isComplete: boolean;
}

export interface Schedule {
  id: number;
  dinnerTime: string;
  machines: Machine[];
  prepTasks: PrepTask[];
  scheduledTasks: ScheduledTask[];
}

export interface ConfigResponse {
  dinnerTime: string;
  machines: Machine[];
  dishes: DishConfig[];
}

export interface DishConfig {
  name: string;
  recipeUrl?: string;
  prepTasks: PrepTaskConfig[];
  scheduledTasks: ScheduledTaskConfig[];
}

export interface PrepTaskConfig {
  name: string;
  description?: string;
}

export interface ScheduledTaskConfig {
  name: string;
  durationMinutes: number;
  machine?: string;
}

