namespace backend.Models;

public class EntityLog
{
    public int Id { get; set; }
    public string InternalId { get; set; } = string.Empty;
    public string ExternalId { get; set; } = string.Empty;
    public DateTime Created { get; set; }
    public DateTime Modified { get; set; }
    public int Succeeded { get; set; }
    public int FailedCount { get; set; }
    public string Exception { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
}
