using AutoTurkey.Api.Services;

namespace AutoTurkey.Api.Endpoints;

public static class ConfigEndpoints
{
    public static void MapConfigEndpoints(this WebApplication app)
    {
        app.MapGet("/api/config", (ConfigLoader configLoader) =>
        {
            var config = configLoader.LoadConfig();
            return Results.Ok(new
            {
                dinnerTime = config.DinnerTime,
                machines = config.Machines.Select(m => new
                {
                    name = m.Name,
                    maxCapacity = m.MaxCapacity
                }),
                dishes = config.Dishes.Select(d => new
                {
                    name = d.Name,
                    recipeUrl = d.RecipeUrl,
                    prepTasks = d.PrepTasks.Select(p => new
                    {
                        name = p.Name,
                        description = p.Description
                    }),
                    scheduledTasks = d.ScheduledTasks.Select(s => new
                    {
                        name = s.Name,
                        durationMinutes = s.DurationMinutes,
                        machine = s.Machine
                    })
                })
            });
        });
    }
}

