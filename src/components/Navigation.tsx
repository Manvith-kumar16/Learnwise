import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  User, 
  Bell,
  Settings,
  LogOut
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

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
  const user = userProp || (authUser ? { name: authUser.name, role: authUser.role, notifications: 0 } : undefined);

  const navItems = user ? [
    { 
      path: "/dashboard", 
      label: "Dashboard", 
      roles: ["student", "teacher", "parent", "admin"] 
    },
    { 
      path: "/practice", 
      label: "Practice", 
      roles: ["student"] 
    },
    { 
      path: "/teacher", 
      label: "My Classes", 
      roles: ["teacher"] 
    },
    { 
      path: "/analytics", 
      label: "Analytics", 
      roles: ["teacher", "admin"] 
    },
    { 
      path: "/reports", 
      label: "Reports", 
      roles: ["teacher", "parent", "admin"] 
    }
  ].filter(item => item.roles.includes(user.role)) : [];

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/')}
          >
            <img 
              src="/logobg.png" 
              alt="LearnWise Logo" 
              className="w-8 h-8" 
              style={{minWidth: '60px', minHeight: '60px'}}
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
                    location.pathname === item.path && "bg-gradient-primary text-primary-foreground"
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
                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="w-4 h-4" />
                  {user.notifications > 0 && (
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-error text-error-foreground">
                      {user.notifications}
                    </Badge>
                  )}
                </Button>

                {/* Settings */}
                <Button variant="ghost" size="sm" aria-label="Settings" onClick={() => navigate('/settings')}>
                  <Settings className="w-4 h-4" />
                </Button>

                {/* User Profile */}
                <div className="flex items-center space-x-3 pl-3 border-l">
                  <div className="text-right">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="rounded-full w-8 h-8 p-0">
                    <User className="w-4 h-4" />
                  </Button>
                </div>

                {/* Logout */}
                <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate('/login'); }}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/login')}>
                  Sign In
                </Button>
                <Button className="btn-gradient" onClick={() => navigate('/signup')}>
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
                  location.pathname === item.path && "bg-gradient-primary text-primary-foreground"
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
