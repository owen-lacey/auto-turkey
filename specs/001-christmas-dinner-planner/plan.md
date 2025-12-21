# Implementation Plan: Christmas Dinner Planner

**Branch**: `001-christmas-dinner-planner` | **Date**: 2025-12-18 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-christmas-dinner-planner/spec.md`

## Summary

A web application to help cook Christmas dinner by generating an optimized cooking schedule displayed as a Gantt chart. The system uses Google OR-Tools' job shop solver to schedule cooking tasks across machines (ovens, hobs, chef) while respecting capacity constraints, targeting a configured dinner time. Users view prep tasks separately, track completion, and follow the schedule on cooking day.

## Technical Context

**Frontend**: React 18+ with TypeScript  
**Backend**: .NET 8 Minimal API (C#)  
**Optimization**: Google OR-Tools (CP-SAT solver, job shop scheduling)  
**Storage**: SQLite via Entity Framework Core (local-only, simplest option)  
**Testing**: xUnit (.NET), Vitest (React)  
**Target Platform**: Local development (runs on localhost)  
**Project Type**: Web application (React frontend + .NET backend)  
**Performance Goals**: N/A (single user, local)  
**Constraints**: Must run locally without external services  
**Scale/Scope**: Single user, ~20-30 dishes max

## Constitution Check

*Quick sanity check—not a blocker, just a reminder.*

- [x] **Speed First**: Am I building the simplest thing that works?
  - SQLite (no server setup), minimal API (less ceremony), hardcoded config initially
- [x] **MVP Always**: Can I ship something usable after this work session?
  - P1 (view schedule) is the first deliverable - just render a pre-made schedule
- [x] **Embrace the Mess**: Am I over-engineering? (If yes, cut scope.)
  - No auth, no multi-user, config in code, schedule generated on-demand

## Project Structure

### Documentation (this feature)

```text
specs/001-christmas-dinner-planner/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── api.yaml         # OpenAPI spec
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
backend/
├── AutoTurkey.Api/
│   ├── Program.cs           # Minimal API entry point
│   ├── Endpoints/           # API endpoint modules
│   │   ├── MachinesEndpoints.cs
│   │   ├── DishesEndpoints.cs
│   │   ├── ScheduleEndpoints.cs
│   │   └── TasksEndpoints.cs
│   ├── Models/              # Domain entities
│   │   ├── Machine.cs
│   │   ├── Dish.cs
│   │   ├── PrepTask.cs
│   │   ├── ScheduledTask.cs
│   │   └── Schedule.cs
│   ├── Services/            # Business logic
│   │   ├── ScheduleOptimizer.cs    # OR-Tools integration
│   │   └── ConfigLoader.cs         # Load dishes/machines from JSON
│   ├── Data/
│   │   ├── AppDbContext.cs
│   │   └── dishes.json      # Dish/recipe configuration
│   └── AutoTurkey.Api.csproj
└── AutoTurkey.Api.Tests/
    └── ScheduleOptimizerTests.cs

frontend/
├── src/
│   ├── components/
│   │   ├── GanttChart/
│   │   │   ├── GanttChart.tsx
│   │   │   ├── MachineRow.tsx
│   │   │   ├── TaskBlock.tsx
│   │   │   └── TimeMarker.tsx
│   │   ├── PrepSection/
│   │   │   ├── PrepSection.tsx
│   │   │   └── PrepTaskItem.tsx
│   │   └── RecipeLink.tsx
│   ├── hooks/
│   │   └── useSchedule.ts
│   ├── services/
│   │   └── api.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── vite.config.ts
└── tsconfig.json
```

**Structure Decision**: Web application structure with separate frontend (React/Vite) and backend (.NET 8) directories. The backend serves both the API and static frontend files in production. Configuration (dishes, machines, dinner time) stored in `dishes.json` for easy editing.

## Complexity Tracking

No constitution violations. The plan follows the simplest viable approach:
- SQLite instead of a database server
- Minimal API instead of controllers
- Config in JSON file instead of database/UI
- No authentication (single user, local)
