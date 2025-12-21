# Research: Dynamic Dinner Time

**Feature Branch**: `002-dynamic-dinner-time`  
**Created**: 2025-12-21

## Overview

This document captures technical research and decisions for implementing user-configurable dinner time with database persistence.

---

## Decision 1: Dinner Time Storage Approach

**Context**: Need to store a single user preference (dinner time) that persists across sessions.

**Decision**: Add a new `Settings` table with key-value pairs

**Rationale**:
- Simple to implement and extend for future settings
- Avoids polluting the `Schedule` entity which represents generated schedules
- Allows dinner time to exist independently of any schedule
- Easy to clear/reset

**Alternatives Considered**:
| Alternative | Why Rejected |
|-------------|--------------|
| Store in Schedule entity | Schedule represents generated output, not user input |
| Separate DinnerTime table | Over-engineered for single value; settings table is more flexible |
| Environment variable | Doesn't persist across sessions; not user-configurable |

---

## Decision 2: Time Storage Format

**Context**: Need to store time-only value (not date) in SQLite.

**Decision**: Store as string in "HH:mm" format (24-hour)

**Rationale**:
- SQLite doesn't have native TIME type
- String format is human-readable in database
- Easy to parse with `TimeOnly.Parse()` in C#
- Matches HTML `<input type="time">` native format

**Alternatives Considered**:
| Alternative | Why Rejected |
|-------------|--------------|
| Store as integer (minutes since midnight) | Less readable, requires conversion |
| Store as DateTime with fixed date | Wastes storage, confusing semantics |
| Store as TimeSpan ticks | Not human-readable |

---

## Decision 3: Default Dinner Time Calculation

**Context**: When no dinner time is set, system should show schedule with default = now + cooking duration.

**Decision**: Calculate on-the-fly in frontend and pass to backend for schedule generation

**Rationale**:
- "Now" changes every minute, so can't be cached
- Frontend knows current time in user's timezone
- Backend receives actual target datetime for schedule calculation
- No need to store the default - it's computed

**Implementation**:
1. Frontend checks if saved dinner time exists
2. If not, calculates default from current time + total cooking duration
3. Passes effective dinner time to backend when generating/viewing schedule

---

## Decision 4: API Design for Dinner Time

**Context**: Need endpoints to get/set dinner time setting.

**Decision**: RESTful endpoints on `/api/settings/dinner-time`

**Rationale**:
- Clear, predictable URL structure
- GET returns current setting (or null if not set)
- PUT sets new value
- DELETE clears to revert to default

**Endpoints**:
- `GET /api/settings/dinner-time` → `{ dinnerTime: "15:00" | null }`
- `PUT /api/settings/dinner-time` → body: `{ dinnerTime: "15:00" }`
- `DELETE /api/settings/dinner-time` → clears saved time

---

## Decision 5: Schedule Generation Changes

**Context**: ScheduleOptimizer currently reads dinner time from config. Need to accept it as parameter.

**Decision**: Modify `GenerateSchedule()` to accept `DateTime dinnerTime` parameter

**Rationale**:
- Clean separation: optimizer doesn't care where dinner time comes from
- Enables both user-set time and calculated default
- Testable with any dinner time

**Changes Required**:
1. `ScheduleOptimizer.GenerateSchedule(DateTime dinnerTime)`
2. `ScheduleEndpoints.MapPost` receives dinner time in request body
3. Remove `dinnerTime` from AppConfig and dishes.json

---

## Decision 6: Frontend Time Picker

**Context**: Need UI for selecting dinner time.

**Decision**: Use native HTML `<input type="time">`

**Rationale**:
- Built-in browser support, no dependencies
- Consistent with spec requirement (FR-001)
- Returns value in "HH:mm" format matching backend storage
- Handles validation natively

**Implementation**:
- Add time picker in header next to "Dinner at" display
- Current behavior: display only → new behavior: editable time picker
- On change: save to backend, regenerate schedule

---

## Technical Notes

### C# TimeOnly vs DateTime

- Use `TimeOnly` for parsing/validation in C# (available in .NET 6+)
- Convert to `DateTime` for schedule generation by combining with current date
- Store as string "HH:mm" in database

### Frontend Time Handling

- HTML time input value format: "HH:mm" (24-hour)
- Display format: locale-aware using `toLocaleTimeString()`
- Calculate full DateTime for schedule: combine user time with current date

### Backward Compatibility

- Old schedules stored in DB will retain their original `DinnerTime` DateTime
- New schedules will use user-provided or calculated dinner time
- No migration needed - existing Schedule.DinnerTime field unchanged

