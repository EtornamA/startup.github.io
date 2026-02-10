import { useState } from "react";
import { Plus, Circle, CheckCircle2, Calendar as CalendarIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format, isToday, isTomorrow, isYesterday, parseISO, startOfDay, addDays } from "date-fns";
import { useTodoistStore, TodoistTask } from "@/store/useTodoistStore";

export function TodoistDemo() {
  const { tasks: todos, addTask, toggleTask, deleteTask } = useTodoistStore();
  const [inputValue, setInputValue] = useState("");

  const parseDateFromInput = (text: string): { cleanText: string; date?: Date } => {
    const lowerText = text.toLowerCase();
    let cleanText = text;
    let date: Date | undefined;

    // Parse "today", "tomorrow", etc.
    if (lowerText.includes('today')) {
      date = startOfDay(new Date());
      cleanText = cleanText.replace(/\btoday\b/gi, '').trim();
    } else if (lowerText.includes('tomorrow')) {
      date = startOfDay(addDays(new Date(), 1));
      cleanText = cleanText.replace(/\btomorrow\b/gi, '').trim();
    }

    return { cleanText, date };
  };

  const addTodo = () => {
    if (!inputValue.trim()) return;

    const { cleanText, date } = parseDateFromInput(inputValue);

    addTask({
      text: cleanText || inputValue.trim(),
      completed: false,
      dueDate: date,
      priority: 'p4',
    });

    setInputValue("");
  };

  const toggleTodo = (id: string) => {
    toggleTask(id);
  };

  const handleDeleteTodo = (id: string) => {
    deleteTask(id);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  // Group todos by date
  const groupedTodos = todos.reduce((acc, todo: TodoistTask) => {
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
  }, {} as Record<string, TodoItem[]>);

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
    // Completed always at the end
    if (a === 'completed') return 1;
    if (b === 'completed') return -1;
    
    // No date comes after dated items
    if (a === 'no-date') return 1;
    if (b === 'no-date') return -1;
    
    // Sort dates chronologically (earliest first)
    return a.localeCompare(b);
  });

  const activeTodosCount = todos.filter(t => !t.completed).length;
  const completedTodosCount = todos.filter(t => t.completed).length;

  return (
    <Card className="w-full max-w-2xl mx-auto border-2">
      <div className="p-4 sm:p-6">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
            Try Our <span className="text-gradient">Task Manager</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Experience our Todoist-style task management. Add tasks and see them organized by day.
          </p>
        </div>

        {/* Task Input Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl sm:text-2xl font-bold">Quick Tasks</h3>
            {todos.length > 0 && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{activeTodosCount} active</span>
                {completedTodosCount > 0 && (
                  <>
                    <span>•</span>
                    <span>{completedTodosCount} completed</span>
                  </>
                )}
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Add tasks and organize your day. Try typing "today" or "tomorrow" in your task!
          </p>
          
          {/* Add Task Input */}
          <div className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a task... (try 'today' or 'tomorrow')"
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
        </div>

        {/* Todo List */}
        <div className="space-y-6">
          {todos.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Circle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">No tasks yet. Add one above to get started!</p>
            </div>
          ) : (
            sortedDateKeys.map((dateKey) => {
              const items = groupedTodos[dateKey];
              if (!items || items.length === 0) return null;

              const isCompleted = dateKey === 'completed';

              return (
                <div key={dateKey} className="space-y-2">
                  <div className="flex items-center gap-2 mb-3 pt-2 border-t border-border first:border-t-0 first:pt-0">
                    <h4 className={cn(
                      "text-xs sm:text-sm font-semibold uppercase tracking-wide",
                      isCompleted ? "text-muted-foreground" : "text-foreground"
                    )}>
                      {getDateLabel(dateKey)}
                    </h4>
                    <span className="text-xs text-muted-foreground">
                      {items.length}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    {items.map((todo) => (
                      <div
                        key={todo.id}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg transition-all group",
                          "hover:bg-secondary/50",
                          todo.completed && "opacity-60"
                        )}
                      >
                        <button
                          onClick={() => toggleTodo(todo.id)}
                          className="shrink-0 mt-0.5"
                        >
                          {todo.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                          ) : (
                            <Circle className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                          )}
                        </button>
                        
                        <span
                          className={cn(
                            "flex-1 text-sm",
                            todo.completed && "line-through text-muted-foreground"
                          )}
                        >
                          {todo.text}
                        </span>

                        {todo.dueDate && !todo.completed && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                            <CalendarIcon className="w-3 h-3" />
                            <span>
                              {isToday(todo.dueDate) ? 'Today' :
                               isTomorrow(todo.dueDate) ? 'Tomorrow' :
                               format(todo.dueDate, 'MMM d')}
                            </span>
                          </div>
                        )}

                        <button
                          onClick={() => handleDeleteTodo(todo.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-muted-foreground hover:text-destructive"
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
    </Card>
  );
}

