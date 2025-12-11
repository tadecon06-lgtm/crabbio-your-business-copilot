import { useState, useRef, useEffect, KeyboardEvent, ChangeEvent, DragEvent } from 'react';
import { Send, Paperclip, Settings2, X, FileText, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Attachment } from '@/types/chat';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ComposerProps {
  onSend: (message: string, attachments?: Attachment[]) => void;
  isLoading?: boolean;
  initialValue?: string;
}

export function Composer({ onSend, isLoading, initialValue = '' }: ComposerProps) {
  const [message, setMessage] = useState(initialValue);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (initialValue) {
      setMessage(initialValue);
      textareaRef.current?.focus();
    }
  }, [initialValue]);

  const handleSubmit = () => {
    if ((!message.trim() && attachments.length === 0) || isLoading) return;
    onSend(message.trim(), attachments.length > 0 ? attachments : undefined);
    setMessage('');
    setAttachments([]);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const uploadFile = async (file: File): Promise<Attachment | null> => {
    if (!user) return null;
    
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast({ title: 'Error', description: 'El archivo es muy grande (máx 10MB)', variant: 'destructive' });
      return null;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('attachments')
      .upload(fileName, file);
    
    if (error) {
      console.error('Upload error:', error);
      toast({ title: 'Error', description: 'No se pudo subir el archivo', variant: 'destructive' });
      return null;
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from('attachments')
      .getPublicUrl(data.path);
    
    return {
      id: data.path,
      name: file.name,
      type: file.type,
      url: publicUrl,
      size: file.size,
    };
  };

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    try {
      const newAttachments: Attachment[] = [];
      for (const file of Array.from(files)) {
        const attachment = await uploadFile(file);
        if (attachment) newAttachments.push(attachment);
      }
      setAttachments(prev => [...prev, ...newAttachments]);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    try {
      const newAttachments: Attachment[] = [];
      for (const file of Array.from(files)) {
        const attachment = await uploadFile(file);
        if (attachment) newAttachments.push(attachment);
      }
      setAttachments(prev => [...prev, ...newAttachments]);
    } finally {
      setIsUploading(false);
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    }
  }, [message]);

  const isImage = (type: string) => type.startsWith('image/');

  return (
    <div 
      className={cn(
        "border-t border-border bg-background/80 backdrop-blur-sm p-4 transition-colors",
        isDragging && "bg-primary/5 border-primary"
      )}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <div className="max-w-3xl mx-auto">
        {/* Attachments preview */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {attachments.map(attachment => (
              <div 
                key={attachment.id}
                className="relative group flex items-center gap-2 p-2 rounded-lg bg-secondary border border-border"
              >
                {isImage(attachment.type) ? (
                  <img 
                    src={attachment.url} 
                    alt={attachment.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-12 flex items-center justify-center bg-muted rounded">
                    <FileText className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
                <span className="text-sm truncate max-w-[100px]">{attachment.name}</span>
                <button
                  onClick={() => removeAttachment(attachment.id)}
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-end gap-3 p-3 rounded-2xl border border-border bg-card shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 transition-all">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.txt,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-muted-foreground hover:text-foreground"
            aria-label="Adjuntar archivo"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Paperclip className={cn("w-5 h-5", isUploading && "animate-pulse")} />
          </Button>
          
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isDragging ? "Soltá el archivo aquí..." : "Escribí tu mensaje..."}
            className="flex-1 min-h-[24px] max-h-[200px] resize-none border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60"
            rows={1}
            disabled={isLoading}
          />
          
          <Button
            onClick={handleSubmit}
            disabled={(!message.trim() && attachments.length === 0) || isLoading}
            size="icon"
            className={cn(
              'shrink-0 rounded-xl transition-all',
              (message.trim() || attachments.length > 0)
                ? 'bg-primary hover:bg-crab-orange-hover text-primary-foreground shadow-glow' 
                : 'bg-muted text-muted-foreground'
            )}
            aria-label="Enviar mensaje"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        
        <p className="text-xs text-center text-muted-foreground mt-3">
          Crabbio puede cometer errores. Verificá la información importante.
        </p>
      </div>
    </div>
  );
}
