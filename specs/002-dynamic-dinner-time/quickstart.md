# Quickstart: Dynamic Dinner Time

**Feature Branch**: `002-dynamic-dinner-time`  
**Created**: 2025-12-21

## Prerequisites

- .NET 8 SDK
- Node.js 18+
- SQLite (included via EF Core)

## Quick Start

### 1. Start Backend

```bash
cd backend/AutoTurkey.Api
dotnet run
```

Backend runs at `http://localhost:5146`

### 2. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

### 3. Test the Feature

1. Open `http://localhost:5173`
2. Notice schedule displays with calculated default dinner time (now + cooking duration)
3. Use the time picker to set a custom dinner time
4. Observe schedule regenerates with new target time
5. Clear the time to revert to calculated default

---

## API Testing

### Check Dinner Time Setting

```bash
curl http://localhost:5146/api/settings/dinner-time
```

Response (not set):
```json
{"dinnerTime": null}
```

### Set Dinner Time

```bash
curl -X PUT http://localhost:5146/api/settings/dinner-time \
  -H "Content-Type: application/json" \
  -d '{"dinnerTime": "15:00"}'
```

Response:
```json
{"dinnerTime": "15:00"}
```

### Clear Dinner Time

```bash
curl -X DELETE http://localhost:5146/api/settings/dinner-time
```

Response: `204 No Content`

### Get Total Cooking Duration

```bash
curl http://localhost:5146/api/config/total-duration
```

Response:
```json
{"totalMinutes": 210, "formatted": "3h 30m"}
```

### Generate Schedule with Specific Time

```bash
curl -X POST http://localhost:5146/api/schedule \
  -H "Content-Type: application/json" \
  -d '{"dinnerTime": "2025-12-25T15:00:00"}'
```

---

## Key Files Modified

### Backend

| File | Change |
|------|--------|
| `Models/Setting.cs` | New entity for settings storage |
| `Data/AppDbContext.cs` | Add Settings DbSet |
| `Models/Config/AppConfig.cs` | Remove DinnerTime property |
| `Data/dishes.json` | Remove dinnerTime field |
| `Services/ScheduleOptimizer.cs` | Accept dinnerTime as parameter |
| `Endpoints/SettingsEndpoints.cs` | New endpoints for dinner time |
| `Endpoints/ConfigEndpoints.cs` | Add total-duration endpoint |
| `Endpoints/ScheduleEndpoints.cs` | Accept dinnerTime in request body |

### Frontend

| File | Change |
|------|--------|
| `src/services/api.ts` | Add dinner time API functions |
| `src/types/index.ts` | Update types, remove dinnerTime from ConfigResponse |
| `src/hooks/useDinnerTime.ts` | New hook for dinner time management |
| `src/components/DinnerTimePicker/` | New time picker component |
| `src/App.tsx` | Integrate time picker, handle default calculation |

---

## Database Schema Change

After running the updated backend, a new `Settings` table is created:

```sql
SELECT * FROM Settings;
-- Empty initially, populated when user sets dinner time
```

---

## Verification Checklist

- [ ] App loads without a saved dinner time
- [ ] Default dinner time = now + cooking duration
- [ ] Time picker allows setting custom dinner time
- [ ] Setting is persisted (survives page refresh)
- [ ] Schedule regenerates when dinner time changes
- [ ] Clearing dinner time reverts to calculated default
- [ ] dishes.json no longer contains dinnerTime

