export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">Client Engage Administration</h1>
      <p className="text-lg text-muted-foreground">
        Manage and monitor data sync service logs
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <a
          href="/entity-logs"
          className="block p-6 rounded-lg border bg-card hover:bg-accent transition-colors"
        >
          <h2 className="text-xl font-semibold mb-2">Entity Logs</h2>
          <p className="text-sm text-muted-foreground">
            View entity synchronization logs with success and failure tracking
          </p>
        </a>
        <a
          href="/system-logs"
          className="block p-6 rounded-lg border bg-card hover:bg-accent transition-colors"
        >
          <h2 className="text-xl font-semibold mb-2">System Logs</h2>
          <p className="text-sm text-muted-foreground">
            Browse system logs filtered by date range
          </p>
        </a>
        <a
          href="/buffered-logs"
          className="block p-6 rounded-lg border bg-card hover:bg-accent transition-colors"
        >
          <h2 className="text-xl font-semibold mb-2">Buffered Logs</h2>
          <p className="text-sm text-muted-foreground">
            Monitor live buffered output logs in real-time
          </p>
        </a>
      </div>
    </div>
  );
}
