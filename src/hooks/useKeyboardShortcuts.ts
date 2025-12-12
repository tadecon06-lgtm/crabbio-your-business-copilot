import { useEffect, useCallback } from 'react';

interface ShortcutHandlers {
  onSearch?: () => void;
  onEscape?: () => void;
}

export function useKeyboardShortcuts({ onSearch, onEscape }: ShortcutHandlers) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ctrl/Cmd + K - Search conversations
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      onSearch?.();
    }
    
    // Escape - Close modals
    if (e.key === 'Escape') {
      onEscape?.();
    }
  }, [onSearch, onEscape]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

// Hook for composer-specific shortcuts (Ctrl+Enter to send)
export function useComposerShortcuts(
  textareaRef: React.RefObject<HTMLTextAreaElement>,
  onSend: () => void,
  isLoading: boolean
) {
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Enter - Send message
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !isLoading) {
        e.preventDefault();
        onSend();
      }
      // Note: Shift + Enter for new line is default behavior, no need to handle
    };

    textarea.addEventListener('keydown', handleKeyDown);
    return () => textarea.removeEventListener('keydown', handleKeyDown);
  }, [textareaRef, onSend, isLoading]);
}
