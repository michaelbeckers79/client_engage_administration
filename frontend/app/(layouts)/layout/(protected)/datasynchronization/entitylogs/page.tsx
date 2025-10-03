'use client';

import { useMemo, useState } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { DataGrid, DataGridContainer } from '@/components/ui/data-grid';
import { DataGridColumnFilter } from '@/components/ui/data-grid-column-filter';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import { DataGridTable } from '@/components/ui/data-grid-table';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUpDown, Search, X, Download, RefreshCw, Filter, Eye, Copy, CheckCircle2 } from 'lucide-react';

// Entity Log interface
interface EntityLog {
  id: string;
  entityType: string;
  entityId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'SYNC';
  status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'RETRY';
  timestamp: string;
  source: string;
  errorMessage?: string;
  stackTrace?: string;
  duration: number;
  requestId?: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  payload?: object;
  response?: object;
}

// Mock data for demonstration
const mockEntityLogs: EntityLog[] = [
  {
    id: '1',
    entityType: 'User',
    entityId: 'USR-001',
    action: 'CREATE',
    status: 'SUCCESS',
    timestamp: '2024-10-02T10:30:00Z',
    source: 'API',
    duration: 150,
    requestId: 'req-12345',
    userId: 'admin-001',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    payload: { name: 'John Doe', email: 'john@example.com' },
    response: { id: 'USR-001', status: 'created' }
  },
  {
    id: '2',
    entityType: 'Order',
    entityId: 'ORD-001',
    action: 'UPDATE',
    status: 'FAILED',
    timestamp: '2024-10-02T10:25:00Z',
    source: 'BATCH',
    errorMessage: 'Validation failed: Invalid status transition from PENDING to CANCELLED',
    stackTrace: `com.example.ValidationException: Invalid status transition from PENDING to CANCELLED\n\tat com.example.order.OrderService.updateStatus(OrderService.java:145)\n\tat com.example.order.OrderController.updateOrder(OrderController.java:78)\n\tat com.example.batch.OrderProcessor.processOrder(OrderProcessor.java:234)\n\tat com.example.batch.BatchService.processBatch(BatchService.java:123)\n\tat java.base/java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1136)\n\tat java.base/java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:635)\n\tat java.base/java.lang.Thread.run(Thread.java:833)\nCaused by: com.example.StateException: Cannot transition from PENDING to CANCELLED\n\tat com.example.order.OrderStateMachine.transition(OrderStateMachine.java:89)\n\tat com.example.order.OrderService.updateStatus(OrderService.java:142)\n\t... 6 more`,
    duration: 300,
    requestId: 'req-12346',
    userId: 'batch-system',
    payload: { orderId: 'ORD-001', newStatus: 'CANCELLED' }
  },
  {
    id: '3',
    entityType: 'Product',
    entityId: 'PRD-001',
    action: 'SYNC',
    status: 'SUCCESS',
    timestamp: '2024-10-02T10:20:00Z',
    source: 'WEBHOOK',
    duration: 75,
    requestId: 'req-12347',
    payload: { productId: 'PRD-001', inventory: 100 },
    response: { synchronized: true, timestamp: '2024-10-02T10:20:00Z' }
  },
  {
    id: '4',
    entityType: 'User',
    entityId: 'USR-002',
    action: 'DELETE',
    status: 'PENDING',
    timestamp: '2024-10-02T10:15:00Z',
    source: 'API',
    duration: 0,
    requestId: 'req-12348',
    userId: 'admin-002',
    ipAddress: '192.168.1.101',
    payload: { userId: 'USR-002', reason: 'User requested account deletion' }
  },
  {
    id: '5',
    entityType: 'Order',
    entityId: 'ORD-002',
    action: 'CREATE',
    status: 'RETRY',
    timestamp: '2024-10-02T10:10:00Z',
    source: 'BATCH',
    errorMessage: 'Connection timeout to payment service',
    stackTrace: `java.net.SocketTimeoutException: Read timed out\n\tat java.base/java.net.SocketInputStream.socketRead0(Native Method)\n\tat java.base/java.net.SocketInputStream.socketRead(SocketInputStream.java:115)\n\tat java.base/java.net.SocketInputStream.read(SocketInputStream.java:168)\n\tat java.base/java.net.SocketInputStream.read(SocketInputStream.java:140)\n\tat java.base/sun.security.ssl.SSLSocketInputRecord.read(SSLSocketInputRecord.java:478)\n\tat java.base/sun.security.ssl.SSLSocketInputRecord.readHeader(SSLSocketInputRecord.java:472)\n\tat java.base/sun.security.ssl.SSLSocketInputRecord.decode(SSLSocketInputRecord.java:160)\n\tat java.base/sun.security.ssl.SSLTransport.decode(SSLTransport.java:111)\n\tat java.base/sun.security.ssl.SSLSocketImpl.decode(SSLSocketImpl.java:1508)\n\tat java.base/sun.security.ssl.SSLSocketImpl.readHandshakeRecord(SSLSocketImpl.java:1416)\n\tat java.base/sun.security.ssl.SSLSocketImpl.readRecord(SSLSocketImpl.java:1282)\n\tat java.base/sun.security.ssl.SSLSocketImpl.readApplicationRecord(SSLSocketImpl.java:1343)\n\tat java.base/sun.security.ssl.SSLSocketImpl$AppInputStream.read(SSLSocketImpl.java:987)\n\tat com.example.payment.PaymentServiceClient.processPayment(PaymentServiceClient.java:156)\n\tat com.example.order.OrderService.createOrder(OrderService.java:89)`,
    duration: 5000,
    requestId: 'req-12349',
    userId: 'batch-system',
    payload: { customerId: 'CUST-001', items: [{ productId: 'PRD-001', quantity: 2 }] }
  },
  {
    id: '6',
    entityType: 'Product',
    entityId: 'PRD-002',
    action: 'UPDATE',
    status: 'SUCCESS',
    timestamp: '2024-10-02T10:05:00Z',
    source: 'API',
    duration: 120,
    requestId: 'req-12350',
    userId: 'admin-001',
    ipAddress: '192.168.1.100',
    payload: { productId: 'PRD-002', price: 29.99 },
    response: { updated: true, version: 2 }
  },
  {
    id: '7',
    entityType: 'User',
    entityId: 'USR-003',
    action: 'SYNC',
    status: 'FAILED',
    timestamp: '2024-10-02T10:00:00Z',
    source: 'WEBHOOK',
    errorMessage: 'Entity not found in external system',
    stackTrace: `com.example.NotFoundException: User USR-003 not found in external system\n\tat com.example.external.UserSyncService.syncUser(UserSyncService.java:67)\n\tat com.example.sync.SyncController.handleWebhook(SyncController.java:45)\n\tat com.example.webhook.WebhookProcessor.processWebhook(WebhookProcessor.java:123)\n\tat org.springframework.web.method.support.InvocableHandlerMethod.doInvoke(InvocableHandlerMethod.java:190)\n\tat org.springframework.web.method.support.InvocableHandlerMethod.invokeForRequest(InvocableHandlerMethod.java:138)\n\tat org.springframework.web.servlet.mvc.method.annotation.ServletInvocableHandlerMethod.invokeAndHandle(ServletInvocableHandlerMethod.java:105)`,
    duration: 200,
    requestId: 'req-12351',
    payload: { externalUserId: 'ext-usr-003', action: 'sync' }
  },
];

function StatusBadge({ status }: { status: EntityLog['status'] }) {
  const variants = {
    SUCCESS: 'bg-green-100 text-green-800 border-green-200',
    FAILED: 'bg-red-100 text-red-800 border-red-200',
    PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    RETRY: 'bg-blue-100 text-blue-800 border-blue-200',
  };

  return (
    <Badge variant="outline" className={variants[status]}>
      {status}
    </Badge>
  );
}

function ActionBadge({ action }: { action: EntityLog['action'] }) {
  const variants = {
    CREATE: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    UPDATE: 'bg-orange-100 text-orange-800 border-orange-200',
    DELETE: 'bg-red-100 text-red-800 border-red-200',
    SYNC: 'bg-purple-100 text-purple-800 border-purple-200',
  };

  return (
    <Badge variant="outline" className={variants[action]}>
      {action}
    </Badge>
  );
}

export default function EntityLogsPage() {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'timestamp', desc: true }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState<EntityLog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Simulate data refresh
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  // Handle row double click or details click
  const handleRowDetails = (log: EntityLog) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  // Handle copy to clipboard
  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Simulate data export
  const handleExport = () => {
    const csvData = mockEntityLogs.map(log => ({
      'Entity Type': log.entityType,
      'Entity ID': log.entityId,
      'Action': log.action,
      'Status': log.status,
      'Source': log.source,
      'Timestamp': new Date(log.timestamp).toLocaleString(),
      'Duration (ms)': log.duration,
      'Error Message': log.errorMessage || '',
    }));
    
    const headers = Object.keys(csvData[0]).join(',');
    const rows = csvData.map(row => Object.values(row).map(value => `"${value}"`).join(','));
    const csv = [headers, ...rows].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `entity-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const columns: ColumnDef<EntityLog>[] = useMemo(
    () => [
      {
        id: 'details',
        header: '',
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleRowDetails(row.original);
            }}
            className="h-8 w-8 p-0"
          >
            <Eye className="h-4 w-4" />
          </Button>
        ),
        enableSorting: false,
        enableHiding: false,
        meta: {
          skeleton: <Skeleton className="h-8 w-8" />,
        },
      },
      {
        accessorKey: 'entityType',
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title="Entity Type" />
        ),
        cell: ({ row }) => (
          <div className="font-medium">
            {row.getValue('entityType')}
          </div>
        ),
        meta: {
          skeleton: <Skeleton className="h-4 w-16" />,
        },
      },
      {
        accessorKey: 'entityId',
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title="Entity ID" />
        ),
        cell: ({ row }) => (
          <div className="font-mono text-sm">
            {row.getValue('entityId')}
          </div>
        ),
        meta: {
          skeleton: <Skeleton className="h-4 w-20" />,
        },
      },
      {
        accessorKey: 'action',
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title="Action" />
        ),
        cell: ({ row }) => (
          <ActionBadge action={row.getValue('action')} />
        ),
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
        meta: {
          skeleton: <Skeleton className="h-6 w-16" />,
        },
      },
      {
        accessorKey: 'status',
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => (
          <StatusBadge status={row.getValue('status')} />
        ),
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
        meta: {
          skeleton: <Skeleton className="h-6 w-16" />,
        },
      },
      {
        accessorKey: 'source',
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title="Source" />
        ),
        cell: ({ row }) => (
          <Badge variant="secondary">
            {row.getValue('source')}
          </Badge>
        ),
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
        meta: {
          skeleton: <Skeleton className="h-6 w-16" />,
        },
      },
      {
        accessorKey: 'timestamp',
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title="Timestamp" />
        ),
        cell: ({ row }) => {
          const date = new Date(row.getValue('timestamp'));
          return (
            <div className="text-sm">
              {date.toLocaleString()}
            </div>
          );
        },
        meta: {
          skeleton: <Skeleton className="h-4 w-32" />,
        },
      },
      {
        accessorKey: 'duration',
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title="Duration (ms)" />
        ),
        cell: ({ row }) => (
          <div className="text-sm font-mono">
            {row.getValue('duration')}ms
          </div>
        ),
        meta: {
          skeleton: <Skeleton className="h-4 w-16" />,
        },
      },
      {
        accessorKey: 'errorMessage',
        header: 'Error Message',
        cell: ({ row }) => {
          const errorMessage = row.getValue('errorMessage') as string;
          return errorMessage ? (
            <div className="text-sm text-red-600 max-w-xs truncate" title={errorMessage}>
              {errorMessage}
            </div>
          ) : (
            <span className="text-muted-foreground">-</span>
          );
        },
        enableSorting: false,
        meta: {
          skeleton: <Skeleton className="h-4 w-24" />,
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: mockEntityLogs,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const entityTypeOptions = [
    { label: 'User', value: 'User' },
    { label: 'Order', value: 'Order' },
    { label: 'Product', value: 'Product' },
  ];

  const actionOptions = [
    { label: 'Create', value: 'CREATE' },
    { label: 'Update', value: 'UPDATE' },
    { label: 'Delete', value: 'DELETE' },
    { label: 'Sync', value: 'SYNC' },
  ];

  const statusOptions = [
    { label: 'Success', value: 'SUCCESS' },
    { label: 'Failed', value: 'FAILED' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Retry', value: 'RETRY' },
  ];

  const sourceOptions = [
    { label: 'API', value: 'API' },
    { label: 'Batch', value: 'BATCH' },
    { label: 'Webhook', value: 'WEBHOOK' },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Entity Logs</CardTitle>
              <CardDescription>
                Monitor and track all entity synchronization activities across your system.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search entity logs..."
                  value={globalFilter ?? ''}
                  onChange={(event) => setGlobalFilter(event.target.value)}
                  className="pl-9"
                />
                {globalFilter && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                    onClick={() => setGlobalFilter('')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <DataGridColumnFilter
                column={table.getColumn('entityType')}
                title="Entity Type"
                options={entityTypeOptions}
              />
              <DataGridColumnFilter
                column={table.getColumn('action')}
                title="Action"
                options={actionOptions}
              />
              <DataGridColumnFilter
                column={table.getColumn('status')}
                title="Status"
                options={statusOptions}
              />
              <DataGridColumnFilter
                column={table.getColumn('source')}
                title="Source"
                options={sourceOptions}
              />
            </div>
          </div>

          {/* Data Grid */}
          <DataGridContainer>
            <DataGrid
              table={table}
              recordCount={mockEntityLogs.length}
              isLoading={isLoading}
              onRowClick={handleRowDetails}
              tableLayout={{
                headerSticky: true,
                headerBackground: true,
                headerBorder: true,
                rowBorder: true,
                cellBorder: false,
                stripped: false,
                dense: false,
              }}
            >
              <DataGridTable />
              <div className="border-t px-4">
                <DataGridPagination
                  sizes={[5, 10, 20, 50]}
                  more={true}
                  moreLimit={5}
                />
              </div>
            </DataGrid>
          </DataGridContainer>
        </CardContent>
      </Card>

      {/* Entity Log Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Entity Log Details
            </DialogTitle>
            <DialogDescription>
              Detailed information for {selectedLog?.entityType} {selectedLog?.entityId}
            </DialogDescription>
          </DialogHeader>
          
          {selectedLog && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Log ID</Label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-2 py-1 bg-muted rounded text-sm font-mono">
                      {selectedLog.id}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(selectedLog.id, 'id')}
                      className="h-8 w-8 p-0"
                    >
                      {copiedField === 'id' ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Entity Type</Label>
                  <div className="font-medium">{selectedLog.entityType}</div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Entity ID</Label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-2 py-1 bg-muted rounded text-sm font-mono">
                      {selectedLog.entityId}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(selectedLog.entityId, 'entityId')}
                      className="h-8 w-8 p-0"
                    >
                      {copiedField === 'entityId' ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Action</Label>
                  <ActionBadge action={selectedLog.action} />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <StatusBadge status={selectedLog.status} />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Source</Label>
                  <Badge variant="secondary">{selectedLog.source}</Badge>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Timestamp</Label>
                  <div className="text-sm">
                    {new Date(selectedLog.timestamp).toLocaleString()}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Duration</Label>
                  <div className="text-sm font-mono">{selectedLog.duration}ms</div>
                </div>

                {selectedLog.requestId && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Request ID</Label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 px-2 py-1 bg-muted rounded text-sm font-mono">
                        {selectedLog.requestId}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(selectedLog.requestId!, 'requestId')}
                        className="h-8 w-8 p-0"
                      >
                        {copiedField === 'requestId' ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {selectedLog.userId && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">User ID</Label>
                    <div className="text-sm font-mono">{selectedLog.userId}</div>
                  </div>
                )}

                {selectedLog.ipAddress && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">IP Address</Label>
                    <div className="text-sm font-mono">{selectedLog.ipAddress}</div>
                  </div>
                )}
              </div>

              {/* Error Message and Stack Trace */}
              {selectedLog.errorMessage && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Error Message</Label>
                    <div className="flex items-start gap-2">
                      <div className="flex-1 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                        {selectedLog.errorMessage}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(selectedLog.errorMessage!, 'errorMessage')}
                        className="h-8 w-8 p-0 mt-1"
                      >
                        {copiedField === 'errorMessage' ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {selectedLog.stackTrace && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-muted-foreground">Stack Trace</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(selectedLog.stackTrace!, 'stackTrace')}
                          className="h-8 px-2"
                        >
                          {copiedField === 'stackTrace' ? (
                            <>
                              <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-1" />
                              Copy
                            </>
                          )}
                        </Button>
                      </div>
                      <Textarea
                        value={selectedLog.stackTrace}
                        readOnly
                        className="font-mono text-xs bg-gray-50 border border-gray-200 min-h-[500px] max-h-[500px] resize-none"
                        style={{ minHeight: '500px' }}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Payload and Response */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {selectedLog.payload && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium text-muted-foreground">Request Payload</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(JSON.stringify(selectedLog.payload, null, 2), 'payload')}
                        className="h-8 px-2"
                      >
                        {copiedField === 'payload' ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-1" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                    <pre className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono overflow-x-auto max-h-48 overflow-y-auto">
                      {JSON.stringify(selectedLog.payload, null, 2)}
                    </pre>
                  </div>
                )}

                {selectedLog.response && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium text-muted-foreground">Response</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(JSON.stringify(selectedLog.response, null, 2), 'response')}
                        className="h-8 px-2"
                      >
                        {copiedField === 'response' ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-1" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                    <pre className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono overflow-x-auto max-h-48 overflow-y-auto">
                      {JSON.stringify(selectedLog.response, null, 2)}
                    </pre>
                  </div>
                )}
              </div>

              {selectedLog.userAgent && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">User Agent</Label>
                  <div className="flex items-start gap-2">
                    <code className="flex-1 px-2 py-1 bg-muted rounded text-xs font-mono break-all">
                      {selectedLog.userAgent}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(selectedLog.userAgent!, 'userAgent')}
                      className="h-8 w-8 p-0"
                    >
                      {copiedField === 'userAgent' ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}