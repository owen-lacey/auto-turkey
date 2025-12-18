# Tasks: Christmas Dinner Planner

**Input**: Design documents from `/specs/001-christmas-dinner-planner/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not explicitly requested - test tasks omitted per constitution ("tests are welcome but NOT mandatory gates").

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, etc.)

## Path Conventions

- **Backend**: `backend/AutoTurkey.Api/`
- **Frontend**: `frontend/src/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create backend .NET 8 solution in `backend/` with `dotnet new sln -n AutoTurkey`
- [ ] T002 Create minimal API project in `backend/AutoTurkey.Api/` with `dotnet new web`
- [ ] T003 [P] Add NuGet packages: Google.OrTools, Microsoft.EntityFrameworkCore.Sqlite, Microsoft.EntityFrameworkCore.Design
- [ ] T004 [P] Create frontend React project in `frontend/` with Vite + TypeScript template
- [ ] T005 [P] Configure CORS in backend `Program.cs` to allow `http://localhost:5173`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 Create EF Core DbContext in `backend/AutoTurkey.Api/Data/AppDbContext.cs`
- [ ] T007 [P] Create Schedule entity in `backend/AutoTurkey.Api/Models/Schedule.cs`
- [ ] T008 [P] Create ScheduledTaskInstance entity in `backend/AutoTurkey.Api/Models/ScheduledTaskInstance.cs`
- [ ] T009 [P] Create PrepTaskInstance entity in `backend/AutoTurkey.Api/Models/PrepTaskInstance.cs`
- [ ] T010 Configure SQLite connection string and EF Core in `backend/AutoTurkey.Api/Program.cs`
- [ ] T011 Create initial EF Core migration with `dotnet ef migrations add InitialCreate`
- [ ] T012 [P] Create config DTOs (Machine, DishConfig, etc.) in `backend/AutoTurkey.Api/Models/Config/`
- [ ] T013 [P] Create sample `dishes.json` in `backend/AutoTurkey.Api/Data/dishes.json`
- [ ] T014 Implement ConfigLoader service in `backend/AutoTurkey.Api/Services/ConfigLoader.cs`
- [ ] T015 [P] Create TypeScript types in `frontend/src/types/index.ts` matching API DTOs
- [ ] T016 [P] Create API client in `frontend/src/services/api.ts` with fetch wrapper

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - View Optimized Cooking Schedule (Priority: P1) 🎯 MVP

**Goal**: Display a Gantt chart with machine rows, task blocks, current time marker, and dinner time as right edge

**Independent Test**: Load app with sample `dishes.json`, verify Gantt chart renders with tasks in correct machine rows

### Implementation for User Story 1

- [ ] T017 [US1] Implement GET `/api/config` endpoint in `backend/AutoTurkey.Api/Endpoints/ConfigEndpoints.cs`
- [ ] T018 [US1] Implement GET `/api/schedule` endpoint in `backend/AutoTurkey.Api/Endpoints/ScheduleEndpoints.cs`
- [ ] T019 [P] [US1] Create useSchedule hook in `frontend/src/hooks/useSchedule.ts`
- [ ] T020 [P] [US1] Create GanttChart container in `frontend/src/components/GanttChart/GanttChart.tsx`
- [ ] T021 [P] [US1] Create MachineRow component in `frontend/src/components/GanttChart/MachineRow.tsx`
- [ ] T022 [P] [US1] Create TaskBlock component in `frontend/src/components/GanttChart/TaskBlock.tsx`
- [ ] T023 [US1] Create TimeMarker component (current time line) in `frontend/src/components/GanttChart/TimeMarker.tsx`
- [ ] T024 [US1] Implement time-to-position calculation for task placement in GanttChart
- [ ] T025 [US1] Style Gantt chart with CSS (machine rows, timeline, dinner time right edge)
- [ ] T026 [US1] Integrate GanttChart into App.tsx with schedule data fetch
- [ ] T027 [US1] Handle "Resting" row for tasks without machine assignment

**Checkpoint**: User can view Gantt chart with tasks organized by machine rows, current time visible

---

## Phase 4: User Story 2 - Complete Prep Tasks Ahead of Time (Priority: P2)

**Goal**: Display prep tasks in a separate section, allow marking complete, show recipe links

**Independent Test**: View prep section, mark a prep task complete, verify it fades

### Implementation for User Story 2

- [ ] T028 [P] [US2] Create PrepSection container in `frontend/src/components/PrepSection/PrepSection.tsx`
- [ ] T029 [P] [US2] Create PrepTaskItem component in `frontend/src/components/PrepSection/PrepTaskItem.tsx`
- [ ] T030 [US2] Implement POST `/api/tasks/prep/{id}/complete` endpoint in `backend/AutoTurkey.Api/Endpoints/TasksEndpoints.cs`
- [ ] T031 [US2] Add toggle completion logic in PrepTaskItem (API call + optimistic UI update)
- [ ] T032 [P] [US2] Create RecipeLink component in `frontend/src/components/RecipeLink.tsx`
- [ ] T033 [US2] Integrate RecipeLink into PrepTaskItem (if dish has recipeUrl)
- [ ] T034 [US2] Style completed prep tasks with reduced opacity
- [ ] T035 [US2] Integrate PrepSection into App.tsx above Gantt chart

**Checkpoint**: User can view prep tasks, mark them complete (faded), click recipe links

---

## Phase 5: User Story 3 - Track Task Completion (Priority: P3)

**Goal**: Mark scheduled tasks complete on the Gantt chart with visual feedback

**Independent Test**: Click a task on Gantt chart, verify it fades and status persists on refresh

### Implementation for User Story 3

- [ ] T036 [US3] Implement POST `/api/tasks/scheduled/{id}/complete` endpoint in `backend/AutoTurkey.Api/Endpoints/TasksEndpoints.cs`
- [ ] T037 [US3] Add click handler to TaskBlock component for completion toggle
- [ ] T038 [US3] Add completion state management in useSchedule hook
- [ ] T039 [US3] Style completed scheduled tasks with reduced opacity in TaskBlock
- [ ] T040 [US3] Integrate RecipeLink into TaskBlock (if dish has recipeUrl)

**Checkpoint**: User can mark Gantt chart tasks complete, completion persists across page refresh

---

## Phase 6: User Story 4 - Define Recipes and Tasks (Priority: P4)

**Goal**: Technical user can edit dishes.json to configure Christmas dinner menu

**Independent Test**: Edit dishes.json, restart backend, verify new dish appears in schedule

### Implementation for User Story 4

- [ ] T041 [US4] Expand sample `dishes.json` with full Christmas dinner menu (Turkey, Roasties, Sprouts, etc.)
- [ ] T042 [US4] Add validation in ConfigLoader for required fields (name, durationMinutes, etc.)
- [ ] T043 [US4] Document dishes.json schema in a comment or README section
- [ ] T044 [US4] Handle config reload on backend startup (no hot reload needed)

**Checkpoint**: Technical user can define complete Christmas menu in JSON, app loads and displays it

---

## Phase 7: User Story 5 - Generate Optimal Schedule (Priority: P5)

**Goal**: OR-Tools generates an optimized schedule respecting machine capacities, targeting dinner time

**Independent Test**: POST to `/api/schedule`, verify generated schedule has no machine conflicts and ends at dinner time

### Implementation for User Story 5

- [ ] T045 [US5] Create ScheduleOptimizer service in `backend/AutoTurkey.Api/Services/ScheduleOptimizer.cs`
- [ ] T046 [US5] Implement job shop model: map dishes to jobs, tasks to operations, machines to resources
- [ ] T047 [US5] Implement maxCapacity constraint (e.g., Hob with capacity 4 = 4 virtual machines)
- [ ] T048 [US5] Implement backwards scheduling: set dinner time as horizon, minimize slack
- [ ] T049 [US5] Implement POST `/api/schedule` endpoint calling ScheduleOptimizer
- [ ] T050 [US5] Save generated schedule to database (Schedule + PrepTaskInstance + ScheduledTaskInstance)
- [ ] T051 [US5] Create PrepTaskInstance records for each dish's prep tasks
- [ ] T052 [US5] Add "Generate Schedule" button in frontend App.tsx
- [ ] T053 [US5] Call POST `/api/schedule` from frontend and refresh Gantt chart

**Checkpoint**: User can generate optimized schedule, view it in Gantt chart with all dishes ready at dinner time

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements affecting multiple user stories

- [ ] T054 [P] Add loading states to frontend components while fetching data
- [ ] T055 [P] Add error handling for failed API calls in frontend
- [ ] T056 [P] Style App.tsx layout (header, prep section, Gantt chart arrangement)
- [ ] T057 Verify quickstart.md instructions work end-to-end
- [ ] T058 [P] Add basic responsive styling for mobile/tablet viewing

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
- **Polish (Phase 8)**: Depends on desired user stories being complete

### User Story Dependencies

| Story | Depends On | Notes |
|-------|------------|-------|
| US1 (P1) | Foundational | Core MVP - Gantt chart display |
| US2 (P2) | Foundational | Prep section - independent of US1 |
| US3 (P3) | US1 | Extends TaskBlock from US1 |
| US4 (P4) | Foundational | Config enhancement - independent |
| US5 (P5) | Foundational | OR-Tools scheduler - independent |

### Within Each User Story

- Backend endpoints before frontend integration
- Components before container integration
- Core functionality before styling

### Parallel Opportunities

- Setup: T003, T004, T005 can run in parallel
- Foundational: T007, T008, T009 (models) can run in parallel
- Foundational: T012, T013, T015, T016 can run in parallel
- US1: T019, T020, T021, T022 (components) can run in parallel
- US2: T028, T029, T032 (components) can run in parallel
- US5 can be developed independently while US2/US3 are in progress

---

## Parallel Example: User Story 1

```bash
# Launch frontend components in parallel:
Task T020: "Create GanttChart container"
Task T021: "Create MachineRow component"
Task T022: "Create TaskBlock component"

# Then integrate:
Task T024: "Implement time-to-position calculation"
Task T026: "Integrate GanttChart into App.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (with hardcoded sample schedule)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Gantt chart displays with sample data
5. Can use with manually created schedule in database

### Incremental Delivery

1. Setup + Foundational → Project scaffolded
2. Add US1 → View schedule (MVP!)
3. Add US2 → Prep tasks before cooking day
4. Add US3 → Track progress while cooking
5. Add US4 → Full Christmas menu configured
6. Add US5 → Auto-generated optimal schedule

### Single Developer Strategy

Recommended order: US1 → US4 → US5 → US2 → US3

Rationale:
- US1 gives visual feedback immediately
- US4 + US5 enable the core "auto" scheduling feature
- US2 + US3 add tracking (less critical for initial use)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Constitution: "Tests welcome but NOT mandatory" - no test tasks included

