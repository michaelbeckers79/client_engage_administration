using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<EntityLog> EntityLogs { get; set; }
    public DbSet<SystemLog> SystemLogs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Seed data for EntityLogs
        var entityLogs = new List<EntityLog>();
        for (int i = 1; i <= 50; i++)
        {
            entityLogs.Add(new EntityLog
            {
                Id = i,
                InternalId = $"INT-{1000 + i}",
                ExternalId = $"EXT-{2000 + i}",
                Created = DateTime.UtcNow.AddDays(-i),
                Modified = DateTime.UtcNow.AddDays(-i / 2),
                Succeeded = Random.Shared.Next(10, 100),
                FailedCount = Random.Shared.Next(0, 10),
                Exception = i % 3 == 0 ? $"Error occurred during sync: {(i % 2 == 0 ? "Connection timeout" : "Invalid data format")}" : "",
                Name = $"Entity {i}"
            });
        }
        modelBuilder.Entity<EntityLog>().HasData(entityLogs);

        // Seed data for SystemLogs
        var systemLogs = new List<SystemLog>();
        var exceptions = new[]
        {
            "System error: Database connection timeout",
            "Application exception: Failed to process request",
            "Network error: Unable to reach external service",
            "Authentication failed: Invalid credentials",
            "System warning: High memory usage detected"
        };

        for (int i = 1; i <= 50; i++)
        {
            systemLogs.Add(new SystemLog
            {
                Id = i,
                Date = DateTime.UtcNow.AddHours(-i),
                Exception = exceptions[Random.Shared.Next(exceptions.Length)]
            });
        }
        modelBuilder.Entity<SystemLog>().HasData(systemLogs);
    }
}
