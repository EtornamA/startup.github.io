import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import LandingPage from "@/pages/LandingPage";
import CalendarPage from "@/pages/CalendarPage";
import ScheduleBuilderPage from "@/pages/ScheduleBuilderPage";
import ClassesPage from "@/pages/ClassesPage";
import TodoPage from "@/pages/TodoPage";
import NotebookPage from "@/pages/NotebookPage";
import RecapPage from "@/pages/RecapPage";
import SettingsPage from "@/pages/SettingsPage";
import AuthPage from "@/pages/AuthPage";
import NotFound from "@/pages/NotFound";
import { homePageOptions, HomePageOption } from "@/hooks/useHomePagePreference";

const queryClient = new QueryClient();

function ThemeInitializer() {
  useEffect(() => {
    const stored = localStorage.getItem('focus-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = stored || (prefersDark ? 'dark' : 'light');
    
    document.documentElement.classList.add(theme);
    if (theme === 'dark') {
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);
  
  return null;
}

function HomeRedirect() {
  const stored = localStorage.getItem('focus-home-page') as HomePageOption | null;
  const homePage = stored && homePageOptions.some(opt => opt.value === stored) 
    ? stored 
    : '/app';
  
  // If home is already '/app', render CalendarPage directly
  if (homePage === '/app') {
    return <CalendarPage />;
  }
  
  return <Navigate to={homePage} replace />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeInitializer />
      <Toaster />
      <Sonner />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route element={<MainLayout />}>
            <Route path="/app" element={<HomeRedirect />} />
            <Route path="/app/calendar" element={<CalendarPage />} />
            <Route path="/app/schedule-builder" element={<ScheduleBuilderPage />} />
            <Route path="/app/classes" element={<ClassesPage />} />
            <Route path="/app/classes/:classId" element={<ClassesPage />} />
            <Route path="/app/todo" element={<TodoPage />} />
            <Route path="/app/notebook" element={<NotebookPage />} />
            <Route path="/app/recap" element={<RecapPage />} />
            <Route path="/app/settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
