import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Keyboard, Book, MessageCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Help() {
  const navigate = useNavigate();

  const shortcuts = [
    { keys: ['Ctrl/Cmd', 'K'], description: 'Buscar conversaciones' },
    { keys: ['Ctrl/Cmd', 'Enter'], description: 'Enviar mensaje' },
    { keys: ['Shift', 'Enter'], description: 'Nueva línea' },
    { keys: ['Esc'], description: 'Cerrar modales' },
  ];

  const faqs = [
    {
      question: '¿Cómo guardo mis conversaciones?',
      answer: 'Todas las conversaciones se guardan automáticamente. Podés encontrarlas en el panel izquierdo.'
    },
    {
      question: '¿Puedo exportar mis chats?',
      answer: 'Sí, hacé clic en los tres puntos de cualquier chat y seleccioná "Exportar Markdown" o "Exportar PDF".'
    },
    {
      question: '¿Crabbio recuerda mis conversaciones anteriores?',
      answer: 'Sí, dentro de cada conversación Crabbio recuerda todo el contexto. Para temas nuevos, te recomendamos iniciar un nuevo chat.'
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="h-16 border-b border-border flex items-center px-4 gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold">Ayuda</h1>
      </header>

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto p-6 space-y-8"
      >
        {/* How it works */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">¿Cómo funciona Crabbio?</h2>
          </div>
          <div className="p-4 rounded-xl border border-border bg-card">
            <p className="text-muted-foreground">
              Crabbio es tu compañero de IA para emprendedores. Preguntá sobre validación de ideas, 
              estrategias de precios, pitch, marketing, finanzas, o cualquier tema de negocios. 
              Tus conversaciones se guardan automáticamente y podés organizarlas, fijarlas o archivarlas.
            </p>
          </div>
        </section>

        {/* Keyboard shortcuts */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Keyboard className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Atajos de teclado</h2>
          </div>
          <div className="space-y-2">
            {shortcuts.map((shortcut, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 rounded-lg border border-border bg-card"
              >
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
        </section>

        {/* FAQs */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Book className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Preguntas frecuentes</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="p-4 rounded-xl border border-border bg-card">
                <h3 className="font-medium mb-2">{faq.question}</h3>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Contacto</h2>
          </div>
          <div className="p-4 rounded-xl border border-border bg-card">
            <p className="text-muted-foreground mb-4">
              ¿Tenés preguntas o sugerencias? Escribinos a:
            </p>
            <a 
              href="mailto:soporte@crabbio.com"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <Mail className="w-4 h-4" />
              soporte@crabbio.com
            </a>
          </div>
        </section>
      </motion.main>
    </div>
  );
}
