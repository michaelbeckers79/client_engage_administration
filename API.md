# API Documentation

## Base URL

Development: `http://localhost:5000`

## OData Endpoints

### Entity Logs

Get entity synchronization logs with support for filtering, ordering, and pagination.

**Endpoint:** `GET /odata/entitylogs`

**Query Parameters (OData):**
- `$filter` - Filter results (e.g., `contains(name,'Entity')`)
- `$orderby` - Sort results (e.g., `created desc`)
- `$skip` - Skip N results (pagination)
- `$top` - Return top N results
- `$count` - Include total count in response

**Response Schema:**
```json
{
  "@odata.context": "http://localhost:5000/odata/$metadata#EntityLogs",
  "@odata.count": 50,
  "value": [
    {
      "Id": 1,
      "InternalId": "INT-1001",
      "ExternalId": "EXT-2001",
      "Created": "2025-09-30T20:14:58.2588125Z",
      "Modified": "2025-10-01T20:14:58.2588587Z",
      "Succeeded": 98,
      "FailedCount": 3,
      "Exception": "",
      "Name": "Entity 1"
    }
  ]
}
```

**Examples:**

```bash
# Get all entity logs (first page)
GET /odata/entitylogs?$top=10&$count=true

# Filter by name
GET /odata/entitylogs?$filter=contains(name,'Entity 1')

# Filter by internal ID and order by created date
GET /odata/entitylogs?$filter=contains(internalId,'1001')&$orderby=created desc

# Get entities with failures
GET /odata/entitylogs?$filter=failedCount gt 0

# Get entities with exceptions
GET /odata/entitylogs?$filter=exception ne ''

# Pagination (skip 10, take 10)
GET /odata/entitylogs?$skip=10&$top=10&$count=true
```

### System Logs

Get system logs with date range filtering.

**Endpoint:** `GET /odata/systemlogs`

**Query Parameters (OData):**
- `$filter` - Filter results (e.g., `date ge 2024-01-01T00:00:00Z`)
- `$orderby` - Sort results (e.g., `date desc`)
- `$skip` - Skip N results
- `$top` - Return top N results
- `$count` - Include total count

**Response Schema:**
```json
{
  "@odata.context": "http://localhost:5000/odata/$metadata#SystemLogs",
  "@odata.count": 50,
  "value": [
    {
      "Id": 1,
      "Date": "2025-10-01T19:14:58.2611892Z",
      "Exception": "System warning: High memory usage detected"
    }
  ]
}
```

**Examples:**

```bash
# Get all system logs
GET /odata/systemlogs?$top=10&$count=true

# Filter by date range
GET /odata/systemlogs?$filter=date ge 2025-10-01T00:00:00Z and date le 2025-10-01T23:59:59Z

# Order by date descending
GET /odata/systemlogs?$orderby=date desc&$top=10

# Filter by exception text
GET /odata/systemlogs?$filter=contains(exception,'memory')
```

## REST API Endpoints

### Buffered Logs

Get current buffered output logs. This endpoint returns live logs that are continuously updated.

**Endpoint:** `GET /api/bufferedlogs`

**Response Schema:**
```json
{
  "logs": [
    {
      "timestamp": "2025-10-01T20:15:53.5171008Z",
      "message": "[20:15:53] System process 0 completed successfully"
    },
    {
      "timestamp": "2025-10-01T20:15:48.5191957Z",
      "message": "[20:15:48] System process 1 completed successfully"
    }
  ]
}
```

**Examples:**

```bash
# Get current buffered logs
GET /api/bufferedlogs

# The backend automatically adds new logs every 5 seconds
# Maintains last 100 log entries
```

## OData Query Syntax Reference

### Filter Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `eq` | Equal | `$filter=id eq 1` |
| `ne` | Not equal | `$filter=exception ne ''` |
| `gt` | Greater than | `$filter=failedCount gt 0` |
| `ge` | Greater than or equal | `$filter=date ge 2024-01-01T00:00:00Z` |
| `lt` | Less than | `$filter=succeeded lt 100` |
| `le` | Less than or equal | `$filter=date le 2024-12-31T23:59:59Z` |
| `and` | Logical AND | `$filter=succeeded gt 0 and failedCount eq 0` |
| `or` | Logical OR | `$filter=succeeded gt 100 or failedCount eq 0` |
| `not` | Logical NOT | `$filter=not (exception eq '')` |
| `contains` | String contains | `$filter=contains(name,'Entity')` |
| `startswith` | String starts with | `$filter=startswith(internalId,'INT')` |
| `endswith` | String ends with | `$filter=endswith(name,'1')` |

### Order By

```bash
# Sort by single field ascending
$orderby=created

# Sort by single field descending
$orderby=created desc

# Sort by multiple fields
$orderby=succeeded desc,created asc
```

### Pagination

```bash
# Skip first 10 results
$skip=10

# Take only 20 results
$top=20

# Combine for pagination (page 3, 10 items per page)
$skip=20&$top=10

# Include total count
$count=true
```

## Error Responses

### 400 Bad Request
Invalid OData query syntax

```json
{
  "error": {
    "code": "BadRequest",
    "message": "Invalid query syntax"
  }
}
```

### 404 Not Found
Resource not found

```json
{
  "error": {
    "code": "NotFound",
    "message": "Resource not found"
  }
}
```

### 500 Internal Server Error
Server error

```json
{
  "error": {
    "code": "InternalServerError",
    "message": "An error occurred while processing your request"
  }
}
```

## CORS Configuration

The API is configured to accept requests from:
- `http://localhost:3000` (Development)

For production, update the CORS policy in `Program.cs` to include your production frontend URL.

## Rate Limiting

Currently, no rate limiting is implemented. For production deployments, consider adding:
- Request rate limiting
- Authentication/Authorization
- API key validation
- Request throttling

## Testing with cURL

```bash
# Entity Logs - Get first 5
curl "http://localhost:5000/odata/entitylogs?\$top=5&\$count=true" | jq

# Entity Logs - Filter by name
curl "http://localhost:5000/odata/entitylogs?\$filter=contains(name,'Entity 1')" | jq

# System Logs - Get all from today
curl "http://localhost:5000/odata/systemlogs?\$filter=date ge $(date -u +%Y-%m-%d)T00:00:00Z" | jq

# Buffered Logs - Get current logs
curl "http://localhost:5000/api/bufferedlogs" | jq '.logs | length'
```

## Testing with Postman

Import the following as a Postman collection:

1. Create a new collection: "Client Engage Admin API"
2. Add requests:
   - GET Entity Logs: `http://localhost:5000/odata/entitylogs?$top=10&$count=true`
   - GET System Logs: `http://localhost:5000/odata/systemlogs?$top=10&$count=true`
   - GET Buffered Logs: `http://localhost:5000/api/bufferedlogs`
3. Set header: `Accept: application/json`

## WebSocket Support (Future Enhancement)

For real-time log streaming, consider implementing SignalR:

```csharp
// Server side
public class LogHub : Hub
{
    public async Task StreamLogs()
    {
        // Stream logs to connected clients
    }
}

// Client side
const connection = new HubConnectionBuilder()
    .withUrl("http://localhost:5000/loghub")
    .build();
```
