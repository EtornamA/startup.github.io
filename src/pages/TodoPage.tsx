import React, { useState } from 'react';
import { format } from 'date-fns';
import { 
  Plus, 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertTriangle,
  Calendar,
  MoreHorizontal,
  Filter,
  ChevronDown,
  Sparkles,
  Loader2,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';
import { Assignment } from '@/types';
import { useExtractedTodos } from '@/hooks/useExtractedTodos';
import { ExtractedTodoCard } from '@/components/todo/ExtractedTodoCard';
import { CreateTaskDialog } from '@/components/tasks/CreateTaskDialog';
import { useClasses } from '@/hooks/useClasses';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function TodoPage() {
  const { assignments, classes: mockClasses, updateAssignment } = useAppStore();
  const { classes: dbClasses } = useClasses();
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const { 
    todos: extractedTodos, 
    isLoading: isLoadingExtracted, 
    updateTodoStatus, 
    deleteTodo 
  } = useExtractedTodos();

  // Fetch class todos from database
  const { data: classTodos = [], isLoading: isLoadingClassTodos } = useQuery({
    queryKey: ['all-class-todos'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data } = await supabase
        .from('class_todos')
        .select('*, classes(name, code, color)')
        .eq('user_id', user.id)
        .order('due_date', { ascending: true });
      return data || [];
    },
  });

  const todoItems = assignments.filter(a => a.status === 'todo');
  const inProgressItems = assignments.filter(a => a.status === 'in-progress');
  const completedItems = assignments.filter(a => a.status === 'completed');

  // Class todos by status
  const classTodoItems = classTodos.filter((t: any) => t.status === 'todo');
  const classInProgressItems = classTodos.filter((t: any) => t.status === 'in-progress');
  const classCompletedItems = classTodos.filter((t: any) => t.status === 'completed');

  // Combine extracted todos with assignments for filtering
  const extractedTodoItems = extractedTodos.filter(t => t.status === 'todo');
  const extractedInProgressItems = extractedTodos.filter(t => t.status === 'in-progress');
  const extractedCompletedItems = extractedTodos.filter(t => t.status === 'completed');

  const getClassById = (classId: string) => mockClasses.find(c => c.id === classId);

  const handleStatusChange = (assignmentId: string, newStatus: Assignment['status']) => {
    updateAssignment(assignmentId, { status: newStatus });
  };

  const handleClassTodoStatusChange = async (todoId: string, newStatus: string) => {
    await supabase
      .from('class_todos')
      .update({ status: newStatus })
      .eq('id', todoId);
  };

  const getPriorityColor = (priority: Assignment['priority']) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
    }
  };

  const getDaysUntilDue = (dueDate: Date | string) => {
    const now = new Date();
    const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
    const diff = due.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const AssignmentCard = ({ assignment }: { assignment: Assignment }) => {
    const classData = getClassById(assignment.classId);
    const daysUntilDue = getDaysUntilDue(assignment.dueDate);
    const isOverdue = daysUntilDue < 0;
    const isDueSoon = daysUntilDue >= 0 && daysUntilDue <= 2;

    return (
      <Card 
        variant="interactive"
        className="group"
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <button
              onClick={() => handleStatusChange(
                assignment.id, 
                assignment.status === 'completed' ? 'todo' : 'completed'
              )}
              className="mt-0.5 shrink-0"
            >
              {assignment.status === 'completed' ? (
                <CheckCircle2 className="h-5 w-5 text-success" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
              )}
            </button>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h4 className={cn(
                  "font-medium text-foreground",
                  assignment.status === 'completed' && "line-through text-muted-foreground"
                )}>
                  {assignment.title}
                </h4>
                <Button variant="ghost" size="icon-sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              
              {assignment.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {assignment.description}
                </p>
              )}
              
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <Badge 
                  variant="class"
                  style={{
                    backgroundColor: `${classData?.color}20`,
                    borderColor: `${classData?.color}50`,
                    color: classData?.color
                  }}
                >
                  {classData?.code}
                </Badge>
                
                <Badge variant={getPriorityColor(assignment.priority)}>
                  {assignment.priority}
                </Badge>
                
                <div className={cn(
                  "flex items-center gap-1 text-xs",
                  isOverdue ? "text-destructive" : isDueSoon ? "text-warning" : "text-muted-foreground"
                )}>
                  {isOverdue ? (
                    <AlertTriangle className="h-3 w-3" />
                  ) : (
                    <Clock className="h-3 w-3" />
                  )}
                  <span>
                    {isOverdue 
                      ? `${Math.abs(daysUntilDue)} days overdue`
                      : daysUntilDue === 0 
                        ? 'Due today'
                        : daysUntilDue === 1
                          ? 'Due tomorrow'
                          : `Due in ${daysUntilDue} days`
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Class Todo Card Component
  const ClassTodoCard = ({ todo }: { todo: any }) => {
    const classInfo = todo.classes;
    const daysUntilDue = todo.due_date ? getDaysUntilDue(todo.due_date) : null;
    const isOverdue = daysUntilDue !== null && daysUntilDue < 0;
    const isDueSoon = daysUntilDue !== null && daysUntilDue >= 0 && daysUntilDue <= 2;

    return (
      <Card variant="interactive" className="group">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <button
              onClick={() => handleClassTodoStatusChange(
                todo.id, 
                todo.status === 'completed' ? 'todo' : 'completed'
              )}
              className="mt-0.5 shrink-0"
            >
              {todo.status === 'completed' ? (
                <CheckCircle2 className="h-5 w-5 text-success" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
              )}
            </button>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h4 className={cn(
                  "font-medium text-foreground",
                  todo.status === 'completed' && "line-through text-muted-foreground"
                )}>
                  {todo.title}
                </h4>
                <Button variant="ghost" size="icon-sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              
              {todo.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {todo.description}
                </p>
              )}
              
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                {classInfo && (
                  <Badge 
                    variant="class"
                    style={{
                      backgroundColor: `${classInfo.color}20`,
                      borderColor: `${classInfo.color}50`,
                      color: classInfo.color
                    }}
                  >
                    <BookOpen className="h-3 w-3 mr-1" />
                    {classInfo.code || classInfo.name}
                  </Badge>
                )}
                
                <Badge variant={getPriorityColor(todo.priority)}>
                  {todo.priority}
                </Badge>
                
                {daysUntilDue !== null && (
                  <div className={cn(
                    "flex items-center gap-1 text-xs",
                    isOverdue ? "text-destructive" : isDueSoon ? "text-warning" : "text-muted-foreground"
                  )}>
                    {isOverdue ? (
                      <AlertTriangle className="h-3 w-3" />
                    ) : (
                      <Clock className="h-3 w-3" />
                    )}
                    <span>
                      {isOverdue 
                        ? `${Math.abs(daysUntilDue)} days overdue`
                        : daysUntilDue === 0 
                          ? 'Due today'
                          : daysUntilDue === 1
                            ? 'Due tomorrow'
                            : `Due in ${daysUntilDue} days`
                      }
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const Column = ({ 
    title, 
    items, 
    classTodoItems,
    icon: Icon,
    iconColor 
  }: { 
    title: string; 
    items: Assignment[]; 
    classTodoItems: any[];
    icon: React.ComponentType<{ className?: string }>;
    iconColor: string;
  }) => (
    <div className="flex-1 min-w-[300px]">
      <div className="flex items-center gap-2 mb-4">
        <div className={cn("p-1.5 rounded-lg", iconColor)}>
          <Icon className="h-4 w-4" />
        </div>
        <h3 className="font-semibold text-foreground">{title}</h3>
        <Badge variant="secondary" className="ml-auto">
          {items.length + classTodoItems.length}
        </Badge>
      </div>
      <div className="space-y-3">
        {/* Class Todos */}
        {classTodoItems.map((todo) => (
          <ClassTodoCard key={todo.id} todo={todo} />
        ))}
        {/* Legacy Assignment items */}
        {items.map((item) => (
          <AssignmentCard key={item.id} assignment={item} />
        ))}
        {items.length === 0 && classTodoItems.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground">No items</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">To-Do & Assignments</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track your assignments and tasks across all classes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="glow" onClick={() => setCreateTaskOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">
            All Tasks
            {(classTodos.length > 0 || assignments.length > 0) && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {classTodos.length + assignments.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="ai-extracted" className="gap-2">
            <Sparkles className="h-3.5 w-3.5" />
            AI Extracted
            {extractedTodos.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {extractedTodos.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {isLoadingClassTodos ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            /* Kanban-style columns */
            <div className="flex gap-6 overflow-x-auto pb-4">
              <Column 
                title="To Do" 
                items={todoItems} 
                classTodoItems={classTodoItems}
                icon={Circle}
                iconColor="bg-secondary text-secondary-foreground"
              />
              <Column 
                title="In Progress" 
                items={inProgressItems} 
                classTodoItems={classInProgressItems}
                icon={Clock}
                iconColor="bg-warning/20 text-warning"
              />
              <Column 
                title="Completed" 
                items={completedItems} 
                classTodoItems={classCompletedItems}
                icon={CheckCircle2}
                iconColor="bg-success/20 text-success"
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="ai-extracted">
          {isLoadingExtracted ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : extractedTodos.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="p-12 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No AI-extracted to-dos yet
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Record notes during your lectures and our AI will automatically 
                  extract to-dos, assignments, and action items for you.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="flex gap-6 overflow-x-auto pb-4">
              {/* AI Extracted To Do */}
              <div className="flex-1 min-w-[300px]">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 rounded-lg bg-secondary text-secondary-foreground">
                    <Circle className="h-4 w-4" />
                  </div>
                  <h3 className="font-semibold text-foreground">To Do</h3>
                  <Badge variant="secondary" className="ml-auto">
                    {extractedTodoItems.length}
                  </Badge>
                </div>
                <div className="space-y-3">
                  {extractedTodoItems.map((todo) => (
                    <ExtractedTodoCard 
                      key={todo.id} 
                      todo={todo}
                      onStatusChange={updateTodoStatus}
                      onDelete={deleteTodo}
                    />
                  ))}
                  {extractedTodoItems.length === 0 && (
                    <Card className="border-dashed">
                      <CardContent className="p-6 text-center">
                        <p className="text-sm text-muted-foreground">No items</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              {/* AI Extracted In Progress */}
              <div className="flex-1 min-w-[300px]">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 rounded-lg bg-warning/20 text-warning">
                    <Clock className="h-4 w-4" />
                  </div>
                  <h3 className="font-semibold text-foreground">In Progress</h3>
                  <Badge variant="secondary" className="ml-auto">
                    {extractedInProgressItems.length}
                  </Badge>
                </div>
                <div className="space-y-3">
                  {extractedInProgressItems.map((todo) => (
                    <ExtractedTodoCard 
                      key={todo.id} 
                      todo={todo}
                      onStatusChange={updateTodoStatus}
                      onDelete={deleteTodo}
                    />
                  ))}
                  {extractedInProgressItems.length === 0 && (
                    <Card className="border-dashed">
                      <CardContent className="p-6 text-center">
                        <p className="text-sm text-muted-foreground">No items</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              {/* AI Extracted Completed */}
              <div className="flex-1 min-w-[300px]">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 rounded-lg bg-success/20 text-success">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <h3 className="font-semibold text-foreground">Completed</h3>
                  <Badge variant="secondary" className="ml-auto">
                    {extractedCompletedItems.length}
                  </Badge>
                </div>
                <div className="space-y-3">
                  {extractedCompletedItems.map((todo) => (
                    <ExtractedTodoCard 
                      key={todo.id} 
                      todo={todo}
                      onStatusChange={updateTodoStatus}
                      onDelete={deleteTodo}
                    />
                  ))}
                  {extractedCompletedItems.length === 0 && (
                    <Card className="border-dashed">
                      <CardContent className="p-6 text-center">
                        <p className="text-sm text-muted-foreground">No items</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Task Dialog */}
      <CreateTaskDialog 
        open={createTaskOpen} 
        onOpenChange={setCreateTaskOpen} 
      />
    </div>
  );
}

export default TodoPage;