import { useEffect, useState } from 'react';
import { toAbsoluteUrl } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  FolderCode,
  Mails,
  NotepadText,
  ScrollText,
  Settings,
  ShieldUser,
  UserCircle,
  Users,
  User,
  Clock,
  Shield,
  Building2,
  LogOut,
  Download,
  ExternalLink,
  Zap,
  Target,
  Sun,
  Moon,
} from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarIndicator,
  AvatarStatus,
} from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const menuItems = [
  {
    icon: UserCircle,
    tooltip: 'Profile',
    path: '#',
    rootPath: '#',
  },
  {
    icon: BarChart3,
    tooltip: 'Dashboard',
    path: '#',
    rootPath: '#'
  },
  {
    icon: Settings,
    tooltip: 'Account',
    path: '#',
    rootPath: '#',
  },
  {
    icon: Users,
    tooltip: 'Network',
    path: '#',
    rootPath: '#',
  },
  {
    icon: ShieldUser,
    tooltip: 'Authentication',
    path: '#',
    rootPath: '#',
  }
];

export function SidebarPrimary() {
  const pathname = usePathname();
  const [selectedMenuItem, setSelectedMenuItem] = useState(menuItems[1]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // You can add actual theme switching logic here
    document.documentElement.classList.toggle('dark');
  };

  useEffect(() => {
    menuItems.forEach((item) => {
      if (
        item.rootPath === pathname ||
        (item.rootPath && pathname.includes(item.rootPath))
      ) {
        setSelectedMenuItem(item);
      }
    });
  }, [pathname]);

  return (
    <div className="flex flex-col items-center justify-center shrink-0 py-5 gap-5 w-[70px] lg:w-(--sidebar-collapsed-width) border-e border-input bg-background">
      {/* Logo */}
      <div className="flex items-center justify-center shrink-0">
        <Link href="/layout-20">
          <img src={toAbsoluteUrl('/media/app/mini-logo-white.svg')} alt="image" className="min-h-[25px]" />
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="grow w-full h-[calc(100vh-16.5rem)] lg:h-[calc(100vh-5.5rem)]">
        <div className="grow gap-2.5 shrink-0 flex items-center flex-col">
          {menuItems.map((item, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Button
                  asChild
                  variant="ghost"
                  mode="icon"
                  {...(item === selectedMenuItem
                    ? { 'data-state': 'open' }
                    : {})}
                  className={cn(
                    'size-9 border border-transparent shrink-0 rounded-md',
                    'data-[state=open]:bg-zinc-900 data-[state=open]:text-white data-[state=open]:border-zinc-800',
                    'hover:text-foreground',
                  )}
                >
                  <Link href={item.path}>
                    <item.icon className="size-4.5!" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">{item.tooltip}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
    </div>
  );
}
