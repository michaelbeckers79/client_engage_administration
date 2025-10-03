'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  Database, 
  Settings, 
  Terminal, 
  Activity, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

export default function DataSynchronizationPage() {
  // Mock statistics
  const stats = [
    {
      title: 'Total Sync Operations',
      value: '12,453',
      change: '+12%',
      trend: 'up',
      icon: Database,
    },
    {
      title: 'Success Rate',
      value: '98.5%',
      change: '+2.1%',
      trend: 'up',
      icon: CheckCircle,
    },
    {
      title: 'Failed Operations',
      value: '23',
      change: '-15%',
      trend: 'down',
      icon: AlertTriangle,
    },
    {
      title: 'Avg. Response Time',
      value: '245ms',
      change: '-8%',
      trend: 'down',
      icon: Clock,
    },
  ];

  const logSections = [
    {
      title: 'Entity Logs',
      description: 'Monitor entity synchronization activities including create, update, delete, and sync operations.',
      href: '/layout/datasynchronization/entitylogs',
      icon: Database,
      status: 'Active',
      statusColor: 'bg-green-100 text-green-800 border-green-200',
      count: '1,247 entries',
    },
    {
      title: 'System Logs',
      description: 'View system-level logs including application errors, performance metrics, and health checks.',
      href: '/layout/datasynchronization/systemlogs',
      icon: Settings,
      status: 'Coming Soon',
      statusColor: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      count: 'In development',
    },
    {
      title: 'Console Logs',
      description: 'Access console output and debug information for troubleshooting and monitoring.',
      href: '/layout/datasynchronization/consolelogs',
      icon: Terminal,
      status: 'Active',
      statusColor: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      count: 'Running',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={`inline-flex items-center gap-1 ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className={`h-3 w-3 ${
                    stat.trend === 'down' ? 'rotate-180' : ''
                  }`} />
                  {stat.change}
                </span>
                {' '}from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Log Sections */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {logSections.map((section) => (
          <Card key={section.title} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <section.icon className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                </div>
                <Badge variant="outline" className={section.statusColor}>
                  {section.status}
                </Badge>
              </div>
              <CardDescription>
                {section.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Current status:</span>
                <span className="font-medium">{section.count}</span>
              </div>
              <Button asChild className="w-full" variant={section.status === 'Active' ? 'primary' : 'outline'}>
                <Link href={section.href}>
                  {section.status === 'Active' ? 'View Logs' : 'Preview'}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Latest synchronization activities across all systems.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                action: 'Entity sync completed',
                entity: 'User (USR-001)',
                time: '2 minutes ago',
                status: 'success',
              },
              {
                action: 'Batch update failed',
                entity: 'Order (ORD-002)',
                time: '5 minutes ago',
                status: 'error',
              },
              {
                action: 'Webhook received',
                entity: 'Product (PRD-001)',
                time: '8 minutes ago',
                status: 'success',
              },
              {
                action: 'System health check',
                entity: 'All services',
                time: '15 minutes ago',
                status: 'success',
              },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.entity}</p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}