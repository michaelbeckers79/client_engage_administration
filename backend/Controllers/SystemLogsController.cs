using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using backend.Data;
using backend.Models;

namespace backend.Controllers;

public class SystemLogsController : ODataController
{
    private readonly ApplicationDbContext _context;

    public SystemLogsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [EnableQuery(PageSize = 10)]
    public IQueryable<SystemLog> Get()
    {
        return _context.SystemLogs;
    }

    [EnableQuery]
    public IQueryable<SystemLog> Get([FromRoute] int key)
    {
        return _context.SystemLogs.Where(s => s.Id == key);
    }
}
