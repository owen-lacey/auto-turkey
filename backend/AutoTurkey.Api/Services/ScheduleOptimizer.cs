using Google.OrTools.Sat;
using AutoTurkey.Api.Models.Config;

namespace AutoTurkey.Api.Services;

public class ScheduleOptimizer
{
    private readonly ConfigLoader _configLoader;

    public ScheduleOptimizer(ConfigLoader configLoader)
    {
        _configLoader = configLoader;
    }

    public ScheduleResult GenerateSchedule()
    {
        var config = _configLoader.LoadConfig();
        var dinnerTime = config.DinnerTime;
        
        // Calculate horizon in minutes - work backwards from dinner
        // Find total time needed (max possible is sum of all task durations)
        var totalMinutes = config.Dishes
            .SelectMany(d => d.ScheduledTasks)
            .Sum(t => t.DurationMinutes);
        
        // Add buffer for scheduling flexibility
        var horizon = Math.Max(totalMinutes * 2, 480); // At least 8 hours
        
        var model = new CpModel();
        
        // Expand machines based on capacity (e.g., Hob with capacity 4 = 4 virtual hobs)
        var expandedMachines = new List<string>();
        var machineToCapacity = new Dictionary<string, int>();
        
        foreach (var machine in config.Machines)
        {
            machineToCapacity[machine.Name] = machine.MaxCapacity;
            for (int i = 0; i < machine.MaxCapacity; i++)
            {
                expandedMachines.Add(machine.MaxCapacity > 1 
                    ? $"{machine.Name} #{i + 1}" 
                    : machine.Name);
            }
        }

        // Create variables for each task
        var tasks = new List<TaskVar>();
        var machineIntervals = new Dictionary<string, List<IntervalVar>>();
        
        foreach (var machine in expandedMachines)
        {
            machineIntervals[machine] = new List<IntervalVar>();
        }

        foreach (var dish in config.Dishes)
        {
            IntervalVar? previousInterval = null;
            IntVar? previousEnd = null;
            
            foreach (var taskConfig in dish.ScheduledTasks)
            {
                var taskId = $"{dish.Name}_{taskConfig.Name}";
                
                var start = model.NewIntVar(0, horizon, $"start_{taskId}");
                var end = model.NewIntVar(0, horizon, $"end_{taskId}");
                var duration = taskConfig.DurationMinutes;
                var interval = model.NewIntervalVar(start, duration, end, $"interval_{taskId}");
                
                var taskVar = new TaskVar
                {
                    DishName = dish.Name,
                    TaskName = taskConfig.Name,
                    MachineName = taskConfig.Machine,
                    DurationMinutes = duration,
                    Start = start,
                    End = end,
                    Interval = interval
                };
                tasks.Add(taskVar);
                
                // Precedence constraint: this task must follow the previous one in the dish
                if (previousEnd != null)
                {
                    model.Add(start >= previousEnd);
                }
                previousEnd = end;
                previousInterval = interval;
                
                // Add to machine's interval list (for no-overlap constraint)
                if (!string.IsNullOrEmpty(taskConfig.Machine))
                {
                    var baseMachine = taskConfig.Machine;
                    var capacity = machineToCapacity.GetValueOrDefault(baseMachine, 1);
                    
                    if (capacity > 1)
                    {
                        // Create an optional interval for each virtual machine instance
                        var machineChoice = new List<(IntervalVar interval, BoolVar present)>();
                        
                        for (int i = 0; i < capacity; i++)
                        {
                            var virtualMachine = $"{baseMachine} #{i + 1}";
                            var present = model.NewBoolVar($"present_{taskId}_{virtualMachine}");
                            var optInterval = model.NewOptionalIntervalVar(
                                start, duration, end, present, $"opt_interval_{taskId}_{virtualMachine}");
                            
                            machineIntervals[virtualMachine].Add(optInterval);
                            machineChoice.Add((optInterval, present));
                        }
                        
                        // Exactly one virtual machine must be chosen
                        model.AddExactlyOne(machineChoice.Select(c => c.present));
                    }
                    else
                    {
                        // Single capacity machine - just add the interval directly
                        machineIntervals[baseMachine].Add(interval);
                    }
                }
            }
        }
        
        // Add no-overlap constraints for each machine
        foreach (var (machine, intervals) in machineIntervals)
        {
            if (intervals.Count > 1)
            {
                model.AddNoOverlap(intervals);
            }
        }
        
        // All tasks must complete by the horizon (dinner time)
        foreach (var task in tasks)
        {
            model.Add(task.End <= horizon);
        }
        
        // Objective: Minimize the makespan (latest end time among all tasks)
        // But actually we want to push things as late as possible (closer to dinner)
        // So minimize the earliest start time (push everything to the right)
        var allStarts = tasks.Select(t => t.Start).ToArray();
        var allEnds = tasks.Select(t => t.End).ToArray();
        
        var makespan = model.NewIntVar(0, horizon, "makespan");
        model.AddMaxEquality(makespan, allEnds);
        
        // We want to finish exactly at dinner time, so minimize (horizon - makespan)
        // which is equivalent to maximizing makespan (pushing tasks to finish as late as possible)
        model.Maximize(makespan);
        
        // Solve
        var solver = new CpSolver();
        solver.StringParameters = "max_time_in_seconds:30";
        var status = solver.Solve(model);
        
        if (status != CpSolverStatus.Optimal && status != CpSolverStatus.Feasible)
        {
            throw new InvalidOperationException($"Could not find a valid schedule. Status: {status}");
        }
        
        // Extract results
        var scheduledTasks = new List<ScheduledTaskResult>();
        
        foreach (var task in tasks)
        {
            var startMinutes = (int)solver.Value(task.Start);
            var endMinutes = (int)solver.Value(task.End);
            
            // Convert minutes relative to dinner time
            var startTime = dinnerTime.AddMinutes(startMinutes - horizon);
            var endTime = dinnerTime.AddMinutes(endMinutes - horizon);
            
            scheduledTasks.Add(new ScheduledTaskResult
            {
                DishName = task.DishName,
                TaskName = task.TaskName,
                MachineName = task.MachineName,
                StartTime = startTime,
                EndTime = endTime
            });
        }
        
        // Extract prep tasks
        var prepTasks = config.Dishes
            .SelectMany(d => d.PrepTasks.Select(p => new PrepTaskResult
            {
                DishName = d.Name,
                TaskName = p.Name,
                Description = p.Description
            }))
            .ToList();
        
        return new ScheduleResult
        {
            DinnerTime = dinnerTime,
            ScheduledTasks = scheduledTasks,
            PrepTasks = prepTasks
        };
    }
    
    private class TaskVar
    {
        public string DishName { get; set; } = "";
        public string TaskName { get; set; } = "";
        public string? MachineName { get; set; }
        public int DurationMinutes { get; set; }
        public IntVar Start { get; set; } = null!;
        public IntVar End { get; set; } = null!;
        public IntervalVar Interval { get; set; } = null!;
    }
}

public class ScheduleResult
{
    public DateTime DinnerTime { get; set; }
    public List<ScheduledTaskResult> ScheduledTasks { get; set; } = [];
    public List<PrepTaskResult> PrepTasks { get; set; } = [];
}

public class ScheduledTaskResult
{
    public string DishName { get; set; } = "";
    public string TaskName { get; set; } = "";
    public string? MachineName { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
}

public class PrepTaskResult
{
    public string DishName { get; set; } = "";
    public string TaskName { get; set; } = "";
    public string? Description { get; set; }
}

