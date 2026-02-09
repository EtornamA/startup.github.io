import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { 
  FileText, 
  Mic, 
  Pencil, 
  Plus, 
  Search,
  Calendar,
  Clock,
  Trash2,
  MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

type NoteType = 'text' | 'audio' | 'drawing';

interface Note {
  id: string;
  title: string | null;
  content: string | null;
  type: string;
  audio_url: string | null;
  transcription: string | null;
  topics: string[] | null;
  keywords: string[] | null;
  created_at: string;
  updated_at: string;
}

export default function NotebookPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | NoteType>('all');

  const { data: notes = [], isLoading, refetch } = useQuery({
    queryKey: ['notes', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Note[];
    },
    enabled: !!user?.id,
  });

  const handleDeleteNote = async (noteId: string) => {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', noteId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete note',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Note deleted',
        description: 'Your note has been removed',
      });
      refetch();
      setSelectedNote(null);
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = 
      !searchQuery ||
      note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.transcription?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.topics?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = activeTab === 'all' || note.type === activeTab;
    
    return matchesSearch && matchesType;
  });

  const getNoteIcon = (type: string) => {
    switch (type) {
      case 'audio':
        return <Mic className="h-4 w-4" />;
      case 'drawing':
        return <Pencil className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getNoteTypeLabel = (type: string) => {
    switch (type) {
      case 'audio':
        return 'Recording';
      case 'drawing':
        return 'Drawing';
      default:
        return 'Text';
    }
  };

  const notesByDate = filteredNotes.reduce((acc, note) => {
    const date = format(new Date(note.created_at), 'MMMM d, yyyy');
    if (!acc[date]) acc[date] = [];
    acc[date].push(note);
    return acc;
  }, {} as Record<string, Note[]>);

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Sign in to view your notes</h2>
            <p className="text-muted-foreground">
              Your notes will be saved and synced across devices once you sign in.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Notes List Sidebar */}
      <div className="w-80 border-r border-border flex flex-col bg-background">
        <div className="p-4 border-b border-border space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Notebook</h1>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              New Note
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
              <TabsTrigger value="text" className="flex-1">
                <FileText className="h-3.5 w-3.5" />
              </TabsTrigger>
              <TabsTrigger value="audio" className="flex-1">
                <Mic className="h-3.5 w-3.5" />
              </TabsTrigger>
              <TabsTrigger value="drawing" className="flex-1">
                <Pencil className="h-3.5 w-3.5" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <ScrollArea className="flex-1">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              Loading notes...
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground">
                {searchQuery ? 'No notes match your search' : 'No notes yet'}
              </p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Create your first note to get started
              </p>
            </div>
          ) : (
            <div className="p-2">
              {Object.entries(notesByDate).map(([date, dateNotes]) => (
                <div key={date} className="mb-4">
                  <div className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {date}
                  </div>
                  <div className="space-y-1">
                    {dateNotes.map((note) => (
                      <button
                        key={note.id}
                        onClick={() => setSelectedNote(note)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          selectedNote?.id === note.id
                            ? 'bg-primary/10 border border-primary/20'
                            : 'hover:bg-secondary'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 p-1.5 rounded bg-muted">
                            {getNoteIcon(note.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {note.title || 'Untitled Note'}
                            </p>
                            <p className="text-sm text-muted-foreground truncate">
                              {note.content || note.transcription || 'No content'}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {getNoteTypeLabel(note.type)}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(note.created_at), 'h:mm a')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Note Detail View */}
      <div className="flex-1 flex flex-col bg-muted/30">
        {selectedNote ? (
          <>
            <div className="p-4 border-b border-border bg-background flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  {getNoteIcon(selectedNote.type)}
                </div>
                <div>
                  <h2 className="font-semibold">
                    {selectedNote.title || 'Untitled Note'}
                  </h2>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {format(new Date(selectedNote.created_at), 'MMM d, yyyy')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {format(new Date(selectedNote.created_at), 'h:mm a')}
                    </span>
                  </div>
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    className="text-destructive"
                    onClick={() => handleDeleteNote(selectedNote.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Note
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <ScrollArea className="flex-1 p-6">
              <div className="max-w-3xl mx-auto space-y-6">
                {/* Topics & Keywords */}
                {(selectedNote.topics?.length || selectedNote.keywords?.length) && (
                  <div className="flex flex-wrap gap-2">
                    {selectedNote.topics?.map((topic, i) => (
                      <Badge key={`topic-${i}`} variant="default">
                        {topic}
                      </Badge>
                    ))}
                    {selectedNote.keywords?.map((keyword, i) => (
                      <Badge key={`keyword-${i}`} variant="outline">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Audio Player */}
                {selectedNote.type === 'audio' && selectedNote.audio_url && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Mic className="h-4 w-4" />
                        Audio Recording
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <audio 
                        controls 
                        src={selectedNote.audio_url} 
                        className="w-full"
                      />
                    </CardContent>
                  </Card>
                )}

                {/* Transcription */}
                {selectedNote.transcription && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Transcription</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">
                        {selectedNote.transcription}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Content */}
                {selectedNote.content && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Content</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div 
                        className="prose prose-sm dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: selectedNote.content }}
                      />
                    </CardContent>
                  </Card>
                )}

                {/* Empty state for notes without content */}
                {!selectedNote.content && !selectedNote.transcription && !selectedNote.audio_url && (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>This note has no content yet</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
              <h3 className="text-lg font-medium text-muted-foreground">
                Select a note to view
              </h3>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Choose a note from the list or create a new one
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
