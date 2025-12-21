# Implementation Plan: Dynamic Dinner Time

**Branch**: `002-dynamic-dinner-time` | **Date**: 2025-12-21 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/002-dynamic-dinner-time/spec.md`

## Summary

Move dinner time configuration from a hardcoded value in `dishes.json` to a user-configurable setting stored in the database. The system works without a dinner time being set (using a calculated default of "now + cooking duration"), and users can optionally set a specific dinner time using a native HTML time picker.

## Technical Context

**Language/Version**: C# .NET 8, TypeScript 5.x  
**Primary Dependencies**: ASP.NET Core Minimal APIs, EF Core 8, React 18, Vite  
**Storage**: SQLite via EF Core  
**Testing**: Manual testing (constitution: tests not mandatory)  
**Target Platform**: Web application (localhost development)  
**Project Type**: Web application (frontend + backend)  
**Performance Goals**: N/A (single-user application)  
**Constraints**: None  
**Scale/Scope**: Single user, single schedule at a time

## Constitution Check

*Quick sanity check—not a blocker, just a reminder.*

- [x] **Speed First**: Am I building the simplest thing that works?
  - Yes: Using existing Settings table pattern, native HTML time picker, minimal API changes
- [x] **MVP Always**: Can I ship something usable after this work session?
  - Yes: Core flow (view schedule without setting time, set time, change time) is small and focused
- [x] **Embrace the Mess**: Am I over-engineering? (If yes, cut scope.)
  - No: Reusing existing patterns, no new abstractions, simple key-value storage

## Project Structure

### Documentation (this feature)

```text
specs/002-dynamic-dinner-time/
├── plan.md              # This file
├── research.md          # Technology decisions ✓
├── data-model.md        # Entity definitions ✓
├── quickstart.md        # Setup instructions ✓
├── contracts/           # API contracts ✓
│   └── api.yaml
└── tasks.md             # Implementation tasks (created by /speckit.tasks)
```

### Source Code (repository root)

```text
backend/
├── AutoTurkey.Api/
│   ├── Data/
│   │   ├── AppDbContext.cs          # Add Settings DbSet
│   │   └── dishes.json              # Remove dinnerTime field
│   ├── Endpoints/
│   │   ├── ConfigEndpoints.cs       # Add total-duration endpoint
│   │   ├── ScheduleEndpoints.cs     # Accept dinnerTime parameter
│   │   └── SettingsEndpoints.cs     # NEW: Dinner time CRUD
│   ├── Models/
│   │   ├── Config/
│   │   │   └── AppConfig.cs         # Remove DinnerTime property
│   │   └── Setting.cs               # NEW: Settings entity
│   └── Services/
│       └── ScheduleOptimizer.cs     # Accept dinnerTime parameter

frontend/
├── src/
│   ├── components/
│   │   └── DinnerTimePicker/        # NEW: Time picker component
│   │       ├── DinnerTimePicker.tsx
│   │       ├── DinnerTimePicker.css
│   │       └── index.ts
│   ├── hooks/
│   │   └── useDinnerTime.ts         # NEW: Dinner time state management
│   ├── services/
│   │   └── api.ts                   # Add dinner time API calls
│   ├── types/
│   │   └── index.ts                 # Update types
│   └── App.tsx                      # Integrate time picker
```

**Structure Decision**: Follows existing web application structure with frontend/ and backend/ separation.

## Implementation Approach

### Phase 1: Backend Changes

1. **Add Setting entity and DbSet**
   - Create `Models/Setting.cs`
   - Add to `AppDbContext`
   - EF Core will create table on next run

2. **Add Settings endpoints**
   - GET `/api/settings/dinner-time` - returns saved time or null
   - PUT `/api/settings/dinner-time` - saves time
   - DELETE `/api/settings/dinner-time` - clears time

3. **Add total duration endpoint**
   - GET `/api/config/total-duration` - returns sum of all task durations

4. **Update ScheduleOptimizer**
   - Change `GenerateSchedule()` to accept `DateTime dinnerTime` parameter
   - Remove dependency on `config.DinnerTime`

5. **Update ScheduleEndpoints**
   - Accept optional `dinnerTime` in POST body
   - Fall back to saved setting or calculated default

6. **Update AppConfig**
   - Remove `DinnerTime` property
   - Update any references

7. **Clean up dishes.json**
   - Remove `dinnerTime` field

### Phase 2: Frontend Changes

1. **Add API functions**
   - `getDinnerTime()` - GET dinner time setting
   - `setDinnerTime(time)` - PUT dinner time
   - `clearDinnerTime()` - DELETE dinner time
   - `getTotalDuration()` - GET cooking duration

2. **Create useDinnerTime hook**
   - Load saved time on mount
   - Calculate default when no saved time
   - Handle save/clear operations
   - Trigger schedule regeneration on change

3. **Create DinnerTimePicker component**
   - Native `<input type="time">`
   - Display current value (saved or default)
   - Clear button to revert to default
   - On change: save and regenerate

4. **Update App.tsx**
   - Replace static dinner time display with DinnerTimePicker
   - Wire up regeneration when time changes

5. **Update types**
   - Remove `dinnerTime` from `ConfigResponse`
   - Add `DinnerTimeResponse`, `TotalDurationResponse`

## Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Storage | Settings table | Generic, extensible for future settings |
| Time format | "HH:mm" string | Matches HTML time input, human-readable |
| Default behavior | Calculate on frontend | "Now" changes; frontend knows user timezone |
| API design | RESTful endpoints | Consistent with existing patterns |

## Complexity Tracking

No constitution violations - implementation is minimal and focused.

## Artifacts Generated

| Artifact | Path | Status |
|----------|------|--------|
| Research | research.md | ✓ Complete |
| Data Model | data-model.md | ✓ Complete |
| API Contracts | contracts/api.yaml | ✓ Complete |
| Quickstart | quickstart.md | ✓ Complete |
| Tasks | tasks.md | Pending (/speckit.tasks) |
