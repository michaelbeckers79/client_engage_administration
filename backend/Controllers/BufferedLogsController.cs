using Microsoft.AspNetCore.Mvc;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BufferedLogsController : ControllerBase
{
    private static readonly List<BufferedLog> _bufferedLogs = new();
    private static readonly object _lock = new();

    static BufferedLogsController()
    {
        // Initialize with some logs
        for (int i = 0; i < 20; i++)
        {
            _bufferedLogs.Add(new BufferedLog
            {
                Timestamp = DateTime.UtcNow.AddSeconds(-i * 5).ToString("o"),
                Message = $"[{DateTime.UtcNow.AddSeconds(-i * 5):HH:mm:ss}] System process {i} completed successfully"
            });
        }

        // Simulate new logs being added periodically
        _ = Task.Run(async () =>
        {
            while (true)
            {
                await Task.Delay(TimeSpan.FromSeconds(5));
                lock (_lock)
                {
                    var newLog = new BufferedLog
                    {
                        Timestamp = DateTime.UtcNow.ToString("o"),
                        Message = $"[{DateTime.UtcNow:HH:mm:ss}] {GetRandomMessage()}"
                    };
                    _bufferedLogs.Add(newLog);
                    
                    // Keep only last 100 logs
                    if (_bufferedLogs.Count > 100)
                    {
                        _bufferedLogs.RemoveAt(0);
                    }
                }
            }
        });
    }

    [HttpGet]
    public ActionResult<BufferedLogResponse> Get()
    {
        lock (_lock)
        {
            return Ok(new BufferedLogResponse
            {
                Logs = new List<BufferedLog>(_bufferedLogs)
            });
        }
    }

    private static string GetRandomMessage()
    {
        var messages = new[]
        {
            "System check completed successfully",
            "Data synchronization in progress",
            "Processing batch job",
            "Cache refresh completed",
            "Health check passed",
            "Background task executed",
            "API request processed",
            "Database connection verified"
        };
        return messages[Random.Shared.Next(messages.Length)];
    }
}
