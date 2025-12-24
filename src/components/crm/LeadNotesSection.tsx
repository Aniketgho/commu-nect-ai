import { useState } from 'react';
import { LeadNote } from '@/types/crm';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquarePlus, Send } from 'lucide-react';
import { format } from 'date-fns';

interface LeadNotesSectionProps {
  notes: LeadNote[];
  onAddNote: (content: string) => void;
}

export function LeadNotesSection({ notes, onAddNote }: LeadNotesSectionProps) {
  const [newNote, setNewNote] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = () => {
    if (newNote.trim()) {
      onAddNote(newNote.trim());
      setNewNote('');
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-foreground">Notes</h4>
        {!isAdding && (
          <Button variant="ghost" size="sm" onClick={() => setIsAdding(true)}>
            <MessageSquarePlus className="h-4 w-4 mr-1" />
            Add Note
          </Button>
        )}
      </div>

      {isAdding && (
        <div className="space-y-2 p-3 bg-muted/30 rounded-lg">
          <Textarea
            placeholder="Write a note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            rows={3}
            className="resize-none"
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSubmit} disabled={!newNote.trim()}>
              <Send className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {notes.length === 0 && !isAdding ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No notes yet. Add your first note to keep track of this lead.
          </p>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="flex gap-3 p-3 bg-muted/20 rounded-lg">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {note.createdBy.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-foreground">{note.createdBy}</span>
                  <span className="text-xs text-muted-foreground">
                    {format(note.createdAt, 'MMM d, yyyy h:mm a')}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{note.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
