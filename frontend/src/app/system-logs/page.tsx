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

interface SystemLog {
  id: number;
  date: string;
  exception: string;
}

export default function SystemLogsPage() {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Date range filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchLogs();
  }, [page, startDate, endDate]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        $skip: ((page - 1) * pageSize).toString(),
        $top: pageSize.toString(),
      });

      const filters = [];
      if (startDate) {
        filters.push(`date ge ${startDate}T00:00:00Z`);
      }
      if (endDate) {
        filters.push(`date le ${endDate}T23:59:59Z`);
      }
      if (filters.length > 0) {
        queryParams.append("$filter", filters.join(" and "));
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/odata/systemlogs?${queryParams}`);
      
      if (response.ok) {
        const data = await response.json();
        setLogs(data.value || []);
        const count = data["@odata.count"] || 0;
        setTotalPages(Math.ceil(count / pageSize));
      }
    } catch (error) {
      console.error("Failed to fetch system logs:", error);
      // For development, use mock data
      setLogs(generateMockData());
      setTotalPages(5);
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = (): SystemLog[] => {
    return Array.from({ length: pageSize }, (_, i) => ({
      id: page * pageSize + i,
      date: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      exception: [
        "System error: Database connection timeout",
        "Application exception: Failed to process request",
        "Network error: Unable to reach external service",
        "Authentication failed: Invalid credentials",
        "System warning: High memory usage detected",
      ][Math.floor(Math.random() * 5)],
    }));
  };

  const handleApplyFilter = () => {
    setPage(1); // Reset to first page when filtering
    fetchLogs();
  };

  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>System Logs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Date Range Filters */}
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Start Date</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">End Date</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleApplyFilter}>Apply</Button>
              <Button variant="outline" onClick={handleClearFilter}>
                Clear
              </Button>
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
                    <TableHead className="w-48">Date</TableHead>
                    <TableHead>Exception</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm">
                        {new Date(log.date).toLocaleString()}
                      </TableCell>
                      <TableCell className="font-mono text-sm text-red-600">
                        {log.exception}
                      </TableCell>
                    </TableRow>
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
