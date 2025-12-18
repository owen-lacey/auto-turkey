namespace AutoTurkey.Api.Models.Config;

public class AppConfig
{
    public DateTime DinnerTime { get; set; }
    public List<MachineConfig> Machines { get; set; } = [];
    public List<DishConfig> Dishes { get; set; } = [];
}

