# Research: Christmas Dinner Planner

**Branch**: `001-christmas-dinner-planner` | **Date**: 2025-12-18

## Technology Decisions

### 1. Schedule Optimization: Google OR-Tools (Job Shop Problem)

**Decision**: Use Google OR-Tools CP-SAT solver with job shop scheduling model

**Rationale**: 
- The Christmas dinner scheduling problem maps directly to the classic [Job Shop Problem](https://developers.google.com/optimization/scheduling/job_shop)
- Each dish = a "job" with a sequence of tasks
- Each machine (oven, hob, chef) = a "machine" with capacity constraints
- OR-Tools handles precedence constraints (task A must finish before task B) and no-overlap constraints (machine can't do two things at once)
- .NET bindings available via NuGet package `Google.OrTools`

**Mapping to our domain**:
| Job Shop Concept | Our Domain |
|------------------|------------|
| Job | Dish (e.g., Turkey) |
| Task | Scheduled task (e.g., "roast") |
| Machine | Machine (e.g., Kitchen Oven) |
| Processing time | Task duration |
| Makespan | Time from first task to dinner time |

**Key adaptation**: Instead of minimizing makespan (typical job shop objective), we work **backwards from dinner time** to ensure all dishes finish together.

**Alternatives considered**:
- Manual scheduling: Too complex with many dishes and constraints
- Simple greedy algorithm: Wouldn't respect all constraints optimally
- Other solvers (Z3, Gurobi): OR-Tools is free, well-documented, and has .NET support

### 2. Database: SQLite with Entity Framework Core

**Decision**: SQLite via EF Core

**Rationale**:
- Single file database, no server setup required
- Perfect for local-only single-user application
- EF Core provides migrations and type-safe queries
- Stores: generated schedules, task completion status

**Alternatives considered**:
- LiteDB: Simpler but less mainstream, fewer resources
- JSON files: Would work but querying completion status is clunky
- PostgreSQL: Overkill for local single-user app

### 3. Frontend: React with TypeScript + Vite

**Decision**: React 18+ with Vite bundler

**Rationale**:
- User-specified requirement
- Fast development with Vite HMR
- TypeScript for type safety with API contracts
- Rich ecosystem for Gantt chart rendering

**Gantt Chart approach**:
- Build custom with CSS Grid/Flexbox (simplest for our specific layout)
- Machine rows as flex containers
- Task blocks positioned absolutely by time
- Alternative: Use a library like `react-gantt-timeline` if custom gets complex

### 4. Backend: .NET 8 Minimal API

**Decision**: .NET 8 with Minimal API pattern

**Rationale**:
- User-specified requirement
- Minimal APIs reduce boilerplate vs. controllers
- Native OR-Tools support via NuGet
- Single `Program.cs` can define all endpoints for a small API

### 5. Configuration Storage

**Decision**: JSON file (`dishes.json`) loaded at startup

**Rationale**:
- User specified config should be "in code" / source-editable
- JSON is human-readable and easy to edit
- No UI needed for configuration
- Can be version controlled with the app

**Structure**:
```json
{
  "dinnerTime": "2024-12-25T15:00:00",
  "machines": [
    { "name": "Kitchen Oven", "maxCapacity": 1 },
    { "name": "Hob", "maxCapacity": 4 }
  ],
  "dishes": [
    {
      "name": "Turkey",
      "recipeUrl": "https://...",
      "prepTasks": [{ "name": "prep", "description": "..." }],
      "scheduledTasks": [
        { "name": "roast", "durationMinutes": 240, "machine": "Kitchen Oven" }
      ]
    }
  ]
}
```

## OR-Tools Integration Notes

### NuGet Package
```
Google.OrTools
```

### Key Classes
- `CpModel` - Define the constraint model
- `CpSolver` - Solve the model
- `IntervalVar` - Represent task intervals
- `AddNoOverlap` - Ensure machine doesn't double-book

### Backwards Scheduling Approach

Standard job shop minimizes makespan. We need to:
1. Calculate minimum time needed (sum of critical path durations)
2. Set dinner time as the "horizon" 
3. Constrain all final tasks to end at or before dinner time
4. Minimize the gap between task end times and dinner time (so dishes finish together)

### Handling maxCapacity > 1

For machines like "Hob" with maxCapacity: 4:
- Model as 4 separate "virtual machines" (Hob-1, Hob-2, Hob-3, Hob-4)
- Task can be assigned to any one of them
- OR-Tools handles the assignment optimization

## Open Questions (Resolved)

| Question | Resolution |
|----------|------------|
| How to handle "resting" tasks with no machine? | Create a "Resting" pseudo-machine with unlimited capacity |
| How to persist task completion? | SQLite table with task ID and completion timestamp |
| How to handle prep tasks in the model? | Exclude from optimizer; they have no duration/timing constraints |

