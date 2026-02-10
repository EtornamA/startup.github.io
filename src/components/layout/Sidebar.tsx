import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  CheckSquare, 
  Search, 
  Sparkles, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Moon,
  LogIn,
  LogOut,
  BookOpen,
  GraduationCap,
  LayoutList
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';
import { useFocusMode } from '@/hooks/useFocusMode';
import { useAuth } from '@/hooks/useAuth';

const navigation = [
  { name: 'Calendar', href: '/app/calendar', icon: Calendar },
  { name: 'Schedule Builder', href: '/app/schedule-builder', icon: LayoutList },
  { name: 'Classes', href: '/app/classes', icon: GraduationCap },
  { name: 'Assignments', href: '/app/todo', icon: CheckSquare },
  { name: 'Notebook', href: '/app/notebook', icon: BookOpen },
  { name: 'Weekly Recap', href: '/app/recap', icon: Sparkles },
];

export function Sidebar() {
  const { sidebarOpen, toggleSidebar, toggleSearch, assignments } = useAppStore();
  const { focusModeEnabled, toggleFocusMode } = useFocusMode();
  const { user, profile, signOut, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const userInitials = profile?.display_name 
    ? profile.display_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() || 'U';

  const pendingAssignments = assignments.filter(a => a.status !== 'completed').length;

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 sm:hidden"
          onClick={toggleSidebar}
        />
      )}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen border-r border-border bg-sidebar transition-all duration-300",
          // Mobile: drawer that slides in/out
          "w-64 -translate-x-full sm:translate-x-0",
          // Desktop: always visible, collapsed or expanded
          "sm:w-16",
          sidebarOpen && "translate-x-0 sm:w-64"
        )}
      >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4 bg-sidebar">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-sm">
                <span className="text-lg font-bold text-white">F</span>
              </div>
              <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">FUTR</span>
            </div>
          )}
          {!sidebarOpen && (
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-sm mx-auto">
              <span className="text-lg font-bold text-white">F</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggleSidebar}
            className="shrink-0 hover:bg-secondary"
          >
            {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary shadow-sm border border-primary/20"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground hover:shadow-sm"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {sidebarOpen && (
                  <span className="flex-1">{item.name}</span>
                )}
                {sidebarOpen && item.name === 'Assignments' && pendingAssignments > 0 && (
                  <Badge variant="default" className="h-5 min-w-5 justify-center px-1.5">
                    {pendingAssignments}
                  </Badge>
                )}
              </NavLink>
            );
          })}

          {/* Search */}
          <button
            onClick={toggleSearch}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
              "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <Search className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span>Search</span>}
            {sidebarOpen && (
              <kbd className="ml-auto hidden rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground md:block">
                ⌘K
              </kbd>
            )}
          </button>
        </nav>

        {/* User Profile & Bottom Actions - Fixed at bottom */}
        <div className="border-t border-border p-3 space-y-2 shrink-0">
          {/* User Profile / Login */}
          {!loading && (
            user ? (
              <div className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2",
                sidebarOpen ? "justify-between" : "justify-center"
              )}>
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  {sidebarOpen && (
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {profile?.display_name || user.email?.split('@')[0]}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  )}
                </div>
                {sidebarOpen && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={handleSignOut}
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                    title="Sign out"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ) : (
              <NavLink
                to="/auth"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                  "text-primary bg-primary/10 hover:bg-primary/15"
                )}
              >
                <LogIn className="h-5 w-5 shrink-0" />
                {sidebarOpen && <span>Sign In</span>}
              </NavLink>
            )
          )}

          {/* Focus Mode Toggle */}
          <div
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
              focusModeEnabled 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground"
            )}
          >
            <Moon className={cn("h-5 w-5 shrink-0", focusModeEnabled && "text-primary")} />
            {sidebarOpen && (
              <>
                <span className="flex-1">Focus Mode</span>
                <Switch 
                  checked={focusModeEnabled} 
                  onCheckedChange={toggleFocusMode}
                  aria-label="Toggle Focus Mode"
                />
              </>
            )}
            {!sidebarOpen && (
              <Switch 
                checked={focusModeEnabled} 
                onCheckedChange={toggleFocusMode}
                aria-label="Toggle Focus Mode"
                className="absolute opacity-0"
              />
            )}
          </div>

          <NavLink
            to="/app/settings"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
              "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <Settings className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span>Settings</span>}
          </NavLink>
        </div>
      </div>
    </aside>
    </>
  );
}
