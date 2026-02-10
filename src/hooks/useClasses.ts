import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ClassData, SessionData, DeadlineData, ClassTodoData, ClassFormData, CLASS_COLORS } from '@/types/classes';
import { useToast } from '@/hooks/use-toast';
import { addDays, parseISO, format, isBefore, isAfter, getDay, startOfDay, setHours, setMinutes } from 'date-fns';
import { useAppStore } from '@/store/useAppStore';
import { useTodoistStore } from '@/store/useTodoistStore';
import { Event } from '@/types';
import { useAuth } from '@/hooks/useAuth';

const MOCK_USER_ID = 'john-adams-id';
const now = () => new Date().toISOString();

function getMockClasses(): ClassData[] {
  const base = { user_id: MOCK_USER_ID, timezone: 'America/New_York', section_number: null, office_hours_day: null, office_hours_time: null, office_hours_location: null, class_website: null, notes: null, syllabus_url: null, syllabus_parsed_at: null, created_at: now(), updated_at: now() };
  const classes: [string, string, string | null, number[], string, string, string, string, string][] = [
    ['Introduction to Computer Science', 'CS 101', '#14b8a6', [1, 3, 5], '09:00', '09:50', 'Room 204', '2025-08-18', '2025-12-10'],
    ['Data Structures', 'CS 201', '#8b5cf6', [1, 3], '11:00', '12:15', 'Room 105', '2025-08-18', '2025-12-10'],
    ['Calculus II', 'MATH 232', '#f59e0b', [2, 4], '10:10', '11:00', 'Room 301', '2025-08-18', '2025-12-10'],
    ['Principles of Economics', 'ECON 101', '#22c55e', [1, 3, 5], '14:00', '14:50', 'Room 120', '2025-08-18', '2025-12-10'],
    ['Writing and Rhetoric', 'ENGL 105', '#ec4899', [2, 4], '12:30', '13:45', 'Room 408', '2025-08-18', '2025-12-10'],
    ['General Chemistry', 'CHEM 101', '#6366f1', [1, 3], '08:00', '09:15', 'Lab 2', '2025-08-18', '2025-12-10'],
    ['Introduction to Psychology', 'PSYC 101', '#3b82f6', [2, 4], '15:30', '16:45', 'Room 210', '2025-08-18', '2025-12-10'],
  ];
  return classes.map(([name, code, color, meeting_days, start_time, end_time, location, semester_start, semester_end], i) => ({
    ...base,
    id: `mock-class-${i + 1}`,
    name,
    code,
    color: color || CLASS_COLORS[i % CLASS_COLORS.length],
    professor_name: 'Professor Smith',
    professor_email: null,
    meeting_days,
    start_time,
    end_time,
    location,
    semester_start,
    semester_end,
  }));
}

export function useClasses() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Fetch all classes (mock for John Adams, otherwise Supabase)
  const classesQuery = useQuery({
    queryKey: ['classes', user?.id],
    queryFn: async () => {
      if (user?.id === MOCK_USER_ID) {
        return getMockClasses();
      }
      const { data: { user: sbUser } } = await supabase.auth.getUser();
      if (!sbUser) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('user_id', sbUser.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ClassData[];
    },
    enabled: !!user,
  });

  // Generate sessions for a class based on meeting schedule
  const generateSessions = (
    classId: string,
    userId: string,
    meetingDays: number[],
    startTime: string,
    endTime: string,
    location: string,
    semesterStart: string,
    semesterEnd: string
  ): Omit<SessionData, 'id' | 'created_at' | 'updated_at'>[] => {
    const sessions: Omit<SessionData, 'id' | 'created_at' | 'updated_at'>[] = [];
    const start = parseISO(semesterStart);
    const end = parseISO(semesterEnd);
    
    let currentDate = start;
    while (isBefore(currentDate, end) || format(currentDate, 'yyyy-MM-dd') === format(end, 'yyyy-MM-dd')) {
      const dayOfWeek = getDay(currentDate);
      if (meetingDays.includes(dayOfWeek)) {
        sessions.push({
          class_id: classId,
          user_id: userId,
          session_date: format(currentDate, 'yyyy-MM-dd'),
          start_time: startTime,
          end_time: endTime,
          location,
          topics: [],
          attendance: 'pending',
          notes: null,
          calendar_event_id: null,
        });
      }
      currentDate = addDays(currentDate, 1);
    }
    
    return sessions;
  };

  // Create class mutation
  const createClassMutation = useMutation({
    mutationFn: async (formData: ClassFormData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Create the class
      const { data: newClass, error: classError } = await supabase
        .from('classes')
        .insert({
          user_id: user.id,
          name: formData.name,
          code: formData.code || null,
          professor_name: formData.professor_name,
          professor_email: formData.professor_email || null,
          color: formData.color,
          meeting_days: formData.meeting_days,
          start_time: formData.start_time,
          end_time: formData.end_time,
          location: formData.location,
          timezone: formData.timezone,
          semester_start: formData.semester_start,
          semester_end: formData.semester_end,
          section_number: formData.section_number || null,
          office_hours_day: formData.office_hours_day || null,
          office_hours_time: formData.office_hours_time || null,
          office_hours_location: formData.office_hours_location || null,
          class_website: formData.class_website || null,
          notes: formData.notes || null,
        })
        .select()
        .single();

      if (classError) throw classError;

      // Generate and insert sessions
      const sessions = generateSessions(
        newClass.id,
        user.id,
        formData.meeting_days,
        formData.start_time,
        formData.end_time,
        formData.location,
        formData.semester_start,
        formData.semester_end
      );

      if (sessions.length > 0) {
        const { error: sessionsError } = await supabase
          .from('sessions')
          .insert(sessions);

        if (sessionsError) {
          console.error('Error creating sessions:', sessionsError);
        }
      }

      return newClass as ClassData;
    },
    onSuccess: (newClass, formData) => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      
      // Add events to calendar
      const { addEvent } = useAppStore.getState();
      const { addTask } = useTodoistStore.getState();
      
      // Generate calendar events for the first few weeks
      const semesterStart = parseISO(formData.semester_start);
      const semesterEnd = parseISO(formData.semester_end);
      const classCode = formData.code || formData.name;
      const sectionText = formData.section_number ? ` Section ${formData.section_number}` : '';
      
      // Add calendar events for next 4 weeks
      const semesterStartDay = getDay(semesterStart);
      for (let week = 0; week < 4; week++) {
        formData.meeting_days.forEach((day) => {
          // Calculate the date for this meeting day in this week
          let daysToAdd = (day - semesterStartDay + 7) % 7;
          if (daysToAdd === 0 && day !== semesterStartDay) {
            daysToAdd = 7;
          }
          const eventDate = addDays(semesterStart, week * 7 + daysToAdd);
          
          if (eventDate <= semesterEnd && eventDate >= startOfDay(new Date())) {
            // Add to calendar
            const calendarEvent: Event = {
              id: `class-${newClass.id}-${eventDate.getTime()}`,
              classId: newClass.id,
              userId: 'user-1',
              title: `${classCode}${sectionText}`,
              date: eventDate,
              startTime: formData.start_time,
              endTime: formData.end_time,
              type: 'lecture',
              location: formData.location,
              notes: [],
              createdAt: new Date(),
            };
            addEvent(calendarEvent);
            
            // Add to Todoist for upcoming classes (next 2 weeks)
            if (week < 2 && eventDate <= addDays(startOfDay(new Date()), 14)) {
              addTask({
                text: `Attend ${classCode}${sectionText} - ${formData.location}`,
                completed: false,
                dueDate: startOfDay(eventDate),
                priority: 'p2',
                source: newClass.id,
              });
            }
          }
        });
      }
      
      toast({ 
        title: 'Class created', 
        description: 'Your class has been added to calendar and tasks.' 
      });
    },
    onError: (error) => {
      toast({ 
        title: 'Failed to create class', 
        description: error.message, 
        variant: 'destructive' 
      });
    },
  });

  // Update class mutation
  const updateClassMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ClassData> & { id: string }) => {
      const { data, error } = await supabase
        .from('classes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as ClassData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      toast({ title: 'Class updated' });
    },
    onError: (error) => {
      toast({ 
        title: 'Failed to update class', 
        description: error.message, 
        variant: 'destructive' 
      });
    },
  });

  // Delete class mutation
  const deleteClassMutation = useMutation({
    mutationFn: async (classId: string) => {
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', classId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['deadlines'] });
      toast({ title: 'Class deleted' });
    },
    onError: (error) => {
      toast({ 
        title: 'Failed to delete class', 
        description: error.message, 
        variant: 'destructive' 
      });
    },
  });

  return {
    classes: classesQuery.data ?? [],
    isLoading: classesQuery.isLoading,
    error: classesQuery.error,
    createClass: createClassMutation.mutate,
    updateClass: updateClassMutation.mutate,
    deleteClass: deleteClassMutation.mutate,
    isCreating: createClassMutation.isPending,
    isUpdating: updateClassMutation.isPending,
    isDeleting: deleteClassMutation.isPending,
  };
}

// Hook for single class with all related data
export function useClassDetail(classId: string | undefined) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const isMockClassId = classId?.startsWith('mock-class-') ?? false;

  // Fetch class (mock or Supabase)
  const classQuery = useQuery({
    queryKey: ['class', classId],
    queryFn: async () => {
      if (!classId) return null;
      if (isMockClassId) {
        const mockClasses = getMockClasses();
        return mockClasses.find((c) => c.id === classId) ?? null;
      }
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('id', classId)
        .maybeSingle();

      if (error) throw error;
      return data as ClassData | null;
    },
    enabled: !!classId,
  });

  // Fetch sessions (empty for mock classes)
  const sessionsQuery = useQuery({
    queryKey: ['sessions', classId],
    queryFn: async () => {
      if (!classId) return [];
      if (isMockClassId) return [];
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('class_id', classId)
        .order('session_date', { ascending: true });

      if (error) throw error;
      return data as SessionData[];
    },
    enabled: !!classId,
  });

  // Fetch deadlines (empty for mock classes)
  const deadlinesQuery = useQuery({
    queryKey: ['deadlines', classId],
    queryFn: async () => {
      if (!classId) return [];
      if (isMockClassId) return [];
      const { data, error } = await supabase
        .from('deadlines')
        .select('*')
        .eq('class_id', classId)
        .order('due_date', { ascending: true });

      if (error) throw error;
      return data as DeadlineData[];
    },
    enabled: !!classId,
  });

  // Fetch class todos (empty for mock classes)
  const todosQuery = useQuery({
    queryKey: ['class-todos', classId],
    queryFn: async () => {
      if (!classId) return [];
      if (isMockClassId) return [];
      const { data, error } = await supabase
        .from('class_todos')
        .select('*')
        .eq('class_id', classId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ClassTodoData[];
    },
    enabled: !!classId,
  });

  // Fetch notes for this class (empty for mock classes)
  const notesQuery = useQuery({
    queryKey: ['class-notes', classId],
    queryFn: async () => {
      if (!classId) return [];
      if (isMockClassId) return [];
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('class_id', classId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!classId,
  });

  // Add deadline mutation
  const addDeadlineMutation = useMutation({
    mutationFn: async (deadline: Omit<DeadlineData, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('deadlines')
        .insert(deadline)
        .select()
        .single();

      if (error) throw error;
      return data as DeadlineData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deadlines', classId] });
      toast({ title: 'Deadline added' });
    },
  });

  // Update deadline status mutation
  const updateDeadlineMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<DeadlineData> & { id: string }) => {
      const { data, error } = await supabase
        .from('deadlines')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as DeadlineData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deadlines', classId] });
    },
  });

  // Add todo mutation
  const addTodoMutation = useMutation({
    mutationFn: async (todo: Omit<ClassTodoData, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('class_todos')
        .insert(todo)
        .select()
        .single();

      if (error) throw error;
      return data as ClassTodoData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['class-todos', classId] });
      toast({ title: 'To-do added' });
    },
  });

  // Update todo mutation
  const updateTodoMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ClassTodoData> & { id: string }) => {
      const { data, error } = await supabase
        .from('class_todos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as ClassTodoData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['class-todos', classId] });
    },
  });

  return {
    classData: classQuery.data,
    sessions: sessionsQuery.data ?? [],
    deadlines: deadlinesQuery.data ?? [],
    todos: todosQuery.data ?? [],
    notes: notesQuery.data ?? [],
    isLoading: classQuery.isLoading || sessionsQuery.isLoading || deadlinesQuery.isLoading,
    addDeadline: addDeadlineMutation.mutate,
    updateDeadline: updateDeadlineMutation.mutate,
    addTodo: addTodoMutation.mutate,
    updateTodo: updateTodoMutation.mutate,
  };
}
