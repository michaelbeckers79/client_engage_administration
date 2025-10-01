"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronUp } from "lucide-react";

interface EntityLog {
  id: number;
  internalId: string;
  externalId: string;
  created: string;
  modified: string;
  succeeded: number;
  failedCount: number;
  exception: string;
  name: string;
}

export default function EntityLogsPage() {
  const [logs, setLogs] = useState<EntityLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filters
  const [filters, setFilters] = useState({
    internalId: "",
    externalId: "",
    name: "",
  });

  useEffect(() => {
    fetchLogs();
  }, [page, filters]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        $skip: ((page - 1) * pageSize).toString(),
        $top: pageSize.toString(),
      });

      if (filters.internalId) {
        queryParams.append("$filter", `contains(internalId, '${filters.internalId}')`);
      }
      if (filters.externalId) {
        queryParams.append("$filter", `contains(externalId, '${filters.externalId}')`);
      }
      if (filters.name) {
        queryParams.append("$filter", `contains(name, '${filters.name}')`);
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/odata/entitylogs?${queryParams}`);
      
      if (response.ok) {
        const data = await response.json();
        setLogs(data.value || []);
        const count = data["@odata.count"] || 0;
        setTotalPages(Math.ceil(count / pageSize));
      }
    } catch (error) {
      console.error("Failed to fetch entity logs:", error);
      // For development, use mock data
      setLogs(generateMockData());
      setTotalPages(5);
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = (): EntityLog[] => {
    return Array.from({ length: pageSize }, (_, i) => ({
      id: page * pageSize + i,
      internalId: `INT-${1000 + page * pageSize + i}`,
      externalId: `EXT-${2000 + page * pageSize + i}`,
      created: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      modified: new Date(Date.now() - Math.random() * 5000000000).toISOString(),
      succeeded: Math.floor(Math.random() * 100),
      failedCount: Math.floor(Math.random() * 10),
      exception: Math.random() > 0.7 ? `Error occurred during sync: ${Math.random() > 0.5 ? 'Connection timeout' : 'Invalid data format'}` : "",
      name: `Entity ${page * pageSize + i}`,
    }));
  };

  const toggleRow = (id: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1); // Reset to first page when filtering
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Entity Logs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Internal ID</label>
              <Input
                placeholder="Filter by Internal ID"
                value={filters.internalId}
                onChange={(e) => handleFilterChange("internalId", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">External ID</label>
              <Input
                placeholder="Filter by External ID"
                value={filters.externalId}
                onChange={(e) => handleFilterChange("externalId", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Name</label>
              <Input
                placeholder="Filter by Name"
                value={filters.name}
                onChange={(e) => handleFilterChange("name", e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Internal ID</TableHead>
                    <TableHead>External ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Modified</TableHead>
                    <TableHead>Succeeded</TableHead>
                    <TableHead>Failed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <>
                      <TableRow key={log.id}>
                        <TableCell>
                          {log.exception && (
                            <button
                              onClick={() => toggleRow(log.id)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              {expandedRows.has(log.id) ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </button>
                          )}
                        </TableCell>
                        <TableCell className="font-mono text-xs">{log.internalId}</TableCell>
                        <TableCell className="font-mono text-xs">{log.externalId}</TableCell>
                        <TableCell>{log.name}</TableCell>
                        <TableCell className="text-sm">
                          {new Date(log.created).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(log.modified).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-green-600 font-semibold">
                          {log.succeeded}
                        </TableCell>
                        <TableCell className="text-red-600 font-semibold">
                          {log.failedCount}
                        </TableCell>
                      </TableRow>
                      {expandedRows.has(log.id) && log.exception && (
                        <TableRow key={`${log.id}-exception`}>
                          <TableCell></TableCell>
                          <TableCell colSpan={7} className="bg-muted/50">
                            <div className="p-3 space-y-1">
                              <div className="text-sm font-semibold">Exception:</div>
                              <div className="text-sm font-mono text-red-600 whitespace-pre-wrap">
                                {log.exception}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
