'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Clock, Settings } from 'lucide-react';

export default function SystemLogsPage() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            System Logs
          </CardTitle>
          <CardDescription>
            View system-level logs and monitor application health.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 space-y-4">
            <div className="mx-auto w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">System Logs Coming Soon</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                This section will display system-level logs including application errors, 
                performance metrics, and health checks.
              </p>
            </div>
            <Badge variant="secondary">Under Development</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}