import { MenuConfig } from "@/config/types";
import {
  Bolt,
  SquareActivity,
  BarChart3
} from "lucide-react";

export const MENU_SIDEBAR_MAIN: MenuConfig = [
  {
    children: [
      {
        title: 'Home',
        path: '/layout',
        icon: Bolt
      }
    ],
  }
];

export const MENU_SIDEBAR_RESOURCES: MenuConfig = [
  {
    title: 'Resources',
    children: [
      {
        title: 'Help',
        path: '#',
        icon: SquareActivity
      }
    ],
  }
];

export const MENU_SIDEBAR_WORKSPACES: MenuConfig = [
  {
    title: 'Data Synchronization',
    children: [
      {
        title: 'Dashboard',
        path: '/layout/datasynchronization',
        icon: BarChart3
      },
      {
        title: 'Entity Logs',
        path: '/layout/datasynchronization/entitylogs',
        icon: Bolt
      },
      {
        title: 'System Logs',
        path: '/layout/datasynchronization/systemlogs',
        icon: Bolt
      },
      {
        title: 'Console Log',
        path: '/layout/datasynchronization/consolelogs',
        icon: Bolt
      }
    ],
  }
];
