namespace AutoTurkey.Api.Models;

public class PrepTaskInstance
{
    public int Id { get; set; }
    public int ScheduleId { get; set; }
    public string DishName { get; set; } = "";
    public string TaskName { get; set; } = "";
    public string? Description { get; set; }
    public bool IsComplete { get; set; }
    public DateTime? CompletedAt { get; set; }
    
    public Schedule Schedule { get; set; } = null!;
}

