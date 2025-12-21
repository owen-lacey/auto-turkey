using Microsoft.EntityFrameworkCore;
using AutoTurkey.Api.Data;
using AutoTurkey.Api.Services;
using AutoTurkey.Api.Endpoints;

var builder = WebApplication.CreateBuilder(args);

// Add CORS for frontend
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Add SQLite database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=autoturkey.db"));

// Add ConfigLoader and ScheduleOptimizer
var configPath = Path.Combine(builder.Environment.ContentRootPath, "Data", "dishes.json");
var configLoader = new ConfigLoader(configPath);
builder.Services.AddSingleton(configLoader);
builder.Services.AddSingleton(new ScheduleOptimizer(configLoader));

var app = builder.Build();

// Ensure database is created
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

app.UseCors();

// Map endpoints
app.MapGet("/", () => "Auto-Turkey API is running!");
app.MapConfigEndpoints();
app.MapScheduleEndpoints();
app.MapTasksEndpoints();
app.MapSettingsEndpoints();

app.Run();
