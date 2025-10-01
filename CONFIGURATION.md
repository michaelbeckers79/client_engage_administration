# Configuration Guide

## Azure Entra ID Setup

### 1. Create an App Registration

1. Navigate to [Azure Portal](https://portal.azure.com)
2. Go to **Azure Active Directory** > **App registrations**
3. Click **New registration**
4. Fill in the details:
   - **Name**: Client Engage Administration
   - **Supported account types**: Accounts in this organizational directory only
   - **Redirect URI**: 
     - Platform: Single-page application (SPA)
     - URL: `http://localhost:3000`
5. Click **Register**

### 2. Configure the Application

After registration, note down:
- **Application (client) ID**: Found on the Overview page
- **Directory (tenant) ID**: Found on the Overview page

### 3. Configure Frontend Environment

Create `frontend/.env.local` with the following:

```env
NEXT_PUBLIC_AZURE_CLIENT_ID=your-application-client-id-here
NEXT_PUBLIC_AZURE_TENANT_ID=your-directory-tenant-id-here
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 4. API Permissions (Optional)

If you need to access Microsoft Graph or other APIs:
1. Go to **API permissions**
2. Click **Add a permission**
3. Select **Microsoft Graph**
4. Add required permissions (e.g., `User.Read`)
5. Grant admin consent if required

## Backend Configuration

### Database Connection (Production)

To replace the in-memory database with a real database:

1. Install the appropriate Entity Framework provider:
   ```bash
   # For SQL Server
   dotnet add package Microsoft.EntityFrameworkCore.SqlServer
   
   # For PostgreSQL
   dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
   ```

2. Update `Program.cs`:
   ```csharp
   // Replace UseInMemoryDatabase with your database provider
   builder.Services.AddDbContext<ApplicationDbContext>(options =>
       options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
   ```

3. Add connection string to `appsettings.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=localhost;Database=ClientEngage;Trusted_Connection=True;"
     }
   }
   ```

4. Run migrations:
   ```bash
   dotnet ef migrations add InitialCreate
   dotnet ef database update
   ```

### CORS Configuration (Production)

Update `Program.cs` to allow your production frontend URL:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextJS",
        policy =>
        {
            policy.WithOrigins(
                "http://localhost:3000",
                "https://your-production-domain.com"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
        });
});
```

### Authentication (Optional)

To secure the backend API with Azure AD:

1. Install required package:
   ```bash
   dotnet add package Microsoft.Identity.Web
   ```

2. Update `Program.cs`:
   ```csharp
   builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
       .AddMicrosoftIdentityWebApi(builder.Configuration.GetSection("AzureAd"));
   
   // Add before app.MapControllers()
   app.UseAuthentication();
   app.UseAuthorization();
   ```

3. Add to `appsettings.json`:
   ```json
   {
     "AzureAd": {
       "Instance": "https://login.microsoftonline.com/",
       "Domain": "your-domain.onmicrosoft.com",
       "TenantId": "your-tenant-id",
       "ClientId": "your-api-client-id"
     }
   }
   ```

4. Protect controllers with `[Authorize]` attribute

## Environment Variables Reference

### Frontend (.env.local)

| Variable | Description | Example |
|----------|-------------|---------|
| NEXT_PUBLIC_AZURE_CLIENT_ID | Azure AD Application ID | `12345678-1234-1234-1234-123456789012` |
| NEXT_PUBLIC_AZURE_TENANT_ID | Azure AD Tenant ID | `87654321-4321-4321-4321-210987654321` |
| NEXT_PUBLIC_REDIRECT_URI | OAuth redirect URI | `http://localhost:3000` |
| NEXT_PUBLIC_API_URL | Backend API base URL | `http://localhost:5000` |

### Backend (appsettings.json)

| Setting | Description | Example |
|---------|-------------|---------|
| ConnectionStrings:DefaultConnection | Database connection string | SQL Server connection string |
| Urls | Server listen URLs | `http://localhost:5000` |
| AzureAd:* | Azure AD configuration | Various Azure AD settings |

## Deployment

### Frontend (Vercel/Netlify)

1. Build the application:
   ```bash
   cd frontend
   npm run build
   ```

2. Set environment variables in your hosting platform
3. Deploy the `.next` output directory

### Backend (Azure App Service/IIS)

1. Publish the application:
   ```bash
   cd backend
   dotnet publish -c Release
   ```

2. Configure application settings with production values
3. Deploy the published files to your hosting environment

## Troubleshooting

### Authentication Issues

- Verify Client ID and Tenant ID are correct
- Check that redirect URI matches exactly in Azure AD
- Clear browser cache and cookies
- Check browser console for MSAL errors

### API Connection Issues

- Verify CORS configuration allows your frontend origin
- Check that API URL environment variable is correct
- Ensure backend is running and accessible
- Check network tab in browser dev tools for failed requests

### Database Issues

- Verify connection string is correct
- Ensure database server is accessible
- Check that migrations have been applied
- Review Entity Framework logs for errors
