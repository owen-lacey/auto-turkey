using Microsoft.EntityFrameworkCore;
using AutoTurkey.Api.Data;
using AutoTurkey.Api.Models;
using AutoTurkey.Api.Models.Config;
using AutoTurkey.Api.Services;

namespace AutoTurkey.Api.Endpoints;

public static class ScheduleEndpoints
{
    public static void MapScheduleEndpoints(this WebApplication app)
    {
        app.MapGet("/api/schedule", async (AppDbContext db, ConfigLoader configLoader) =>
        {
            var schedule = await db.Schedules
                .Include(s => s.ScheduledTasks)
                .Include(s => s.PrepTasks)
                .OrderByDescending(s => s.CreatedAt)
                .FirstOrDefaultAsync();

            if (schedule == null)
            {
                return Results.NotFound();
            }

            var config = configLoader.LoadConfig();
            
            // Build a lookup for recipe URLs by dish name
            var recipeUrls = config.Dishes.ToDictionary(d => d.Name, d => d.RecipeUrl);

            return Results.Ok(new
            {
                id = schedule.Id,
                dinnerTime = schedule.DinnerTime,
                machines = config.Machines.Select(m => new
                {
                    name = m.Name,
                    maxCapacity = m.MaxCapacity
                }),
                prepTasks = schedule.PrepTasks.Select(p => new
                {
                    id = p.Id,
                    dishName = p.DishName,
                    taskName = p.TaskName,
                    description = p.Description,
                    when = p.When.ToString(),
                    recipeUrl = recipeUrls.GetValueOrDefault(p.DishName),
                    isComplete = p.IsComplete
                }),
                scheduledTasks = schedule.ScheduledTasks.Select(t => new
                {
                    id = t.Id,
                    dishName = t.DishName,
                    taskName = t.TaskName,
                    machineName = t.MachineName,
                    recipeUrl = recipeUrls.GetValueOrDefault(t.DishName),
                    startTime = t.StartTime,
                    endTime = t.EndTime,
                    isComplete = t.IsComplete
                })
            });
        });

        app.MapPost("/api/schedule", async (AppDbContext db, ScheduleOptimizer optimizer, ConfigLoader configLoader, GenerateScheduleRequest? request) =>
        {
            // Determine dinner time: from request, or default to now + cooking duration
            DateTime dinnerTime;
            if (request?.DinnerTime != null)
            {
                dinnerTime = request.DinnerTime.Value;
            }
            else
            {
                // Default: now + total cooking duration
                var totalMinutes = optimizer.GetTotalCookingDuration();
                dinnerTime = DateTime.Now.AddMinutes(totalMinutes);
            }

            // Generate optimized schedule
            var result = optimizer.GenerateSchedule(dinnerTime);
            
            // Create schedule entity
            var schedule = new Schedule
            {
                DinnerTime = result.DinnerTime,
                CreatedAt = DateTime.UtcNow
            };
            
            // Add scheduled tasks
            foreach (var task in result.ScheduledTasks)
            {
                schedule.ScheduledTasks.Add(new ScheduledTaskInstance
                {
                    DishName = task.DishName,
                    TaskName = task.TaskName,
                    MachineName = task.MachineName,
                    StartTime = task.StartTime,
                    EndTime = task.EndTime,
                    IsComplete = false
                });
            }
            
            // Add prep tasks
            foreach (var prep in result.PrepTasks)
            {
                schedule.PrepTasks.Add(new PrepTaskInstance
                {
                    DishName = prep.DishName,
                    TaskName = prep.TaskName,
                    Description = prep.Description,
                    When = prep.When,
                    IsComplete = false
                });
            }
            
            db.Schedules.Add(schedule);
            await db.SaveChangesAsync();
            
            var config = configLoader.LoadConfig();
            var recipeUrls = config.Dishes.ToDictionary(d => d.Name, d => d.RecipeUrl);
            
            return Results.Ok(new
            {
                id = schedule.Id,
                dinnerTime = schedule.DinnerTime,
                machines = config.Machines.Select(m => new
                {
                    name = m.Name,
                    maxCapacity = m.MaxCapacity
                }),
                prepTasks = schedule.PrepTasks.Select(p => new
                {
                    id = p.Id,
                    dishName = p.DishName,
                    taskName = p.TaskName,
                    description = p.Description,
                    when = p.When.ToString(),
                    recipeUrl = recipeUrls.GetValueOrDefault(p.DishName),
                    isComplete = p.IsComplete
                }),
                scheduledTasks = schedule.ScheduledTasks.Select(t => new
                {
                    id = t.Id,
                    dishName = t.DishName,
                    taskName = t.TaskName,
                    machineName = t.MachineName,
                    recipeUrl = recipeUrls.GetValueOrDefault(t.DishName),
                    startTime = t.StartTime,
                    endTime = t.EndTime,
                    isComplete = t.IsComplete
                })
            });
        });
    }
}

public record GenerateScheduleRequest(DateTime? DinnerTime);
