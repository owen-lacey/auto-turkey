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

        app.MapGet("/api/config/total-duration", (ScheduleOptimizer optimizer) =>
        {
            var totalMinutes = optimizer.GetTotalCookingDuration();
            var hours = totalMinutes / 60;
            var minutes = totalMinutes % 60;
            var formatted = hours > 0 
                ? $"{hours}h {minutes}m" 
                : $"{minutes}m";
            
            return Results.Ok(new
            {
                totalMinutes,
                formatted
            });
        });
    }
}
