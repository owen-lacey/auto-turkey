# Feature Specification: Dynamic Dinner Time

**Feature Branch**: `002-dynamic-dinner-time`  
**Created**: 2025-12-21  
**Status**: Draft  
**Input**: User description: "Move away from configuring dinner time in dishes.json. Instead ask the user when dinner time is (time only, not date) and persist it in the database."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Schedule with Default Time (Priority: P1)

A home cook opens the web application without having set a dinner time. The system displays the schedule using a sensible default: dinner time is calculated as "now + total cooking duration". This allows users to immediately see how long the meal will take and what needs to happen when. The user can optionally set a specific dinner time if they have a target serving time in mind.

**Why this priority**: The system must work immediately without requiring configuration. Users should see value on first load.

**Independent Test**: Can be fully tested by opening the application without a saved dinner time and verifying the schedule displays with the calculated default time.

**Acceptance Scenarios**:

1. **Given** no dinner time has been set, **When** the user opens the application, **Then** they see a schedule with dinner time defaulted to "now + total cooking duration"
2. **Given** the default dinner time is displayed, **When** the user views the schedule, **Then** all tasks are positioned relative to that calculated time
3. **Given** no dinner time is set, **When** time passes, **Then** the default dinner time adjusts accordingly (remains "now + duration")

---

### User Story 2 - Set Custom Dinner Time (Priority: P2)

A home cook wants dinner at a specific time (e.g., 3:00 PM for Christmas lunch). They use the time picker to set their desired dinner time. The system saves this time and recalculates the schedule to work backwards from that target.

**Why this priority**: Many users have a specific serving time in mind. Setting a custom time is the core feature, but the system works without it.

**Independent Test**: Can be fully tested by setting a dinner time using the time picker and verifying the schedule updates to target that time.

**Acceptance Scenarios**:

1. **Given** the application is open, **When** the user selects a time using the time picker, **Then** the system saves the dinner time
2. **Given** a dinner time has been saved, **When** the schedule is generated, **Then** all dishes are scheduled to be ready at that time
3. **Given** a dinner time has been saved, **When** the user reopens the application, **Then** the saved dinner time is used

---

### User Story 3 - Change Dinner Time (Priority: P3)

A home cook realizes they need to adjust the dinner time (perhaps guests are arriving earlier or later than planned). They use the time picker to select a new time. The schedule updates to reflect the new target.

**Why this priority**: Flexibility to change plans is essential for real-world use. Dinner times change, and the app should accommodate this easily.

**Independent Test**: Can be fully tested by setting an initial dinner time, then changing it to a new value and verifying the schedule updates accordingly.

**Acceptance Scenarios**:

1. **Given** a dinner time has been set, **When** the user selects a new time, **Then** the system saves the new time
2. **Given** the dinner time has been changed, **When** the schedule is regenerated, **Then** it reflects the new dinner time as the target

---

### Edge Cases

- What happens when no dinner time is set? (The system uses a calculated default: now + total cooking duration)
- What happens if the user clears the dinner time? (The system reverts to the calculated default)

## Requirements *(mandatory)*

### Functional Requirements

#### Dinner Time Input
- **FR-001**: System MUST provide a native time picker input for selecting dinner time
- **FR-002**: System MUST work without a dinner time being explicitly set (using calculated default)
- **FR-003**: The time picker MUST handle time validation natively (no custom format parsing required)

#### Default Dinner Time Behavior
- **FR-004**: When no dinner time is saved, system MUST display schedule with dinner time = now + total cooking duration
- **FR-005**: The calculated default MUST update as time passes (dynamic)

#### Dinner Time Persistence
- **FR-006**: System MUST persist user-selected dinner time in the database (not in configuration files)
- **FR-007**: System MUST store only the time component (not date) for dinner time
- **FR-008**: System MUST retrieve the saved dinner time on application load (if one exists)

#### Dinner Time Modification
- **FR-009**: Users MUST be able to change the dinner time at any point
- **FR-010**: System MUST update the persisted dinner time when the user modifies it
- **FR-011**: Users MUST be able to clear the dinner time to revert to the calculated default

#### Configuration Cleanup
- **FR-012**: System MUST NOT read dinner time from dishes.json configuration
- **FR-013**: The `dinnerTime` field MUST be removed from dishes.json

#### Schedule Integration
- **FR-014**: System MUST use either the saved dinner time or calculated default for schedule generation
- **FR-015**: System MUST regenerate the schedule when dinner time changes

### Key Entities

- **Dinner Time Setting**: An optional time-only value (e.g., "15:00") representing when dinner should be served. Stored in the database when set by user. When not set, a dynamic default is calculated as "now + total cooking duration".

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can view a schedule immediately without setting a dinner time
- **SC-002**: Users can set a custom dinner time using a time picker
- **SC-003**: Users can modify or clear the dinner time at any point
- **SC-004**: The dinner time persists across browser sessions and application restarts
- **SC-005**: The schedule correctly targets either the user-specified time or calculated default
- **SC-006**: No dinner time configuration exists in dishes.json or other configuration files

## Assumptions

- Time input uses native HTML time picker (`<input type="time">`) which provides consistent format
- Time is in the user's local timezone (no timezone conversion needed)
- The application calculates the schedule for "today" using the provided or default time

## Clarifications

### Session 2025-12-21

- Q: What happens when no dinner time is set? → A: System shows schedule with dinner time defaulted to "now + total cooking duration"
- Q: Is prompting for dinner time mandatory? → A: No, the system works without a dinner time being set
- Q: How should time input be handled? → A: Use native time picker input to simplify validation
