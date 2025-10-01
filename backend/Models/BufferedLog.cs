namespace backend.Models;

public class BufferedLog
{
    public string Timestamp { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}

public class BufferedLogResponse
{
    public List<BufferedLog> Logs { get; set; } = new();
}
