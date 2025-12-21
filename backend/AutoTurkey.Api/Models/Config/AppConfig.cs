namespace AutoTurkey.Api.Models.Config;

public class AppConfig
{
    public List<MachineConfig> Machines { get; set; } = [];
    public List<DishConfig> Dishes { get; set; } = [];
}
