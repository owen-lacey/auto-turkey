# Quickstart: Christmas Dinner Planner

**Branch**: `001-christmas-dinner-planner` | **Date**: 2025-12-18

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/) (for frontend)
- Git

## Project Setup

### 1. Create Backend Project

```bash
# From repo root
mkdir -p backend
cd backend

# Create .NET solution and API project
dotnet new sln -n AutoTurkey
dotnet new web -n AutoTurkey.Api
dotnet sln add AutoTurkey.Api

# Add required packages
cd AutoTurkey.Api
dotnet add package Google.OrTools
dotnet add package Microsoft.EntityFrameworkCore.Sqlite
dotnet add package Microsoft.EntityFrameworkCore.Design
```

### 2. Create Frontend Project

```bash
# From repo root
cd frontend

# Create Vite + React + TypeScript project
npm create vite@latest . -- --template react-ts

# Install dependencies
npm install
```

### 3. Configure dishes.json

Create `backend/AutoTurkey.Api/Data/dishes.json`:

```json
{
  "dinnerTime": "2024-12-25T15:00:00",
  "machines": [
    { "name": "Kitchen Oven", "maxCapacity": 1 },
    { "name": "Utility Oven", "maxCapacity": 1 },
    { "name": "Hob", "maxCapacity": 4 },
    { "name": "Chef", "maxCapacity": 1 }
  ],
  "dishes": [
    {
      "name": "Turkey",
      "recipeUrl": "https://www.bbcgoodfood.com/recipes/perfect-roast-turkey",
      "prepTasks": [
        { "name": "prep", "description": "Remove giblets, pat dry, season" }
      ],
      "scheduledTasks": [
        { "name": "roast", "durationMinutes": 240, "machine": "Kitchen Oven" },
        { "name": "rest", "durationMinutes": 30, "machine": null }
      ]
    },
    {
      "name": "Roasties",
      "prepTasks": [
        { "name": "peel", "description": "Peel and chop potatoes" }
      ],
      "scheduledTasks": [
        { "name": "parboil", "durationMinutes": 10, "machine": "Hob" },
        { "name": "roast", "durationMinutes": 60, "machine": "Utility Oven" }
      ]
    }
  ]
}
```

## Running the Application

### Backend (API)

```bash
cd backend/AutoTurkey.Api
dotnet run
```

API available at: `http://localhost:5000`

### Frontend (React)

```bash
cd frontend
npm run dev
```

App available at: `http://localhost:5173`

### Both (Development)

Option 1: Two terminals
Option 2: Use a task runner or VS Code launch config

## Database

SQLite database created automatically at `backend/AutoTurkey.Api/autoturkey.db`

### Migrations

```bash
cd backend/AutoTurkey.Api

# Create migration
dotnet ef migrations add InitialCreate

# Apply migration
dotnet ef database update
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/config` | Get machines, dishes, dinner time |
| GET | `/api/schedule` | Get current schedule |
| POST | `/api/schedule` | Generate new schedule |
| POST | `/api/tasks/prep/{id}/complete` | Toggle prep task completion |
| POST | `/api/tasks/scheduled/{id}/complete` | Toggle scheduled task completion |

## Development Workflow

1. **Edit dishes**: Modify `dishes.json` with your Christmas menu
2. **Start backend**: `dotnet run` in backend folder
3. **Start frontend**: `npm run dev` in frontend folder
4. **Generate schedule**: POST to `/api/schedule` or click button in UI
5. **View & track**: Use the Gantt chart to follow and mark tasks complete

## Troubleshooting

### OR-Tools not found
Ensure `Google.OrTools` NuGet package is installed:
```bash
dotnet add package Google.OrTools
```

### Database errors
Delete `autoturkey.db` and re-run migrations:
```bash
rm autoturkey.db
dotnet ef database update
```

### CORS issues
Backend should be configured to allow `http://localhost:5173` in development.

