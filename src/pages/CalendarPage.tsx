import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, List, Grid3X3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CalendarMonthView } from '@/components/calendar/CalendarMonthView';
import { CalendarWeekView } from '@/components/calendar/CalendarWeekView';
import { EventDetailSheet } from '@/components/calendar/EventDetailSheet';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';
import { Event, CalendarView } from '@/types';

export function CalendarPage() {
  const { calendarView, setCalendarView, setSelectedEvent, selectedEvent } = useAppStore();
  const [sheetOpen, setSheetOpen] = useState(false);
  const navigate = useNavigate();

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setSheetOpen(true);
  };

  const handleDateClick = (date: Date) => {
    // Could open a new event dialog
    console.log('Date clicked:', date);
  };

  const views: { value: CalendarView; icon: React.ComponentType<{ className?: string }> }[] = [
    { value: 'month', icon: Grid3X3 },
    { value: 'week', icon: List },
  ];

  return (
    <div className="h-screen flex flex-col">
      {/* Page Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-background/80 backdrop-blur-sm">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Calendar</h1>
          <p className="text-sm text-muted-foreground">Your class schedule and lecture notes</p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* View Switcher */}
          <div className="flex rounded-lg border border-border p-1">
            {views.map(({ value, icon: Icon }) => (
              <Button
                key={value}
                variant={calendarView === value ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setCalendarView(value)}
                className={cn(
                  "capitalize",
                  calendarView === value && "shadow-sm"
                )}
              >
                <Icon className="h-4 w-4 mr-1" />
                {value}
              </Button>
            ))}
          </div>
        </div>
      </header>

      {/* Calendar View */}
      <div className="flex-1 overflow-hidden">
        {calendarView === 'month' ? (
          <CalendarMonthView
            onEventClick={handleEventClick}
            onDateClick={handleDateClick}
          />
        ) : (
          <CalendarWeekView
            onEventClick={handleEventClick}
            onDateClick={handleDateClick}
          />
        )}
      </div>

      {/* Event Detail Sheet */}
      <EventDetailSheet
        event={selectedEvent}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  );
}

export default CalendarPage;
