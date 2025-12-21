namespace AutoTurkey.Api.Models;

public class Schedule
{
    public int Id { get; set; }
    public DateTime DinnerTime { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<ScheduledTaskInstance> ScheduledTasks { get; set; } = [];
    public List<PrepTaskInstance> PrepTasks { get; set; } = [];
}

