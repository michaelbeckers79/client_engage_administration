'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface DataSynchronizationLayoutProps {
  children: ReactNode;
}

export default function DataSynchronizationLayout({ children }: DataSynchronizationLayoutProps) {
  const pathname = usePathname();

  const navigationItems = [
    {
      href: '/layout/datasynchronization/entitylogs',
      label: 'Entity Logs',
      description: 'Entity synchronization logs',
    },
    {
      href: '/layout/datasynchronization/systemlogs',
      label: 'System Logs',
      description: 'System-level logs',
    },
    {
      href: '/layout/datasynchronization/consolelogs',
      label: 'Console Logs',
      description: 'Console and debug logs',
    },
  ];

  return (
    <div className="container-fluid space-y-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Data Synchronization</h1>
        <p className="text-muted-foreground">
          Monitor and manage data synchronization logs of Client Engage.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Tabs value={pathname} className="w-full">
            <div className="border-b px-6 py-4">
              <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-none lg:flex">
                {navigationItems.map((item) => (
                  <TabsTrigger
                    key={item.href}
                    value={item.href}
                    asChild
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Link href={item.href} className="flex flex-col items-center gap-1 px-4 py-2">
                      <span className="font-medium">{item.label}</span>
                      <span className="text-xs text-muted-foreground lg:hidden">
                        {item.description}
                      </span>
                    </Link>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}