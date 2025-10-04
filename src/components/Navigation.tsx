import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read?: boolean;
}

interface NavigationProps {
  user?: {
    name: string;
    role: "student" | "teacher" | "parent" | "admin";
    notifications: number;
  };
}

export const Navigation = ({ user: userProp }: NavigationProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user: authUser, signOut } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, title: "Assignment Due", message: "Math homework due tomorrow!", time: "2h ago" },
    { id: 2, title: "New Message", message: "Parent meeting scheduled.", time: "5h ago" },
    { id: 3, title: "Performance Update", message: "Weekly report ready to view.", time: "1d ago" },
  ]);

  const user =
    userProp ||
    (authUser
      ? { name: authUser.name, role: authUser.role, notifications: notifications.length }
      : undefined);

  const navItems = user
    ? [
        { path: "/dashboard", label: "Dashboard", roles: ["student", "teacher"] },
        { path: "/practice", label: "Practice", roles: ["student"] },
        { path: "/class-dashboard", label: "Class Dashboard", roles: ["teacher"] },
        { path: "/teacher", label: "Assignments", roles: ["teacher"] },
        { path: "/analytics", label: "Analytics", roles: ["teacher"] },
        { path: "/reports", label: "Reports", roles: ["teacher"] },
      ].filter((item) => item.roles.includes(user.role))
    : [];

  const handleNotificationClick = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <nav className="bg-background/80 backdrop-blur-md border-b border-white-soft sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate("/")}
          >
            <img
              src="/logobg.png"
              alt="LearnWise Logo"
              className="w-8 h-8"
              style={{ minWidth: "60px", minHeight: "60px" }}
            />
            <span className="font-bold text-xl gradient-text">LearnWise</span>
          </div>

          {/* Navigation Items */}
          {user && (
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  variant={location.pathname === item.path ? "default" : "ghost"}
                  className={cn(
                    "relative",
                    location.pathname === item.path &&
                      "bg-gradient-primary text-primary-foreground"
                  )}
                  onClick={() => navigate(item.path)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          )}

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                {/* Notifications Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative">
                      <Bell className="w-4 h-4" />
                      {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-error text-error-foreground">
                          {unreadCount}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="w-64 p-0 overflow-hidden"
                  >
                    <DropdownMenuLabel className="px-3 py-2 font-semibold bg-muted">
                      Notifications
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <DropdownMenuItem
                          key={n.id}
                          onSelect={() => handleNotificationClick(n.id)}
                          className={cn(
                            "flex flex-col items-start space-y-1 py-2 px-3",
                            !n.read && "bg-muted/40"
                          )}
                        >
                          <span className="text-sm font-medium">{n.title}</span>
                          <span className="text-xs text-muted-foreground">{n.message}</span>
                          <span className="text-[10px] text-muted-foreground italic">{n.time}</span>
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <DropdownMenuItem disabled>
                        <span className="text-sm text-muted-foreground">
                          No new notifications
                        </span>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Settings */}
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label="Settings"
                  onClick={() => navigate("/settings")}
                >
                  <Settings className="w-4 h-4" />
                </Button>

                {/* User Profile */}
                <div className="flex items-center space-x-3 pl-3 border-l">
                  <div
                    className="text-right cursor-pointer"
                    onClick={() => navigate("/profile")}
                    title="Profile"
                  >
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {user.role}
                    </p>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full w-8 h-8 p-0"
                        aria-label="User menu"
                      >
                        <User className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onSelect={() => navigate("/profile")}
                      >
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => navigate("/settings")}
                      >
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onSelect={() => {
                          signOut();
                          navigate("/login");
                        }}
                      >
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Logout */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    signOut();
                    navigate("/login");
                  }}
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate("/login")}>
                  Sign In
                </Button>
                <Button
                  className="btn-gradient"
                  onClick={() => navigate("/signup")}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {user && (
        <div className="md:hidden border-t px-4 py-2">
          <div className="flex space-x-1 overflow-x-auto">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={location.pathname === item.path ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "whitespace-nowrap",
                  location.pathname === item.path &&
                    "bg-gradient-primary text-primary-foreground"
                )}
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};
