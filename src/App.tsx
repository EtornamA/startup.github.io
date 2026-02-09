import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import CalendarPage from "@/pages/CalendarPage";
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
    : '/';
  
  // If home is already '/', render CalendarPage directly
  if (homePage === '/') {
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
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomeRedirect />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/todo" element={<TodoPage />} />
            <Route path="/notebook" element={<NotebookPage />} />
            <Route path="/recap" element={<RecapPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
