# Client Engage Administration

Admin application for managing and monitoring data sync service logs built with Next.js and .NET Core.

## Features

- **Entity Logs**: View entity synchronization logs with success and failure tracking, filterable by multiple columns with expandable exception details
- **System Logs**: Browse system logs with date range filtering and pagination
- **Buffered Logs**: Monitor live buffered output logs with auto-refresh capability
- **Azure Entra ID Authentication**: Secure access with Microsoft identity platform

## Architecture

### Frontend (Next.js)
- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Authentication**: Azure Entra ID (MSAL)

### Backend (.NET Core)
- **Framework**: ASP.NET Core 9.0
- **API**: OData endpoints for Entity and System logs
- **Database**: Entity Framework Core with In-Memory provider (for demo)
- **JSON API**: BufferedLogs endpoint for real-time log streaming

## Prerequisites

- Node.js 18+ and npm
- .NET SDK 9.0+
- Azure Entra ID application (for authentication)

## Setup

### 1. Configure Azure Entra ID

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to Azure Active Directory > App registrations
3. Create a new application registration
4. Add `http://localhost:3000` as a redirect URI (SPA)
5. Note the Application (client) ID and Directory (tenant) ID

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env.local` file with your Azure credentials:

```env
NEXT_PUBLIC_AZURE_CLIENT_ID=your-client-id-here
NEXT_PUBLIC_AZURE_TENANT_ID=your-tenant-id-here
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Backend Setup

```bash
cd backend
dotnet restore
```

## Running the Application

### Start Backend API

```bash
cd backend
dotnet run
```

The API will start at `http://localhost:5000`

### Start Frontend

```bash
cd frontend
npm run dev
```

The frontend will start at `http://localhost:3000`

## API Endpoints

### OData Endpoints

- **Entity Logs**: `http://localhost:5000/odata/entitylogs`
  - Supports OData queries: `$filter`, `$orderby`, `$skip`, `$top`, `$count`
  - Example: `http://localhost:5000/odata/entitylogs?$filter=contains(name,'Entity')&$top=10`

- **System Logs**: `http://localhost:5000/odata/systemlogs`
  - Supports OData queries: `$filter`, `$orderby`, `$skip`, `$top`, `$count`
  - Example: `http://localhost:5000/odata/systemlogs?$filter=date ge 2024-01-01T00:00:00Z`

### JSON Endpoint

- **Buffered Logs**: `http://localhost:5000/api/bufferedlogs`
  - Returns JSON array of recent log entries
  - Auto-updates every 5 seconds with new log entries

## Development

### Frontend Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── entity-logs/     # Entity logs page
│   │   ├── system-logs/     # System logs page
│   │   ├── buffered-logs/   # Buffered logs page
│   │   └── page.tsx         # Home page
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── auth-provider.tsx
│   │   └── navigation.tsx
│   └── lib/
│       └── utils.ts
```

### Backend Structure

```
backend/
├── Controllers/
│   ├── EntityLogsController.cs
│   ├── SystemLogsController.cs
│   └── BufferedLogsController.cs
├── Models/
│   ├── EntityLog.cs
│   ├── SystemLog.cs
│   └── BufferedLog.cs
├── Data/
│   └── ApplicationDbContext.cs
└── Program.cs
```

## Production Deployment

For production deployment:

1. Replace In-Memory database with a real database (SQL Server, PostgreSQL, etc.)
2. Update CORS policy in `backend/Program.cs` to allow your production frontend URL
3. Configure Azure Entra ID with production redirect URIs
4. Use environment variables for configuration
5. Enable HTTPS

## License

This project is for demonstration purposes.