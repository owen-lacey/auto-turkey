# Data Model: Christmas Dinner Planner

**Branch**: `001-christmas-dinner-planner` | **Date**: 2025-12-18

## Entity Overview

```
                         ┌─────────────────┐
                         │    Schedule     │
                         ├─────────────────┤
                         │ id              │
                         │ dinnerTime      │  (DateTime - includes date)
                         │ createdAt       │
                         └────────┬────────┘
                                  │ 1:many
                    ┌─────────────┴─────────────┐
                    │                           │
           ┌────────▼────────┐        ┌────────▼────────┐
           │ PrepTaskInstance│        │ScheduledTaskInst│
           ├─────────────────┤        ├─────────────────┤
           │ dishName        │        │ dishName        │
           │ taskName        │        │ taskName        │
           │ isComplete      │        │ machineName?    │
           └─────────────────┘        │ startTime       │
                                      │ endTime         │
                                      │ isComplete      │
                                      └─────────────────┘

Configuration (from JSON, not in DB):

┌─────────────────┐      ┌─────────────────┐
│    Machine      │      │     Dish        │
├─────────────────┤      ├─────────────────┤
│ name            │      │ name            │
│ maxCapacity     │      │ recipeUrl?      │
└─────────────────┘      │ prepTasks[]     │
                         │ scheduledTasks[]│
                         └─────────────────┘
```

## Configuration Entities (from JSON)

These are loaded from `dishes.json` at startup - not stored in the database.

### Machine
| Field | Type | Description |
|-------|------|-------------|
| name | string | Display name (e.g., "Kitchen Oven", "Hob") |
| maxCapacity | int | Max concurrent tasks (e.g., 1 for oven, 4 for hobs) |

### Dish
| Field | Type | Description |
|-------|------|-------------|
| name | string | Display name (e.g., "Turkey", "Roasties") |
| recipeUrl | string? | Optional external recipe link |
| prepTasks | PrepTaskConfig[] | Tasks done ahead of time |
| scheduledTasks | ScheduledTaskConfig[] | Tasks with timing/machine |

### PrepTaskConfig
| Field | Type | Description |
|-------|------|-------------|
| name | string | Activity name (e.g., "peel", "prep") |
| description | string? | Optional instructions |

### ScheduledTaskConfig
| Field | Type | Description |
|-------|------|-------------|
| name | string | Activity name (e.g., "roast", "boil") |
| durationMinutes | int | How long the task takes |
| machine | string? | Machine name (null = "Resting" row) |
| predecessors | string[]? | Task names that must complete first |

## Database Entities (SQLite)

These are persisted to track schedules and completion status.

### Schedule
| Column | Type | Description |
|--------|------|-------------|
| Id | int (PK) | Auto-increment ID |
| DinnerTime | DateTime | Target dinner date+time (e.g., 2024-12-25 15:00) |
| CreatedAt | datetime | When schedule was generated |

### ScheduledTaskInstance
| Column | Type | Description |
|--------|------|-------------|
| Id | int (PK) | Auto-increment ID |
| ScheduleId | int (FK) | Reference to Schedule |
| DishName | string | Which dish this belongs to |
| TaskName | string | Activity name |
| MachineName | string? | Assigned machine (null = Resting) |
| StartTime | datetime | Optimizer-calculated start |
| EndTime | datetime | Optimizer-calculated end |
| IsComplete | bool | User-toggled completion |
| CompletedAt | datetime? | When marked complete |

### PrepTaskInstance
| Column | Type | Description |
|--------|------|-------------|
| Id | int (PK) | Auto-increment ID |
| ScheduleId | int (FK) | Reference to Schedule |
| DishName | string | Which dish this belongs to |
| TaskName | string | Activity name |
| IsComplete | bool | User-toggled completion |
| CompletedAt | datetime? | When marked complete |

## EF Core Schema

```csharp
public class AppDbContext : DbContext
{
    public DbSet<Schedule> Schedules => Set<Schedule>();
    public DbSet<ScheduledTaskInstance> ScheduledTasks => Set<ScheduledTaskInstance>();
    public DbSet<PrepTaskInstance> PrepTasks => Set<PrepTaskInstance>();
}

public class Schedule
{
    public int Id { get; set; }
    public DateTime DinnerTime { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<ScheduledTaskInstance> ScheduledTasks { get; set; } = [];
    public List<PrepTaskInstance> PrepTasks { get; set; } = [];
}

public class ScheduledTaskInstance
{
    public int Id { get; set; }
    public int ScheduleId { get; set; }
    public string DishName { get; set; } = "";
    public string TaskName { get; set; } = "";
    public string? MachineName { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public bool IsComplete { get; set; }
    public DateTime? CompletedAt { get; set; }
}

public class PrepTaskInstance
{
    public int Id { get; set; }
    public int ScheduleId { get; set; }
    public string DishName { get; set; } = "";
    public string TaskName { get; set; } = "";
    public bool IsComplete { get; set; }
    public DateTime? CompletedAt { get; set; }
}
```

## API DTOs

### Response: ScheduleDto
```typescript
interface ScheduleDto {
  id: number;
  dinnerTime: string; // ISO datetime
  machines: MachineDto[];
  prepTasks: PrepTaskDto[];
  scheduledTasks: ScheduledTaskDto[];
}

interface MachineDto {
  name: string;
  maxCapacity: number;
}

interface PrepTaskDto {
  id: number;
  dishName: string;
  taskName: string;
  description?: string;
  recipeUrl?: string;
  isComplete: boolean;
}

interface ScheduledTaskDto {
  id: number;
  dishName: string;
  taskName: string;
  machineName?: string; // null = Resting
  recipeUrl?: string;
  startTime: string; // ISO datetime
  endTime: string;   // ISO datetime
  isComplete: boolean;
}
```

## State Transitions

### Task Completion
```
Pending → Complete
  trigger: User clicks task
  action: Set isComplete=true, completedAt=now()
  
Complete → Pending (toggle back)
  trigger: User clicks completed task
  action: Set isComplete=false, completedAt=null
```

No other state transitions needed (schedule is generated once, tasks are only toggled).

