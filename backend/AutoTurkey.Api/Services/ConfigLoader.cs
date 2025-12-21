using System.Text.Json;
using AutoTurkey.Api.Models.Config;

namespace AutoTurkey.Api.Services;

public class ConfigLoader
{
    private readonly string _configPath;
    private AppConfig? _cachedConfig;

    public ConfigLoader(string configPath)
    {
        _configPath = configPath;
    }

    public AppConfig LoadConfig()
    {
        if (_cachedConfig != null)
            return _cachedConfig;

        var json = File.ReadAllText(_configPath);
        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };
        
        _cachedConfig = JsonSerializer.Deserialize<AppConfig>(json, options) 
            ?? throw new InvalidOperationException("Failed to load config");
        
        ValidateConfig(_cachedConfig);
        
        return _cachedConfig;
    }

    private void ValidateConfig(AppConfig config)
    {
        // Validate dishes have names
        foreach (var dish in config.Dishes)
        {
            if (string.IsNullOrWhiteSpace(dish.Name))
                throw new InvalidOperationException("All dishes must have a name");
            
            // Validate scheduled tasks have durations
            foreach (var task in dish.ScheduledTasks)
            {
                if (string.IsNullOrWhiteSpace(task.Name))
                    throw new InvalidOperationException($"Dish '{dish.Name}' has a task without a name");
            }
        }
        
        // Validate machine names are consistent
        var machineNames = config.Machines.Select(m => m.Name).ToHashSet();
        foreach (var dish in config.Dishes)
        {
            foreach (var task in dish.ScheduledTasks)
            {
                if (!string.IsNullOrEmpty(task.Machine) && !machineNames.Contains(task.Machine))
                    throw new InvalidOperationException(
                        $"Task '{task.Name}' in dish '{dish.Name}' references unknown machine '{task.Machine}'");
            }
        }
    }

    public void ReloadConfig()
    {
        _cachedConfig = null;
        LoadConfig();
    }
}

