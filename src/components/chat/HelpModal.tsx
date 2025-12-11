import { Keyboard, Book, MessageCircle, Mail, ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface HelpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HelpModal({ open, onOpenChange }: HelpModalProps) {
  const shortcuts = [
    { keys: ['Ctrl/Cmd', 'K'], description: 'Buscar conversaciones' },
    { keys: ['Ctrl/Cmd', 'Enter'], description: 'Enviar mensaje' },
    { keys: ['Shift', 'Enter'], description: 'Nueva línea' },
    { keys: ['Esc'], description: 'Cerrar modales' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">🦀</span>
            Centro de Ayuda
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Keyboard shortcuts */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold mb-3">
              <Keyboard className="w-4 h-4" />
              Atajos de teclado
            </h3>
            <div className="space-y-2">
              {shortcuts.map((shortcut, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{shortcut.description}</span>
                  <div className="flex items-center gap-1">
                    {shortcut.keys.map((key, i) => (
                      <span key={i}>
                        <kbd className="px-2 py-1 text-xs font-mono bg-muted rounded border border-border">
                          {key}
                        </kbd>
                        {i < shortcut.keys.length - 1 && <span className="mx-1 text-muted-foreground">+</span>}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How it works */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold mb-3">
              <MessageCircle className="w-4 h-4" />
              ¿Cómo funciona Crabbio?
            </h3>
            <p className="text-sm text-muted-foreground">
              Crabbio es tu compañero de IA para emprendedores. Preguntá sobre validación de ideas, 
              estrategias de precios, pitch, marketing, o cualquier tema de negocios. 
              Tus conversaciones se guardan automáticamente.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-2">
            <a 
              href="https://docs.crabbio.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 rounded-lg border border-border hover:bg-accent transition-colors"
            >
              <Book className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium">Documentación</p>
                <p className="text-xs text-muted-foreground">Guías y tutoriales</p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </a>
            
            <a 
              href="mailto:soporte@crabbio.com"
              className="flex items-center gap-2 p-3 rounded-lg border border-border hover:bg-accent transition-colors"
            >
              <Mail className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium">Contacto</p>
                <p className="text-xs text-muted-foreground">soporte@crabbio.com</p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
