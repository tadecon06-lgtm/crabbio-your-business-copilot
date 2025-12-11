import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Moon, Sun, Type, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Settings() {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [fontSize, setFontSize] = useState(user?.fontSize || 'medium');
  const [streamingEnabled, setStreamingEnabled] = useState(user?.streamingEnabled ?? true);
  const [model, setModel] = useState('gemini-2.5-flash');

  const handleFontSizeChange = async (value: string) => {
    setFontSize(value);
    await updateProfile({ fontSize: value });
    toast({ title: 'Tamaño de fuente actualizado' });
  };

  const handleStreamingToggle = async (enabled: boolean) => {
    setStreamingEnabled(enabled);
    await updateProfile({ streamingEnabled: enabled });
    toast({ title: enabled ? 'Streaming activado' : 'Streaming desactivado' });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="h-16 border-b border-border flex items-center px-4 gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold">Preferencias</h1>
      </header>

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg mx-auto p-6 space-y-6"
      >
        {/* Theme */}
        <div className="p-4 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              <div>
                <p className="font-medium">Modo {theme === 'dark' ? 'oscuro' : 'claro'}</p>
                <p className="text-sm text-muted-foreground">Cambiá el tema de la app</p>
              </div>
            </div>
            <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
          </div>
        </div>

        {/* Font size */}
        <div className="p-4 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-3 mb-3">
            <Type className="w-5 h-5" />
            <div>
              <p className="font-medium">Tamaño de fuente</p>
              <p className="text-sm text-muted-foreground">Ajustá el tamaño del texto</p>
            </div>
          </div>
          <Select value={fontSize} onValueChange={handleFontSizeChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Pequeño</SelectItem>
              <SelectItem value="medium">Mediano</SelectItem>
              <SelectItem value="large">Grande</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Streaming */}
        <div className="p-4 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5" />
              <div>
                <p className="font-medium">Animación de streaming</p>
                <p className="text-sm text-muted-foreground">Mostrar respuestas letra por letra</p>
              </div>
            </div>
            <Switch checked={streamingEnabled} onCheckedChange={handleStreamingToggle} />
          </div>
        </div>

        {/* AI Model (placeholder) */}
        <div className="p-4 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xl">🤖</span>
            <div>
              <p className="font-medium">Modelo de IA</p>
              <p className="text-sm text-muted-foreground">Seleccioná el modelo a usar</p>
            </div>
          </div>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gemini-2.5-flash">Gemini 2.5 Flash (Recomendado)</SelectItem>
              <SelectItem value="gemini-2.5-pro">Gemini 2.5 Pro</SelectItem>
              <SelectItem value="gpt-5">GPT-5</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-2">
            Próximamente: conectá tu propio GPT personalizado
          </p>
        </div>
      </motion.main>
    </div>
  );
}
