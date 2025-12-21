# Tasks: Dynamic Dinner Time

**Input**: Design documents from `/specs/002-dynamic-dinner-time/`  
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/ ✓

**Tests**: Not included (constitution: tests not mandatory)

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- File paths are relative to repository root

---

## Phase 1: Setup

**Purpose**: No new project setup needed - adding to existing codebase

- [x] T001 Delete existing database to ensure clean schema in backend/AutoTurkey.Api/autoturkey.db

**Checkpoint**: Ready for foundational changes

---

## Phase 2: Foundational (Backend Infrastructure)

**Purpose**: Core backend changes that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Data Model Changes

- [x] T002 [P] Create Setting entity in backend/AutoTurkey.Api/Models/Setting.cs
- [x] T003 [P] Remove DinnerTime property from backend/AutoTurkey.Api/Models/Config/AppConfig.cs
- [x] T004 [P] Remove dinnerTime field from backend/AutoTurkey.Api/Data/dishes.json
- [x] T005 Add Settings DbSet and configure unique index in backend/AutoTurkey.Api/Data/AppDbContext.cs

### Service Changes

- [x] T006 Update ScheduleOptimizer.GenerateSchedule() to accept DateTime dinnerTime parameter in backend/AutoTurkey.Api/Services/ScheduleOptimizer.cs

### API Endpoints

- [x] T007 [P] Create SettingsEndpoints with GET/PUT/DELETE /api/settings/dinner-time in backend/AutoTurkey.Api/Endpoints/SettingsEndpoints.cs
- [x] T008 [P] Add GET /api/config/total-duration endpoint in backend/AutoTurkey.Api/Endpoints/ConfigEndpoints.cs
- [x] T009 Update POST /api/schedule to accept dinnerTime in request body in backend/AutoTurkey.Api/Endpoints/ScheduleEndpoints.cs
- [x] T010 Remove dinnerTime from GET /api/config response in backend/AutoTurkey.Api/Endpoints/ConfigEndpoints.cs
- [x] T011 Register SettingsEndpoints in backend/AutoTurkey.Api/Program.cs

**Checkpoint**: Backend API ready - verify with curl commands from quickstart.md

---

## Phase 3: User Story 1 - View Schedule with Default Time (Priority: P1) 🎯 MVP

**Goal**: System works immediately without requiring dinner time configuration. Users see schedule with default time = now + cooking duration.

**Independent Test**: Open app without saved dinner time → schedule displays with calculated default

### Frontend Types

- [x] T012 [P] [US1] Add TotalDurationResponse type in frontend/src/types/index.ts
- [x] T013 [P] [US1] Remove dinnerTime from ConfigResponse type in frontend/src/types/index.ts

### Frontend API

- [x] T014 [US1] Add getTotalDuration() function in frontend/src/services/api.ts

### Frontend Integration

- [x] T015 [US1] Update App.tsx to fetch total duration and calculate default dinner time in frontend/src/App.tsx
- [x] T016 [US1] Update generateSchedule() call to pass dinnerTime in request body in frontend/src/services/api.ts
- [x] T017 [US1] Display calculated default time in header (temporarily, before time picker) in frontend/src/App.tsx

**Checkpoint**: App loads and shows schedule with default dinner time (now + duration). No time picker yet.

---

## Phase 4: User Story 2 - Set Custom Dinner Time (Priority: P2)

**Goal**: Users can set a specific dinner time using a native time picker. Time persists across sessions.

**Independent Test**: Select time in picker → schedule regenerates → refresh page → same time is used

### Frontend Types

- [x] T018 [P] [US2] Add DinnerTimeResponse type in frontend/src/types/index.ts

### Frontend API

- [x] T019 [P] [US2] Add getDinnerTime() function in frontend/src/services/api.ts
- [x] T020 [P] [US2] Add setDinnerTime(time) function in frontend/src/services/api.ts

### Frontend Hook

- [x] T021 [US2] ~~Create useDinnerTime hook~~ (Simplified: state managed directly in App.tsx)

### Frontend Component

- [x] T022 [P] [US2] ~~Create DinnerTimePicker component~~ (Simplified: inline in App.tsx)
- [x] T023 [P] [US2] Create DinnerTimePicker styles in frontend/src/App.css
- [x] T024 [P] [US2] ~~Create DinnerTimePicker barrel export~~ (Simplified: inline in App.tsx)

### Frontend Integration

- [x] T025 [US2] Integrate time picker in App.tsx header replacing static display in frontend/src/App.tsx
- [x] T026 [US2] Wire up time picker change to save and regenerate schedule in frontend/src/App.tsx

**Checkpoint**: Time picker visible, selecting time saves to DB and regenerates schedule. Persists on refresh.

---

## Phase 5: User Story 3 - Change Dinner Time (Priority: P3)

**Goal**: Users can modify dinner time at any point, including clearing to revert to calculated default.

**Independent Test**: Set time → change to new time → schedule updates. Clear time → reverts to default.

### Frontend API

- [x] T027 [P] [US3] Add clearDinnerTime() function in frontend/src/services/api.ts

### Frontend Component Update

- [x] T028 [US3] Add clear button in App.tsx (inline with time picker)
- [x] T029 [US3] Style clear button in frontend/src/App.css

### Frontend Integration

- [x] T030 [US3] Wire up clear button to clearDinnerTime and revert to default in frontend/src/App.tsx

**Checkpoint**: Full dinner time management working - set, change, clear all function correctly.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final cleanup and validation

- [x] T031 [P] Verify all quickstart.md curl commands work as expected
- [x] T032 [P] Test full user flow: load → default time → set time → change → clear → refresh
- [x] T033 Remove any TODO comments or dead code

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) → Phase 2 (Foundational) → User Stories can proceed
                                          ├── Phase 3 (US1) - MVP
                                          ├── Phase 4 (US2) - depends on US1 concepts but independently testable
                                          └── Phase 5 (US3) - depends on US2 time picker
                                                    ↓
                                              Phase 6 (Polish)
```

### User Story Dependencies

| Story | Depends On | Can Start After |
|-------|------------|-----------------|
| US1 (P1) | Foundational only | Phase 2 complete |
| US2 (P2) | US1 types/API | Phase 3 complete |
| US3 (P3) | US2 time picker | Phase 4 complete |

### Within Each Phase

- Tasks marked [P] can run in parallel
- Non-[P] tasks have implicit ordering (top to bottom)

---

## Parallel Opportunities

### Phase 2: Foundational

```bash
# Parallel batch 1 (data model):
T002: Create Setting entity
T003: Remove DinnerTime from AppConfig
T004: Remove dinnerTime from dishes.json

# Then sequentially:
T005: Add Settings DbSet (depends on T002)
T006: Update ScheduleOptimizer

# Parallel batch 2 (endpoints):
T007: Create SettingsEndpoints
T008: Add total-duration endpoint
T009: Update schedule endpoint
T010: Update config endpoint

# Then:
T011: Register endpoints
```

### Phase 4: User Story 2

```bash
# Parallel batch (types + API):
T018: Add DinnerTimeResponse type
T019: Add getDinnerTime function
T020: Add setDinnerTime function

# Then:
T021: Create useDinnerTime hook

# Parallel batch (component files):
T022: Create DinnerTimePicker.tsx
T023: Create DinnerTimePicker.css
T024: Create index.ts barrel

# Then:
T025, T026: Integration
```

---

## Implementation Strategy

### MVP First (Recommended)

1. ✅ Complete Phase 1: Setup (delete old DB)
2. ✅ Complete Phase 2: Foundational (all backend changes)
3. ✅ Complete Phase 3: User Story 1 (default time works)
4. **STOP and VALIDATE**: App loads with calculated default time
5. ✅ Complete Phase 4: User Story 2 (time picker works)
6. ✅ Complete Phase 5: User Story 3 (clear works)
7. ✅ Complete Phase 6: Polish

### Total Estimated Effort

- Phase 1: 1 task
- Phase 2: 10 tasks
- Phase 3: 6 tasks (US1)
- Phase 4: 9 tasks (US2)
- Phase 5: 4 tasks (US3)
- Phase 6: 3 tasks

**Total**: 33 tasks

---

## Notes

- Constitution reminder: Tests not mandatory, embrace the mess, ship fast
- [P] tasks = different files, safe to parallelize
- Commit after each phase completion
- Delete autoturkey.db before starting to get clean schema
- Backend changes are mostly in Phase 2; frontend changes spread across US1-US3

