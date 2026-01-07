import { motion } from 'framer-motion';
import { Lightbulb, Target, DollarSign, BarChart3, Users, Mail } from 'lucide-react';
import { Logo } from '@/components/Logo';

interface EmptyStateProps {
  onSuggestionClick: (text: string) => void;
}

const suggestions = [
  { icon: Target, text: 'Validá mi idea en 3 pasos' },
  { icon: Lightbulb, text: 'Armá un pitch de 30 segundos' },
  { icon: DollarSign, text: 'Ayudame a fijar precios iniciales' },
  { icon: BarChart3, text: 'Qué medir la primera semana' },
  { icon: Users, text: 'Ideas de primeros clientes' },
  { icon: Mail, text: 'Escribí un mail de presentación' },
];

export function EmptyState({ onSuggestionClick }: EmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-2xl mx-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="text-center mb-12"
      >
        <Logo size="lg" showText={false} className="justify-center mb-8" />
        <h1 className="text-3xl font-bold text-foreground mb-2">
          ¿En qué puedo ayudarte?
        </h1>
        <p className="text-muted-foreground">
          Preguntá lo que necesites para tu emprendimiento.
        </p>
      </motion.div>
      
      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1, ease: 'easeOut' }}
        className="w-full"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {suggestions.map((suggestion, index) => (
            <motion.button
              key={suggestion.text}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.04, duration: 0.2 }}
              onClick={() => onSuggestionClick(suggestion.text)}
              className="group flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-soft suggestion-card text-left"
            >
              <div className="p-2.5 rounded-lg bg-secondary group-hover:bg-primary/10 transition-colors">
                <suggestion.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
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
