import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';

export default function Privacy() {
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
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Política de Privacidad</h1>
        </div>

        <div className="prose prose-sm max-w-none dark:prose-invert space-y-6">
          <p className="text-muted-foreground">
            Última actualización: Diciembre 2024
          </p>

          <section>
            <h2 className="text-xl font-semibold mb-3">1. Información que Recopilamos</h2>
            <p className="text-muted-foreground">
              Cuando usás Crabbio, recopilamos la siguiente información:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li><strong>Información de cuenta:</strong> Email, nombre y foto de perfil (opcional)</li>
              <li><strong>Conversaciones:</strong> Los mensajes que intercambiás con Crabbio</li>
              <li><strong>Archivos adjuntos:</strong> Documentos o imágenes que subas</li>
              <li><strong>Datos de uso:</strong> Cómo interactuás con la aplicación</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Cómo Usamos tu Información</h2>
            <p className="text-muted-foreground">
              Utilizamos tu información para:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Proporcionar y mejorar el servicio de Crabbio</li>
              <li>Personalizar tu experiencia</li>
              <li>Mantener el historial de tus conversaciones</li>
              <li>Comunicarnos contigo sobre el servicio</li>
              <li>Garantizar la seguridad de la plataforma</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Almacenamiento de Datos</h2>
            <p className="text-muted-foreground">
              Tus datos se almacenan de forma segura utilizando servicios de infraestructura confiables. 
              Las conversaciones y archivos se guardan en servidores protegidos con encriptación. 
              Podés eliminar tu cuenta y datos asociados en cualquier momento.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Cookies y Tecnologías Similares</h2>
            <p className="text-muted-foreground">
              Usamos cookies y almacenamiento local para:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Mantener tu sesión iniciada</li>
              <li>Recordar tus preferencias (tema, tamaño de fuente)</li>
              <li>Mejorar el rendimiento de la aplicación</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Compartir Información</h2>
            <p className="text-muted-foreground">
              No vendemos ni compartimos tu información personal con terceros para fines publicitarios. 
              Podemos compartir datos con proveedores de servicios que nos ayudan a operar Crabbio, 
              siempre bajo estrictos acuerdos de confidencialidad.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Tus Derechos</h2>
            <p className="text-muted-foreground">
              Tenés derecho a:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Acceder a tus datos personales</li>
              <li>Corregir información inexacta</li>
              <li>Eliminar tu cuenta y datos</li>
              <li>Exportar tus conversaciones</li>
              <li>Solicitar información sobre cómo procesamos tus datos</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Seguridad</h2>
            <p className="text-muted-foreground">
              Implementamos medidas de seguridad técnicas y organizativas para proteger tus datos, 
              incluyendo encriptación en tránsito y en reposo, autenticación segura y monitoreo 
              de accesos no autorizados.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Contacto</h2>
            <p className="text-muted-foreground">
              Para consultas sobre privacidad, contactanos en{' '}
              <a href="mailto:privacidad@crabbio.com" className="text-primary hover:underline">
                privacidad@crabbio.com
              </a>
            </p>
          </section>
        </div>
      </motion.main>
    </div>
  );
}
