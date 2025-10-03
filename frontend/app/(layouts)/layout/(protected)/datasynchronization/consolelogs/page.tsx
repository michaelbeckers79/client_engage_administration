'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Terminal, 
  Download, 
  Play, 
  Pause, 
  RotateCcw, 
  Settings,
  Clock,
  Activity,
  AlertCircle,
  Info,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConsoleLogEntry {
  timestamp: string;
  message: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  service?: string;
}

// Mock log generator function
const generateMockLog = (services: string[]): ConsoleLogEntry => {
  const levels: ConsoleLogEntry['level'][] = ['info', 'warn', 'error', 'debug'];
  const messages = [
    'Service started successfully',
    'Database connection established',
    'Processing user request',
    'Cache hit for key: user_123',
    'Warning: High memory usage detected',
    'Error: Failed to connect to external API',
    'Debug: Query execution time: 45ms',
    'Authentication successful for user',
    'Background job completed',
    'Health check passed',
    'Rate limit exceeded for IP',
    'Session expired for user',
    'File uploaded successfully',
    'Email notification sent',
    'Webhook received from payment provider'
  ];

  const randomService = services[Math.floor(Math.random() * services.length)];
  const randomLevel = levels[Math.floor(Math.random() * levels.length)];
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  return {
    timestamp: new Date().toISOString(),
    message: `[${randomService}] ${randomMessage}`,
    level: randomLevel,
    service: randomService,
  };
};

export default function ConsoleLogsPage() {
  const [logs, setLogs] = useState<ConsoleLogEntry[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(3);
  const [selectedService, setSelectedService] = useState<string>('all');
  const [maxBufferSize, setMaxBufferSize] = useState(1000);
  
  const logContainerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const services = ['auth-service', 'payment-service', 'notification-service', 'user-service', 'order-service'];

  // Auto-scroll to bottom when new logs arrive
  const scrollToBottom = useCallback(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [autoScroll]);

  // Add new log entry
  const addLogEntry = useCallback(() => {
    const newLog = generateMockLog(services);
    setLogs(prevLogs => {
      const updatedLogs = [...prevLogs, newLog];
      // Buffer management - keep only the last maxBufferSize entries
      if (updatedLogs.length > maxBufferSize) {
        return updatedLogs.slice(-maxBufferSize);
      }
      return updatedLogs;
    });
  }, [services, maxBufferSize]);

  // Start/stop streaming
  useEffect(() => {
    if (isStreaming) {
      intervalRef.current = setInterval(addLogEntry, refreshInterval * 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isStreaming, refreshInterval, addLogEntry]);

  // Auto-scroll effect
  useEffect(() => {
    scrollToBottom();
  }, [logs, scrollToBottom]);

  // Initialize with some sample logs
  useEffect(() => {
    const initialLogs = Array.from({ length: 20 }, () => generateMockLog(services));
    setLogs(initialLogs);
  }, []);

  const handleToggleStreaming = () => {
    setIsStreaming(!isStreaming);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  const handleExportLogs = () => {
    const filteredLogs = selectedService === 'all' 
      ? logs 
      : logs.filter(log => log.service === selectedService);

    const csvData = filteredLogs.map(log => ({
      'Timestamp': new Date(log.timestamp).toLocaleString(),
      'Level': log.level.toUpperCase(),
      'Service': log.service || '',
      'Message': log.message,
    }));
    
    const headers = Object.keys(csvData[0]).join(',');
    const rows = csvData.map(row => Object.values(row).map(value => `"${value}"`).join(','));
    const csv = [headers, ...rows].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `console-logs-${selectedService}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getLogIcon = (level: ConsoleLogEntry['level']) => {
    switch (level) {
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'warn':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'debug':
        return <Settings className="h-4 w-4 text-gray-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getLogLevelColor = (level: ConsoleLogEntry['level']) => {
    switch (level) {
      case 'error':
        return 'text-red-400';
      case 'warn':
        return 'text-yellow-400';
      case 'info':
        return 'text-blue-400';
      case 'debug':
        return 'text-gray-400';
      default:
        return 'text-gray-400';
    }
  };

  const filteredLogs = selectedService === 'all' 
    ? logs 
    : logs.filter(log => log.service === selectedService);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="h-5 w-5" />
                Console Logs
                <Badge variant="outline" className="ml-2">
                  <Activity className={`h-3 w-3 mr-1 ${isStreaming ? 'text-green-500' : 'text-gray-500'}`} />
                  {isStreaming ? 'Live' : 'Paused'}
                </Badge>
              </CardTitle>
              <CardDescription>
                Real-time console output and debug information from your services.
                Buffer size: {filteredLogs.length}/{maxBufferSize} entries
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleStreaming}
              >
                {isStreaming ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearLogs}
                disabled={logs.length === 0}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportLogs}
                disabled={filteredLogs.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Label htmlFor="auto-scroll">Auto-scroll</Label>
              <Switch
                id="auto-scroll"
                checked={autoScroll}
                onCheckedChange={setAutoScroll}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Label htmlFor="refresh-interval">Refresh every</Label>
              <Select
                value={refreshInterval.toString()}
                onValueChange={(value) => setRefreshInterval(parseInt(value))}
              >
                <SelectTrigger id="refresh-interval" className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1s</SelectItem>
                  <SelectItem value="2">2s</SelectItem>
                  <SelectItem value="3">3s</SelectItem>
                  <SelectItem value="5">5s</SelectItem>
                  <SelectItem value="10">10s</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Label htmlFor="service-filter">Service</Label>
              <Select
                value={selectedService}
                onValueChange={setSelectedService}
              >
                <SelectTrigger id="service-filter" className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  {services.map(service => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Label htmlFor="buffer-size">Buffer</Label>
              <Select
                value={maxBufferSize.toString()}
                onValueChange={(value) => setMaxBufferSize(parseInt(value))}
              >
                <SelectTrigger id="buffer-size" className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="500">500</SelectItem>
                  <SelectItem value="1000">1000</SelectItem>
                  <SelectItem value="2000">2000</SelectItem>
                  <SelectItem value="5000">5000</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Console Output */}
          <div
            ref={logContainerRef}
            className="bg-black text-green-400 font-mono text-sm p-4 rounded-lg h-[48rem] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
            style={{
              backgroundColor: '#0a0a0a',
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
            }}
          >
            {filteredLogs.length === 0 ? (
              <div className="text-gray-500 text-center py-8">
                <Terminal className="h-8 w-8 mx-auto mb-2 opacity-50" />
                No logs available. Start streaming to see console output.
              </div>
            ) : (
              <div className="space-y-1">
                {filteredLogs.map((log, index) => (
                  <div key={index} className="flex items-start gap-2 leading-relaxed">
                    <div className="flex items-center gap-1 shrink-0">
                      {getLogIcon(log.level)}
                    </div>
                    <span className="text-gray-500 shrink-0 text-xs">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    <span className={cn("font-semibold shrink-0 text-xs uppercase", getLogLevelColor(log.level))}>
                      [{log.level}]
                    </span>
                    <span className="text-green-400 break-all">
                      {log.message}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status Bar */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Last update: {logs.length > 0 ? new Date(logs[logs.length - 1]?.timestamp).toLocaleTimeString() : 'Never'}
              </div>
              <div>
                Showing {filteredLogs.length} entries
              </div>
            </div>
            <div className="text-xs">
              {autoScroll ? 'Auto-scrolling enabled' : 'Auto-scrolling disabled'}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}