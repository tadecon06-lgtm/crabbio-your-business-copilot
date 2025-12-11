import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileDown, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChat } from '@/contexts/ChatContext';
import { useToast } from '@/hooks/use-toast';

export default function Export() {
  const navigate = useNavigate();
  const { chats } = useChat();
  const { toast } = useToast();

  const exportAllToMarkdown = () => {
    const content = chats.map(chat => {
      const messages = chat.messages.map(m => 
        `## ${m.role === 'user' ? 'Tú' : 'Crabbio'}\n\n${m.content}\n`
      ).join('\n---\n\n');
      return `# ${chat.title}\n\n${messages}`;
    }).join('\n\n---\n\n');
    
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'crabbio-export.md';
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Exportado', description: 'Todos los chats exportados a Markdown' });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="h-16 border-b border-border flex items-center px-4 gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold">Exportar datos</h1>
      </header>

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg mx-auto p-6 space-y-6"
      >
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <FileDown className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Exportá tus conversaciones</h2>
          <p className="text-muted-foreground">
            Descargá todas tus conversaciones en diferentes formatos.
          </p>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={exportAllToMarkdown}
            className="w-full justify-start gap-3 h-14"
            variant="outline"
          >
            <FileText className="w-5 h-5" />
            <div className="text-left">
              <p className="font-medium">Exportar todo a Markdown</p>
              <p className="text-xs text-muted-foreground">{chats.length} conversaciones</p>
            </div>
          </Button>

          <p className="text-xs text-center text-muted-foreground pt-4">
            También podés exportar conversaciones individuales desde el menú de cada chat.
          </p>
        </div>
      </motion.main>
    </div>
  );
}
