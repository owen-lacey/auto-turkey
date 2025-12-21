# Data Model: Dynamic Dinner Time

**Feature Branch**: `002-dynamic-dinner-time`  
**Created**: 2025-12-21

## Overview

This document defines the data model changes required to support user-configurable dinner time.

---

## New Entity: Setting

A generic key-value store for application settings.

### Schema

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| Id | int | PK, auto-increment | Unique identifier |
| Key | string | Required, unique | Setting name (e.g., "DinnerTime") |
| Value | string | Nullable | Setting value (format depends on key) |
| UpdatedAt | DateTime | Required | Last modification timestamp |

### C# Entity

```csharp
public class Setting
{
    public int Id { get; set; }
    public string Key { get; set; } = "";
    public string? Value { get; set; }
    public DateTime UpdatedAt { get; set; }
}
```

### Known Keys

| Key | Value Format | Example | Description |
|-----|--------------|---------|-------------|
| `DinnerTime` | "HH:mm" (24-hour) | "15:00" | User's preferred dinner time |

---

## Modified Entity: AppConfig

Remove `DinnerTime` property - no longer read from configuration.

### Before

```csharp
public class AppConfig
{
    public DateTime DinnerTime { get; set; }
    public List<MachineConfig> Machines { get; set; } = [];
    public List<DishConfig> Dishes { get; set; } = [];
}
```

### After

```csharp
public class AppConfig
{
    public List<MachineConfig> Machines { get; set; } = [];
    public List<DishConfig> Dishes { get; set; } = [];
}
```

---

## Unchanged Entities

The following entities remain unchanged:

- **Schedule**: Still stores `DinnerTime` as DateTime (the actual time used for generation)
- **ScheduledTaskInstance**: No changes
- **PrepTaskInstance**: No changes
- **MachineConfig**: No changes
- **DishConfig**: No changes

---

## Configuration File Changes

### dishes.json

Remove the `dinnerTime` field:

**Before:**
```json
{
  "dinnerTime": "2025-12-25T15:00:00",
  "machines": [...],
  "dishes": [...]
}
```

**After:**
```json
{
  "machines": [...],
  "dishes": [...]
}
```

---

## Database Changes

### New Table: Settings

```sql
CREATE TABLE Settings (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Key TEXT NOT NULL UNIQUE,
    Value TEXT NULL,
    UpdatedAt TEXT NOT NULL
);
```

### EF Core Migration

Add to `AppDbContext`:

```csharp
public DbSet<Setting> Settings => Set<Setting>();

// In OnModelCreating:
modelBuilder.Entity<Setting>()
    .HasIndex(s => s.Key)
    .IsUnique();
```

---

## Data Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │     │   Backend API   │     │   Database      │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│                 │     │                 │     │                 │
│ Time Picker ────┼──►──┼ PUT /settings/  │──►──│ Settings table  │
│                 │     │ dinner-time     │     │                 │
│                 │     │                 │     │                 │
│ Load Page ──────┼──►──┼ GET /settings/  │──◄──│ Settings table  │
│                 │     │ dinner-time     │     │                 │
│                 │     │                 │     │                 │
│ Generate ───────┼──►──┼ POST /schedule  │     │                 │
│ Schedule        │     │ {dinnerTime}    │     │                 │
│                 │     │       │         │     │                 │
│                 │     │       ▼         │     │                 │
│                 │     │ ScheduleOptimizer    │                 │
│                 │     │ (uses provided time) │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

---

## Validation Rules

| Field | Rule |
|-------|------|
| Setting.Key | Non-empty string |
| Setting.Value (DinnerTime) | Must be valid "HH:mm" format, 00:00-23:59 |
| Setting.UpdatedAt | Auto-set on create/update |

