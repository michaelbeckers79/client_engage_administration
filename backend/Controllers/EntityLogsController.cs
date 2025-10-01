using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using backend.Data;
using backend.Models;

namespace backend.Controllers;

public class EntityLogsController : ODataController
{
    private readonly ApplicationDbContext _context;

    public EntityLogsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [EnableQuery(PageSize = 10)]
    public IQueryable<EntityLog> Get()
    {
        return _context.EntityLogs;
    }

    [EnableQuery]
    public IQueryable<EntityLog> Get([FromRoute] int key)
    {
        return _context.EntityLogs.Where(e => e.Id == key);
    }
}
