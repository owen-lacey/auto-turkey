# Feature Specification: Christmas Dinner Planner

**Feature Branch**: `001-christmas-dinner-planner`  
**Created**: 2025-12-18  
**Status**: Draft  
**Input**: User description: "Web app to help cook christmas dinner with optimal scheduling and gantt chart visualization"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Optimized Cooking Schedule (Priority: P1)

A home cook opens the web application on Christmas Day morning and sees a Gantt chart displaying the cooking schedule with the current time clearly marked. The chart is organized by machine (rows), with each row representing a resource like "Kitchen Oven", "Hobs", or "Chef". Tasks appear as blocks within their assigned machine's row, labeled in the format "Dish: Activity" (e.g., "Potatoes: peel", "Turkey: roast"). When multiple tasks use the same machine at different times, they appear stacked or sequenced within that row. This allows users to see at a glance what each machine/resource should be doing at any given time.

**Why this priority**: This is the core value proposition - without the visualization, the app provides no utility. Users need to see their cooking schedule to follow it.

**Independent Test**: Can be fully tested by loading the application with pre-defined recipe data and verifying the Gantt chart displays correctly with all tasks, timings, and machine assignments visible.

**Acceptance Scenarios**:

1. **Given** a cooking plan has been generated, **When** the user opens the web app, **Then** they see a Gantt chart with rows representing each machine (e.g., "Kitchen Oven", "Utility Oven", "Hob", "Chef")
2. **Given** the Gantt chart is displayed, **When** the user views the chart, **Then** they can see the current time marked as a vertical line/indicator on the timeline
3. **Given** a task is displayed, **When** the user views the task block, **Then** it shows a label in the format "Dish: Activity" (e.g., "Potatoes: peel", "Turkey: roast")
4. **Given** multiple tasks use the same machine at overlapping times, **When** viewing the chart, **Then** the machine row stretches vertically to accommodate all concurrent tasks
5. **Given** a task has no machine assignment (e.g., resting), **When** viewing the chart, **Then** the task appears in a dedicated "Resting" or "No Machine" row

---

### User Story 2 - Complete Prep Tasks Ahead of Time (Priority: P2)

Before cooking day, the user works through prep tasks that can be done in advance (e.g., "Potatoes: peel", "Stuffing: prep"). These appear in a separate "Prep" section outside the Gantt chart. The user marks each prep task as complete. Prep tasks are prerequisites - the corresponding cooking tasks cannot logically begin until prep is done.

**Why this priority**: Prep work is essential to a smooth cooking day. Showing it separately keeps the Gantt chart focused on time-critical tasks.

**Independent Test**: Can be fully tested by viewing the prep section and marking prep tasks as complete.

**Acceptance Scenarios**:

1. **Given** dishes have prep tasks configured, **When** the user views the app, **Then** they see a "Prep" section separate from the Gantt chart listing all prep tasks
2. **Given** a prep task is displayed, **When** the user clicks to mark it done, **Then** it becomes faded (reduced opacity) like other completed tasks
3. **Given** a dish has a recipe link configured, **When** the user views any task for that dish (prep or scheduled), **Then** they can click through to the external recipe

---

### User Story 3 - Track Task Completion (Priority: P3)

While cooking, the user marks tasks as complete as they finish them. This gives them a sense of progress and helps them keep track of what's done versus what still needs attention.

**Why this priority**: After seeing the schedule, users need to track their progress. This is essential for managing a multi-dish cooking session.

**Independent Test**: Can be fully tested by clicking on tasks in the Gantt chart and verifying they toggle to a "complete" state with visual feedback.

**Acceptance Scenarios**:

1. **Given** a task is displayed on the Gantt chart, **When** the user clicks/taps to mark it as done, **Then** the task becomes faded (reduced opacity) to indicate completion
2. **Given** a task is marked as complete, **When** the user views the chart, **Then** completed tasks appear faded compared to pending tasks

---

### User Story 4 - Define Recipes and Tasks (Priority: P4)

A technical user (developer/power user) defines the Christmas dinner menu by editing configuration files or source code. They specify each dish, its subtasks (prep, cook, rest), the duration of each subtask, and which machine each subtask requires.

**Why this priority**: This is a prerequisite for the system to work, but it's a one-time setup task performed before Christmas Day. The user explicitly stated this can be done in source code rather than the UI.

**Independent Test**: Can be fully tested by creating/editing a recipe configuration file and verifying the data is correctly loaded and displayed in the Gantt chart.

**Acceptance Scenarios**:

1. **Given** a technical user wants to add a dish, **When** they add a new entry to the backend configuration (JSON), **Then** the dish appears in the generated schedule
2. **Given** a dish is defined in the configuration with subtasks and durations, **When** the schedule is generated, **Then** each subtask appears as a separate block in the Gantt chart labeled "Dish: Activity" (e.g., "Potatoes: peel")
3. **Given** a subtask is configured with a machine assignment, **When** the schedule is generated, **Then** the task appears in that machine's row on the Gantt chart
4. **Given** a subtask is configured with no machine (e.g., resting time), **When** the schedule is generated, **Then** the task appears in the "Resting" row

---

### User Story 5 - Generate Optimal Schedule (Priority: P5)

The system automatically generates an optimal cooking schedule that minimizes total cooking time while respecting machine capacity constraints (e.g., hobs have a maximum capacity of concurrent tasks, the chef can only do one prep task at a time). The schedule works backwards from the configured "dinner time" to ensure all dishes are ready to serve at that target time.

**Why this priority**: Optimization is valuable but complex. A manually arranged schedule still provides significant value. This is the "auto" in auto-turkey - the differentiated feature.

**Independent Test**: Can be fully tested by defining a set of dishes with constraints and verifying the generated schedule is valid (no conflicts), respects machine capacities, and ends at the configured dinner time.

**Acceptance Scenarios**:

1. **Given** dishes are defined with tasks and machine requirements, **When** the user generates a schedule, **Then** the system creates a timeline that respects each machine's capacity (e.g., max 4 concurrent tasks on hobs)
2. **Given** a dinner time is configured, **When** the schedule is generated, **Then** all dishes are scheduled to be ready at or just before the dinner time
3. **Given** the Gantt chart is displayed, **When** the user views it, **Then** the dinner time appears as the right-hand edge of the timeline
4. **Given** the schedule is generated, **When** saved, **Then** it persists in a database for later viewing

---

### Edge Cases

- What happens when tasks exceed a machine's maxCapacity? (The scheduler resolves by adjusting timing)

## Requirements *(mandatory)*

### Functional Requirements

#### Prep Section
- **FR-001**: System MUST display a "Prep" section separate from the Gantt chart showing all prep tasks
- **FR-002**: Prep tasks MUST be displayed in the format "Dish: Activity" (e.g., "Potatoes: peel")
- **FR-003**: Users MUST be able to mark prep tasks as complete (same faded appearance as other tasks)
- **FR-004**: Each dish MAY have an optional recipe link, accessible from both prep tasks and Gantt chart tasks

#### Gantt Chart Display
- **FR-005**: System MUST display a Gantt chart with rows organized by machine (e.g., "Kitchen Oven", "Utility Oven", "Hob", "Chef")
- **FR-006**: System MUST show the current time as a visible marker on the Gantt chart
- **FR-007**: System MUST label each task block in the format "Dish: Activity" (e.g., "Potatoes: peel", "Turkey: roast")
- **FR-008**: System MUST dynamically expand machine rows vertically when multiple tasks occupy the same time slot on that machine
- **FR-009**: System MUST display the configured dinner time as the right-hand edge of the Gantt chart timeline
- **FR-010**: System MUST display tasks without machine assignments in a dedicated "Resting" row

#### Task Interaction
- **FR-011**: Users MUST be able to mark individual tasks as complete (both prep and scheduled tasks)
- **FR-012**: System MUST visually distinguish completed tasks by reducing their opacity (faded appearance)
- **FR-013**: System MUST persist task completion status across page refreshes

#### Backend Configuration (code-only, not user-editable)
- **FR-014**: System MUST load machine definitions from a backend API, including name and maxCapacity
- **FR-015**: System MUST load the target dinner time from backend configuration
- **FR-016**: System MUST load dish/recipe definitions from backend configuration (JSON)
- **FR-017**: Each dish MAY have an optional recipe URL (external link)
- **FR-018**: Each dish MAY have prep tasks (done ahead of time, no specific timing)
- **FR-019**: Each dish MAY have scheduled tasks with duration and optional machine assignment

#### Schedule Generation
- **FR-020**: System MUST generate an optimized schedule that respects machine capacity limits
- **FR-021**: System MUST schedule all dishes to be ready at the configured dinner time
- **FR-022**: System MUST save generated schedules to a database

### Key Entities

- **Dish**: A food item (e.g., "Turkey", "Roasties"). Contains prep tasks and scheduled tasks. May have an optional recipe URL.
- **Prep Task**: A task done ahead of time (no specific timing). Displayed in the Prep section, not the Gantt chart.
- **Scheduled Task**: A cooking activity with duration and optional machine assignment. Displayed on the Gantt chart as "Dish: Activity".
- **Machine**: A cooking resource with name and maxCapacity. Represents a row in the Gantt chart.
- **Schedule**: All scheduled tasks arranged on a timeline, working backwards from dinner time.
- **Dinner Time**: Target serving time. Right-hand edge of the Gantt chart.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can view prep tasks in a separate section and mark them complete
- **SC-002**: Users can view their cooking schedule as a Gantt chart with current time visible
- **SC-003**: Users can mark tasks as complete with a single click (prep and scheduled)
- **SC-004**: Task completion status persists across browser sessions
- **SC-005**: The generated schedule respects machine capacity limits and targets dinner time
