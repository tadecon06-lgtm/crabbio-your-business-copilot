import { motion } from 'framer-motion';
import { Lightbulb, Target, DollarSign, BarChart3, Users, Mail } from 'lucide-react';
import { Logo } from '@/components/Logo';

interface EmptyStateProps {
  onSuggestionClick: (text: string) => void;
}

const suggestions = [
  { icon: Target, text: 'Validá mi idea en 3 pasos', color: 'text-blue-500' },
  { icon: Lightbulb, text: 'Armá un pitch de 30 segundos', color: 'text-yellow-500' },
  { icon: DollarSign, text: 'Ayudame a fijar precios iniciales', color: 'text-green-500' },
  { icon: BarChart3, text: 'Qué medir la primera semana', color: 'text-purple-500' },
  { icon: Users, text: 'Ideas de primeros clientes', color: 'text-pink-500' },
  { icon: Mail, text: 'Escribí un mail de presentación', color: 'text-orange-500' },
];

export function EmptyState({ onSuggestionClick }: EmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-3xl mx-auto">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="text-center mb-10"
      >
        <Logo size="lg" showText={false} className="justify-center mb-6" />
        <h1 className="text-4xl font-bold text-foreground mb-3">
          Hola, soy <span className="text-primary">Crabbio</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Tu compañero de IA para avanzar en tu negocio. Preguntá lo que necesites.
        </p>
      </motion.div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full"
      >
        <p className="text-sm text-muted-foreground text-center mb-4">
          Probá con alguna de estas sugerencias:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {suggestions.map((suggestion, index) => (
            <motion.button
              key={suggestion.text}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              onClick={() => onSuggestionClick(suggestion.text)}
              className="group flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:bg-accent hover:border-primary/30 transition-all text-left"
            >
              <div className={`p-2 rounded-lg bg-secondary group-hover:bg-primary/10 transition-colors`}>
                <suggestion.icon className={`w-5 h-5 ${suggestion.color}`} />
              </div>
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {suggestion.text}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
