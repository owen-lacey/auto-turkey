using Microsoft.EntityFrameworkCore;
using AutoTurkey.Api.Models;

namespace AutoTurkey.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Schedule> Schedules => Set<Schedule>();
    public DbSet<ScheduledTaskInstance> ScheduledTasks => Set<ScheduledTaskInstance>();
    public DbSet<PrepTaskInstance> PrepTasks => Set<PrepTaskInstance>();
    public DbSet<Setting> Settings => Set<Setting>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Schedule>()
            .HasMany(s => s.ScheduledTasks)
            .WithOne(t => t.Schedule)
            .HasForeignKey(t => t.ScheduleId);

        modelBuilder.Entity<Schedule>()
            .HasMany(s => s.PrepTasks)
            .WithOne(t => t.Schedule)
            .HasForeignKey(t => t.ScheduleId);

        modelBuilder.Entity<Setting>()
            .HasIndex(s => s.Key)
            .IsUnique();
    }
}
