import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'sidebar';
}

export function Logo({ className, showText = true, size = 'md', variant = 'default' }: LogoProps) {
  const sizes = {
    sm: { icon: 'w-6 h-6', text: 'text-lg' },
    md: { icon: 'w-8 h-8', text: 'text-xl' },
    lg: { icon: 'w-12 h-12', text: 'text-3xl' },
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn(
        'relative flex items-center justify-center rounded-xl bg-gradient-to-br from-primary to-crab-orange-hover shadow-glow',
        sizes[size].icon
      )}>
        <span className="text-primary-foreground font-bold" style={{ fontSize: size === 'sm' ? '12px' : size === 'md' ? '16px' : '24px' }}>
          🦀
        </span>
      </div>
      {showText && (
        <span className={cn(
          'font-bold tracking-tight',
          variant === 'sidebar' ? 'text-sidebar-foreground' : 'text-foreground',
          sizes[size].text
        )}>
          Crabbio
        </span>
      )}
    </div>
  );
}
