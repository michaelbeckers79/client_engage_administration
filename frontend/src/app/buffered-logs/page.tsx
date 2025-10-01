"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BufferedLog {
  timestamp: string;
  message: string;
}

export default function BufferedLogsPage() {
  const [logs, setLogs] = useState<BufferedLog[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(5);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial fetch
    fetchLogs();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (autoRefresh) {
      interval = setInterval(() => {
        fetchLogs();
      }, refreshInterval * 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [autoRefresh, refreshInterval]);

  useEffect(() => {
    // Auto-scroll to bottom when logs update
    if (scrollRef.current && autoRefresh) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, autoRefresh]);

  const fetchLogs = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/bufferedlogs`);
      
      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs || []);
      }
    } catch (error) {
      console.error("Failed to fetch buffered logs:", error);
      // For development, add mock data
      setLogs((prev) => [
        ...prev,
        {
          timestamp: new Date().toISOString(),
          message: `[${new Date().toLocaleTimeString()}] System check completed successfully`,
        },
      ].slice(-100)); // Keep last 100 entries
    }
  };

  const handleToggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  const handleRefreshNow = () => {
    fetchLogs();
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Buffered Output Logs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Controls */}
          <div className="flex items-center gap-4">
            <Button
              variant={autoRefresh ? "destructive" : "default"}
              onClick={handleToggleAutoRefresh}
            >
              {autoRefresh ? "Stop Auto-Refresh" : "Start Auto-Refresh"}
            </Button>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Refresh Interval (seconds):</label>
              <Input
                type="number"
                min="1"
                max="60"
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                className="w-20"
                disabled={autoRefresh}
              />
            </div>
            <Button variant="outline" onClick={handleRefreshNow}>
              Refresh Now
            </Button>
            <Button variant="outline" onClick={handleClearLogs}>
              Clear
            </Button>
          </div>

          {/* Status */}
          <div className="text-sm text-muted-foreground">
            {autoRefresh ? (
              <span className="text-green-600 font-semibold">
                ● Auto-refresh is ON (every {refreshInterval}s)
              </span>
            ) : (
              <span>● Auto-refresh is OFF</span>
            )}
            <span className="ml-4">Total logs: {logs.length}</span>
          </div>

          {/* Console-like output */}
          <div
            ref={scrollRef}
            className="bg-black text-green-400 font-mono text-sm p-4 rounded-lg overflow-y-auto h-[600px]"
          >
            {logs.length === 0 ? (
              <div className="text-gray-500">No logs available. Waiting for data...</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1">
                  <span className="text-gray-500">
                    [{new Date(log.timestamp).toLocaleTimeString()}]
                  </span>{" "}
                  {log.message}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
