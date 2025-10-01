"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMsal } from "@azure/msal-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const pathname = usePathname();
  const { instance, accounts } = useMsal();

  const handleLogin = () => {
    instance.loginPopup({
      scopes: ["user.read"],
    });
  };

  const handleLogout = () => {
    instance.logoutPopup();
  };

  const isAuthenticated = accounts.length > 0;

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/entity-logs", label: "Entity Logs" },
    { href: "/system-logs", label: "System Logs" },
    { href: "/buffered-logs", label: "Buffered Logs" },
  ];

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold">
              Client Engage Admin
            </Link>
            <div className="flex space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === item.href
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-muted-foreground">
                  {accounts[0].username}
                </span>
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button onClick={handleLogin}>Login</Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
