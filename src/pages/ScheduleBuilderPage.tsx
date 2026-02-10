import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Circle,
  CheckCircle2,
  Calendar as CalendarIcon,
  X,
  CalendarPlus,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  format,
  isToday,
  isTomorrow,
  isYesterday,
  parseISO,
  startOfDay,
  addDays,
  setMonth,
  setDate,
  setYear,
  nextMonday,
  nextTuesday,
  nextWednesday,
  nextThursday,
  nextFriday,
  nextSaturday,
  nextSunday,
} from 'date-fns';
import { useTodoistStore, TodoistTask } from '@/store/useTodoistStore';
import { useAppStore } from '@/store/useAppStore';
import { Event } from '@/types';
import { useToast } from '@/hooks/use-toast';

const MONTH_NAMES: Record<string, number> = {
  january: 0, jan: 0, february: 1, feb: 1, march: 2, mar: 2, april: 3, apr: 3,
  may: 4, june: 5, jun: 5, july: 6, jul: 6, august: 7, aug: 7,
  september: 8, sept: 8, sep: 8, october: 9, oct: 9, november: 10, nov: 10,
  december: 11, dec: 11,
};
const WEEKDAYS: Record<string, () => Date> = {
  sunday: nextSunday, sun: nextSunday, monday: nextMonday, mon: nextMonday,
  tuesday: nextTuesday, tue: nextTuesday, tues: nextTuesday, wednesday: nextWednesday, wed: nextWednesday,
  thursday: nextThursday, thu: nextThursday, thur: nextThursday, fri: nextFriday, friday: nextFriday,
  saturday: nextSaturday, sat: nextSaturday,
};

type DateDetection = { date: Date; datePhrase: string };

function detectDateInText(text: string): DateDetection | null {
  const now = new Date();
  const lower = text.toLowerCase().trim();
  if (!lower) return null;

  const todayPhrase = /\b(today)\b/i;
  const tomorrowPhrase = /\b(tomorrow|tmr)\b/i;
  const nextWeekdayPhrase = /\bnext\s+(sunday|monday|tuesday|wednesday|thursday|friday|saturday|sun|mon|tue|tues|wed|thu|thur|fri|sat)\b/i;
  const onMonthDayPhrase = /\b(?:on\s+)?(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|sept|oct|nov|dec)\s+(\d{1,2})(?:st|nd|rd|th)?(?:\s+(\d{4}))?\b/i;
  const monthDayOnlyPhrase = /\b(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|sept|oct|nov|dec)\s+(\d{1,2})(?:st|nd|rd|th)?(?:\s+(\d{4}))?\b/i;

  let m = text.match(todayPhrase);
  if (m) return { date: startOfDay(now), datePhrase: m[1] };

  m = text.match(tomorrowPhrase);
  if (m) return { date: startOfDay(addDays(now, 1)), datePhrase: m[1] };

  m = text.match(nextWeekdayPhrase);
  if (m) {
    const dayName = m[1].toLowerCase();
    const fn = WEEKDAYS[dayName];
    if (fn) return { date: startOfDay(fn(now)), datePhrase: m[0] };
  }

  m = text.match(onMonthDayPhrase) || text.match(monthDayOnlyPhrase);
  if (m) {
    const monthStr = m[1].toLowerCase();
    const month = MONTH_NAMES[monthStr];
    if (month !== undefined) {
      const day = parseInt(m[2], 10);
      const year = m[3] ? parseInt(m[3], 10) : now.getFullYear();
      const d = setYear(setMonth(setDate(now, day), month), year);
      if (!isNaN(d.getTime())) return { date: startOfDay(d), datePhrase: m[0] };
    }
  }

  return null;
}

function parseDateFromInput(text: string): { cleanText: string; date?: Date; datePhrase?: string } {
  const detected = detectDateInText(text);
  if (!detected) return { cleanText: text.trim() };

  const cleanText = text
    .replace(detected.datePhrase, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return { cleanText: cleanText || text.trim(), date: detected.date, datePhrase: detected.datePhrase };
}

export function ScheduleBuilderPage() {
  const { tasks: todos, addTask, toggleTask, deleteTask } = useTodoistStore();
  const addEvent = useAppStore((s) => s.addEvent);
  const setCurrentDate = useAppStore((s) => s.setCurrentDate);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');

  const detectedPreview = inputValue.trim() ? detectDateInText(inputValue) : null;

  const addTodo = () => {
    if (!inputValue.trim()) return;

    const { cleanText, date } = parseDateFromInput(inputValue);

    addTask({
      text: cleanText || inputValue.trim(),
      completed: false,
      dueDate: date,
      priority: 'p4',
    });

    setInputValue('');
  };

  const renderPreviewWithHighlight = () => {
    if (!detectedPreview || !inputValue.trim()) return null;
    const { date, datePhrase } = detectedPreview;
    const lowerInput = inputValue.toLowerCase();
    const idx = lowerInput.indexOf(datePhrase.toLowerCase());
    if (idx === -1) return null;
    const before = inputValue.slice(0, idx);
    const phrase = inputValue.slice(idx, idx + datePhrase.length);
    const after = inputValue.slice(idx + datePhrase.length);
    const dateLabel = isToday(date) ? 'Today' : isTomorrow(date) ? 'Tomorrow' : format(date, 'EEE, MMM d');
    return (
      <div className="mt-2 flex flex-wrap items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-sm">
        <span className="text-muted-foreground">Task:</span>
        <span>
          {before}
          <span className="rounded bg-primary/20 px-1 font-medium text-primary">{phrase}</span>
          {after}
        </span>
        <span className="ml-auto shrink-0 text-xs text-primary font-medium">→ {dateLabel}</span>
      </div>
    );
  };

  const handleAddToCalendar = (task: TodoistTask) => {
    if (!task.dueDate) {
      toast({
        title: 'Add a date first',
        description: 'Set a due date (e.g. "today" or "tomorrow") then add to calendar.',
        variant: 'destructive',
      });
      return;
    }

    const eventDate = task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate);

    const event: Event = {
      id: `schedule-${task.id}`,
      classId: 'schedule-builder',
      userId: 'user-1',
      title: task.text,
      date: eventDate,
      startTime: '10:00',
      endTime: '11:00',
      type: 'study-session',
      notes: [],
      createdAt: new Date(),
    };

    addEvent(event);
    setCurrentDate(eventDate);
    toast({
      title: 'Added to calendar',
      description: `"${task.text}" is on your calendar.`,
    });
    navigate('/app/calendar');
  };

  const groupedTodos = todos.reduce(
    (acc, todo: TodoistTask) => {
      if (todo.completed) {
        const key = 'completed';
        if (!acc[key]) acc[key] = [];
        acc[key].push(todo);
        return acc;
      }

      if (!todo.dueDate) {
        const key = 'no-date';
        if (!acc[key]) acc[key] = [];
        acc[key].push(todo);
        return acc;
      }

      const dateKey = format(startOfDay(todo.dueDate), 'yyyy-MM-dd');
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(todo);
      return acc;
    },
    {} as Record<string, TodoistTask[]>
  );

  const getDateLabel = (dateKey: string) => {
    if (dateKey === 'completed') return 'Completed';
    if (dateKey === 'no-date') return 'No date';

    const date = parseISO(dateKey);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'EEEE, MMM d');
  };

  const sortedDateKeys = Object.keys(groupedTodos).sort((a, b) => {
    if (a === 'completed') return 1;
    if (b === 'completed') return -1;
    if (a === 'no-date') return 1;
    if (b === 'no-date') return -1;
    return a.localeCompare(b);
  });

  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Schedule Builder</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Tasks that link to your calendar. Add a due date and send to Calendar.
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/app/calendar" className="gap-2">
            <CalendarIcon className="h-4 w-4" />
            View in Calendar
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Task input */}
      <div className="space-y-0">
        <div className="relative flex gap-2">
          <div className="relative flex-1">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTodo()}
              placeholder="e.g. I want to eat tomorrow · Buy groceries on March 12 · Call mom next Monday"
              className="pr-10"
            />
            <Button
              onClick={addTodo}
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              variant="ghost"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {renderPreviewWithHighlight()}
      </div>

      {todos.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {activeCount} active
          {completedCount > 0 && ` · ${completedCount} completed`}
        </p>
      )}

      {/* Grouped list */}
      <div className="space-y-6">
        {todos.length === 0 ? (
          <div className="text-center py-16 rounded-xl border-2 border-dashed border-muted-foreground/25 text-muted-foreground">
            <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm font-medium">No tasks yet</p>
            <p className="text-xs mt-1">Add tasks with dates like &quot;today&quot; or &quot;tomorrow&quot;, then add them to your calendar.</p>
          </div>
        ) : (
          sortedDateKeys.map((dateKey) => {
            const items = groupedTodos[dateKey];
            if (!items?.length) return null;

            const isCompleted = dateKey === 'completed';

            return (
              <div key={dateKey} className="space-y-2">
                <div className="flex items-center gap-2 mb-3 pt-2 border-t border-border first:border-t-0 first:pt-0">
                  <h2
                    className={cn(
                      'text-sm font-semibold uppercase tracking-wide',
                      isCompleted ? 'text-muted-foreground' : 'text-foreground'
                    )}
                  >
                    {getDateLabel(dateKey)}
                  </h2>
                  <span className="text-xs text-muted-foreground">{items.length}</span>
                </div>

                <div className="space-y-1">
                  {items.map((todo) => (
                    <div
                      key={todo.id}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-xl border border-transparent transition-all group hover:bg-muted/50',
                        todo.completed && 'opacity-60'
                      )}
                    >
                      <button
                        onClick={() => toggleTask(todo.id)}
                        className="shrink-0 mt-0.5"
                        aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
                      >
                        {todo.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                        )}
                      </button>

                      <span
                        className={cn(
                          'flex-1 text-sm',
                          todo.completed && 'line-through text-muted-foreground'
                        )}
                      >
                        {todo.text}
                      </span>

                      {todo.dueDate && !todo.completed && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                          <CalendarIcon className="w-3 h-3" />
                          <span>
                            {isToday(todo.dueDate)
                              ? 'Today'
                              : isTomorrow(todo.dueDate)
                                ? 'Tomorrow'
                                : format(todo.dueDate, 'MMM d')}
                          </span>
                        </div>
                      )}

                      {!todo.completed && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 shrink-0 h-8 px-2 text-xs"
                          onClick={() => handleAddToCalendar(todo)}
                        >
                          <CalendarPlus className="w-4 h-4 mr-1" />
                          Add to calendar
                        </Button>
                      )}

                      <button
                        onClick={() => deleteTask(todo.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-muted-foreground hover:text-destructive p-1"
                        aria-label="Delete task"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default ScheduleBuilderPage;
