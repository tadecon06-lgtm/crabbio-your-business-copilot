import { Book, MessageCircle, Mail, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
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
            <Link 
              to="/docs"
              onClick={() => onOpenChange(false)}
              className="flex items-center gap-2 p-3 rounded-lg border border-border hover:bg-accent transition-colors"
            >
              <Book className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium">Documentación</p>
                <p className="text-xs text-muted-foreground">Guías y tutoriales</p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </Link>
            
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