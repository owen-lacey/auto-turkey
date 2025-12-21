using Microsoft.EntityFrameworkCore;
using AutoTurkey.Api.Data;
using AutoTurkey.Api.Models;

namespace AutoTurkey.Api.Endpoints;

public static class SettingsEndpoints
{
    private const string DinnerTimeKey = "DinnerTime";

    public static void MapSettingsEndpoints(this WebApplication app)
    {
        app.MapGet("/api/settings/dinner-time", async (AppDbContext db) =>
        {
            var setting = await db.Settings.FirstOrDefaultAsync(s => s.Key == DinnerTimeKey);
            return Results.Ok(new { dinnerTime = setting?.Value });
        });

        app.MapPut("/api/settings/dinner-time", async (AppDbContext db, SetDinnerTimeRequest request) =>
        {
            // Validate time format (HH:mm)
            if (!TimeOnly.TryParse(request.DinnerTime, out _))
            {
                return Results.BadRequest(new { error = "Invalid time format. Expected HH:mm (e.g., 15:00)" });
            }

            var setting = await db.Settings.FirstOrDefaultAsync(s => s.Key == DinnerTimeKey);
            
            if (setting == null)
            {
                setting = new Setting
                {
                    Key = DinnerTimeKey,
                    Value = request.DinnerTime,
                    UpdatedAt = DateTime.UtcNow
                };
                db.Settings.Add(setting);
            }
            else
            {
                setting.Value = request.DinnerTime;
                setting.UpdatedAt = DateTime.UtcNow;
            }

            await db.SaveChangesAsync();
            return Results.Ok(new { dinnerTime = setting.Value });
        });

        app.MapDelete("/api/settings/dinner-time", async (AppDbContext db) =>
        {
            var setting = await db.Settings.FirstOrDefaultAsync(s => s.Key == DinnerTimeKey);
            
            if (setting != null)
            {
                db.Settings.Remove(setting);
                await db.SaveChangesAsync();
            }

            return Results.NoContent();
        });
    }
}

public record SetDinnerTimeRequest(string DinnerTime);

