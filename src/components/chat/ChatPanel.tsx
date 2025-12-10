import { useState, useCallback } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { EmptyState } from './EmptyState';
import { MessageList } from './MessageList';
import { Composer } from './Composer';

export function ChatPanel() {
  const { currentChat, currentChatId, createChat, addMessage } = useChat();
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [suggestionText, setSuggestionText] = useState('');

  const simulateAIResponse = async (chatId: string, userMessage: string) => {
    setIsLoading(true);
    setStreamingContent('');
    
    // Simulated AI response - in production, this would call your backend
    const responses: Record<string, string> = {
      'Validá mi idea en 3 pasos': `¡Excelente! Validar tu idea es fundamental. Aquí van los 3 pasos clave:

**1. Definí tu propuesta de valor**
¿Qué problema específico resolvés? ¿Para quién? Escribilo en una oración clara.

**2. Hablá con 10 personas de tu público objetivo**
No vendas, escuchá. Preguntá sobre sus problemas, cómo los resuelven hoy, y cuánto pagarían por una solución mejor.

**3. Creá un MVP mínimo**
Puede ser una landing page, un prototipo en Figma, o incluso un servicio manual. Medí si hay interés real.

¿Querés que profundicemos en alguno de estos pasos?`,
      'Armá un pitch de 30 segundos': `Tu pitch de 30 segundos debe responder 3 preguntas:

**¿Qué hacés?** (5 segundos)
"Ayudo a [público] a [beneficio principal]"

**¿Por qué importa?** (10 segundos)
"Hoy, [problema] les cuesta [consecuencia]"

**¿Cómo lo hacés diferente?** (15 segundos)
"Con [tu solución], logran [resultado] en [tiempo/facilidad]"

📝 **Plantilla:**
"Soy [nombre], fundador de [empresa]. Ayudamos a [público] a [beneficio]. El problema es que [dolor actual]. Nuestra solución [diferenciador] permite [resultado medible]."

¿Me contás sobre tu emprendimiento para armarlo juntos?`,
      'default': `¡Gracias por tu mensaje! Estoy acá para ayudarte con tu emprendimiento.

Puedo asistirte con:
• Validación de ideas
• Estrategia de precios
• Pitch y comunicación
• Primeros clientes
• Métricas y análisis

¿En qué te puedo ayudar hoy?`
    };

    const response = responses[userMessage] || responses['default'];
    
    // Simulate streaming
    for (let i = 0; i < response.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 10));
      setStreamingContent(response.slice(0, i + 1));
    }
    
    addMessage(chatId, { role: 'assistant', content: response });
    setStreamingContent('');
    setIsLoading(false);
  };

  const handleSend = useCallback(async (message: string) => {
    let chatId = currentChatId;
    
    if (!chatId) {
      chatId = createChat();
    }
    
    addMessage(chatId, { role: 'user', content: message });
    setSuggestionText('');
    await simulateAIResponse(chatId, message);
  }, [currentChatId, createChat, addMessage]);

  const handleSuggestionClick = (text: string) => {
    setSuggestionText(text);
  };

  const hasMessages = currentChat && currentChat.messages.length > 0;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {hasMessages ? (
        <MessageList 
          messages={currentChat.messages}
          isStreaming={isLoading}
          streamingContent={streamingContent}
        />
      ) : (
        <EmptyState onSuggestionClick={handleSuggestionClick} />
      )}
      
      <Composer 
        onSend={handleSend} 
        isLoading={isLoading}
        initialValue={suggestionText}
      />
    </div>
  );
}
