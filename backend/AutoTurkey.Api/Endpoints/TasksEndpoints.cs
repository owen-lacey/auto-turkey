using Microsoft.EntityFrameworkCore;
using AutoTurkey.Api.Data;

namespace AutoTurkey.Api.Endpoints;

public static class TasksEndpoints
{
    public static void MapTasksEndpoints(this WebApplication app)
    {
        app.MapPost("/api/tasks/prep/{id}/complete", async (int id, AppDbContext db) =>
        {
            var task = await db.PrepTasks.FindAsync(id);
            if (task == null)
            {
                return Results.NotFound();
            }

            task.IsComplete = !task.IsComplete;
            task.CompletedAt = task.IsComplete ? DateTime.UtcNow : null;
            await db.SaveChangesAsync();

            return Results.Ok(new
            {
                id = task.Id,
                dishName = task.DishName,
                taskName = task.TaskName,
                description = task.Description,
                isComplete = task.IsComplete
            });
        });

        app.MapPost("/api/tasks/scheduled/{id}/complete", async (int id, AppDbContext db) =>
        {
            var task = await db.ScheduledTasks.FindAsync(id);
            if (task == null)
            {
                return Results.NotFound();
            }

            task.IsComplete = !task.IsComplete;
            task.CompletedAt = task.IsComplete ? DateTime.UtcNow : null;
            await db.SaveChangesAsync();

            return Results.Ok(new
            {
                id = task.Id,
                dishName = task.DishName,
                taskName = task.TaskName,
                machineName = task.MachineName,
                startTime = task.StartTime,
                endTime = task.EndTime,
                isComplete = task.IsComplete
            });
        });
    }
}

