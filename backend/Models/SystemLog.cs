namespace backend.Models;

public class SystemLog
{
    public int Id { get; set; }
    public DateTime Date { get; set; }
    public string Exception { get; set; } = string.Empty;
}
