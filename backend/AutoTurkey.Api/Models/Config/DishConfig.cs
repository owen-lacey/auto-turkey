namespace AutoTurkey.Api.Models.Config;

public class DishConfig
{
    public string Name { get; set; } = "";
    public string? RecipeUrl { get; set; }
    public List<PrepTaskConfig> PrepTasks { get; set; } = [];
    public List<ScheduledTaskConfig> ScheduledTasks { get; set; } = [];
}

public class PrepTaskConfig
{
    public string Name { get; set; } = "";
    public string? Description { get; set; }
}

public class ScheduledTaskConfig
{
    public string Name { get; set; } = "";
    public int DurationMinutes { get; set; }
    public string? Machine { get; set; }
    public List<string>? Predecessors { get; set; }
}

