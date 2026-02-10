import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useClasses, useClassDetail } from '@/hooks/useClasses';
import { AddClassDialog } from '@/components/classes/AddClassDialog';
import { ImportSyllabusDialog } from '@/components/classes/ImportSyllabusDialog';
import { ClassCard } from '@/components/classes/ClassCard';
import { ClassDetailPage } from '@/components/classes/ClassDetailPage';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { SessionData, DeadlineData } from '@/types/classes';

export function ClassesPage() {
  const { classId } = useParams<{ classId: string }>();
  const { classes, isLoading, deleteClass } = useClasses();
  const [addClassOpen, setAddClassOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [droppedFile, setDroppedFile] = useState<File | null>(null);

  // Fetch sessions and deadlines for all classes
  const { data: allSessions = [] } = useQuery({
    queryKey: ['all-sessions'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', user.id);
      return data || [];
    },
  });

  const { data: allDeadlines = [] } = useQuery({
    queryKey: ['all-deadlines'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data } = await supabase
        .from('deadlines')
        .select('*')
        .eq('user_id', user.id);
      return data || [];
    },
  });

  const { data: allNotes = [] } = useQuery({
    queryKey: ['all-notes'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id);
      return data || [];
    },
  });

  // If viewing a specific class, show the detail page
  if (classId) {
    return <ClassDetailPage />;
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Classes</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your classes and access all related materials
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setImportOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Import Syllabus
          </Button>
          <Button variant="glow" onClick={() => setAddClassOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Class
          </Button>
        </div>
      </div>

      {/* Classes Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-[280px] animate-pulse bg-secondary/50" />
          ))}
        </div>
      ) : classes.length === 0 ? (
        /* Empty state: drop zone for syllabi */
        <Card
          className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 cursor-pointer min-h-[320px] flex flex-col items-center justify-center"
          onClick={() => setImportOpen(true)}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file && (file.type === 'application/pdf' || file.type.startsWith('image/'))) {
              setDroppedFile(file);
              setImportOpen(true);
            }
          }}
          onDragOver={(e) => e.preventDefault()}
        >
          <CardContent className="flex flex-col items-center justify-center py-16 px-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Drop a Syllabus to Start</h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-6">
              Upload a PDF or screenshot of your syllabus and we&apos;ll create your class and assignments automatically.
            </p>
            <Button variant="outline" onClick={(e) => { e.stopPropagation(); setImportOpen(true); }}>
              <Upload className="h-4 w-4 mr-2" />
              Choose file instead
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <ClassCard
              key={cls.id}
              classData={cls}
              sessions={allSessions.filter((s: any) => s.class_id === cls.id) as SessionData[]}
              deadlines={allDeadlines.filter((d: any) => d.class_id === cls.id) as DeadlineData[]}
              notesCount={allNotes.filter((n: any) => n.class_id === cls.id).length}
              onDelete={() => {
                if (confirm('Are you sure you want to delete this class?')) {
                  deleteClass(cls.id);
                }
              }}
            />
          ))}

          {/* Add Class Card */}
          <Card 
            className="border-dashed cursor-pointer hover:border-primary/50 hover:bg-secondary/30 transition-all duration-200"
            onClick={() => setAddClassOpen(true)}
          >
            <CardContent className="flex flex-col items-center justify-center h-full min-h-[280px] text-center">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-3">
                <Plus className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-foreground mb-1">Add a new class</h3>
              <p className="text-sm text-muted-foreground">
                Set up your schedule and start taking notes
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Dialogs */}
      <AddClassDialog open={addClassOpen} onOpenChange={setAddClassOpen} />
      <ImportSyllabusDialog
        open={importOpen}
        onOpenChange={(open) => {
          setImportOpen(open);
          if (!open) setDroppedFile(null);
        }}
        initialFile={droppedFile}
      />
    </div>
  );
}

export default ClassesPage;
