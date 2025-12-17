import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';

export default function Terms() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="h-16 border-b border-border flex items-center px-4 gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Logo size="sm" />
      </header>

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto p-6 md:p-12"
      >
        <div className="flex items-center gap-3 mb-8">
          <FileText className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Términos y Condiciones</h1>
        </div>

        <div className="prose prose-sm max-w-none dark:prose-invert space-y-6">
          <p className="text-muted-foreground">
            Última actualización: Diciembre 2024
          </p>

          <section>
            <h2 className="text-xl font-semibold mb-3">1. Aceptación de los Términos</h2>
            <p className="text-muted-foreground">
              Al acceder y utilizar Crabbio, aceptás estos términos y condiciones en su totalidad. 
              Si no estás de acuerdo con alguna parte de estos términos, no deberías usar nuestro servicio.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Descripción del Servicio</h2>
            <p className="text-muted-foreground">
              Crabbio es un asistente de inteligencia artificial diseñado para ayudar a emprendedores 
              con orientación práctica sobre negocios, validación de ideas, estrategias de precios, 
              marketing y más. Las respuestas generadas son orientativas y no constituyen asesoramiento 
              profesional vinculante.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Uso del Servicio</h2>
            <p className="text-muted-foreground">
              Te comprometés a usar Crabbio de manera responsable y legal. No está permitido:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Usar el servicio para actividades ilegales o fraudulentas</li>
              <li>Intentar vulnerar la seguridad del sistema</li>
              <li>Compartir tu cuenta con terceros</li>
              <li>Generar contenido dañino, discriminatorio o ilegal</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Propiedad Intelectual</h2>
            <p className="text-muted-foreground">
              Todo el contenido, diseño, código y marca de Crabbio son propiedad de sus creadores. 
              El contenido que generás en tus conversaciones te pertenece, pero nos otorgás 
              permiso para procesarlo con fines de mejorar el servicio.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Limitación de Responsabilidad</h2>
            <p className="text-muted-foreground">
              Crabbio proporciona información general y orientación, pero no garantiza la exactitud, 
              completitud o aplicabilidad de las respuestas para tu situación específica. 
              No somos responsables por decisiones tomadas basándose en la información proporcionada.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Modificaciones</h2>
            <p className="text-muted-foreground">
              Nos reservamos el derecho de modificar estos términos en cualquier momento. 
              Los cambios serán efectivos inmediatamente después de su publicación. 
              El uso continuado del servicio implica la aceptación de los nuevos términos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Contacto</h2>
            <p className="text-muted-foreground">
              Si tenés preguntas sobre estos términos, podés contactarnos en{' '}
              <a href="mailto:soporte@crabbio.com" className="text-primary hover:underline">
                soporte@crabbio.com
              </a>
            </p>
          </section>
        </div>
      </motion.main>
    </div>
  );
}
