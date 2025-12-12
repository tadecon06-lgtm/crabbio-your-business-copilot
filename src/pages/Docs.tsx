import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Upload, Archive, Pin, Download, Keyboard, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Docs() {
  const navigate = useNavigate();

  const sections = [
    {
      icon: MessageSquare,
      title: '¿Qué es Crabbio?',
      content: 'Crabbio es tu compañero de IA para emprendedores. Está diseñado para ayudarte a validar ideas, crear estrategias, definir precios, armar pitches y resolver cualquier duda sobre tu negocio. Pensalo como un mentor disponible 24/7.'
    },
    {
      icon: MessageSquare,
      title: 'Cómo usar el chat',
      content: 'Simplemente escribí tu pregunta o idea en el campo de texto y presioná Enter o el botón de enviar. Crabbio va a responder con consejos prácticos y accionables. Podés hacer preguntas de seguimiento para profundizar en cualquier tema.'
    },
    {
      icon: Upload,
      title: 'Subir archivos',
      content: 'Podés arrastrar y soltar archivos (imágenes, PDFs, documentos) directamente en el chat. Crabbio puede analizar el contenido y darte feedback sobre presentaciones, logos, documentos de negocio, etc.'
    },
    {
      icon: Pin,
      title: 'Organizar conversaciones',
      content: 'Usá el menú de tres puntos en cada chat para: Fijar conversaciones importantes para acceso rápido, Archivar chats que ya no necesitás ver seguido, Renombrar chats para encontrarlos fácil.'
    },
    {
      icon: Archive,
      title: 'Archivar y eliminar',
      content: 'Los chats archivados se mueven a la sección "Archivados" pero no se borran. Si querés eliminar un chat definitivamente, usá la opción "Eliminar" del menú.'
    },
    {
      icon: Download,
      title: 'Exportar conversaciones',
      content: 'Podés exportar cualquier conversación a Markdown (.md) o PDF desde el menú del chat. Útil para guardar consejos importantes o compartir con tu equipo.'
    },
    {
      icon: Keyboard,
      title: 'Atajos de teclado',
      content: 'Ctrl/Cmd + K: Buscar conversaciones. Ctrl/Cmd + Enter: Enviar mensaje. Shift + Enter: Nueva línea sin enviar. Esc: Cerrar modales y diálogos.'
    },
    {
      icon: Moon,
      title: 'Modo oscuro/claro',
      content: 'Podés cambiar entre modo oscuro y claro desde el ícono de sol/luna en el header. Tu preferencia se guarda automáticamente.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="h-16 border-b border-border flex items-center px-4 gap-4 sticky top-0 bg-background/95 backdrop-blur z-10">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🦀</span>
          <h1 className="text-lg font-semibold">Documentación</h1>
        </div>
      </header>

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto p-6 space-y-8"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Guía de uso de Crabbio</h2>
          <p className="text-muted-foreground">Todo lo que necesitás saber para aprovechar al máximo tu asistente de negocios</p>
        </div>

        <div className="space-y-6">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-5 rounded-xl border border-border bg-card"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <section.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{section.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="p-6 rounded-xl border border-primary/20 bg-primary/5 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            ¿Tenés más preguntas o sugerencias?
          </p>
          <a 
            href="mailto:soporte@crabbio.com"
            className="text-primary font-medium hover:underline"
          >
            Escribinos a soporte@crabbio.com
          </a>
        </div>
      </motion.main>
    </div>
  );
}
