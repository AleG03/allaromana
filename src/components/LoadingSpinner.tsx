import { useI18n } from '@/core/i18n';
import type { Lang } from '@/core/types';

interface LoadingSpinnerProps {
  lang?: Lang;
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

export default function LoadingSpinner({ 
  lang = 'it', 
  message, 
  size = 'medium' 
}: LoadingSpinnerProps) {
  const { t } = useI18n(lang);
  
  const sizeClasses = {
    small: { spinner: '20px', container: 'padding: 16px' },
    medium: { spinner: '32px', container: 'padding: 32px' },
    large: { spinner: '48px', container: 'padding: 48px' }
  };

  const currentSize = sizeClasses[size];

  return (
    <div 
      className="loading-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        ...currentSize.container.split(': ').reduce((acc, part, i) => {
          if (i % 2 === 0) acc[part] = currentSize.container.split(': ')[i + 1];
          return acc;
        }, {} as any)
      }}
    >
      <div 
        className="loading-spinner"
        style={{
          width: currentSize.spinner,
          height: currentSize.spinner,
          border: '3px solid var(--border)',
          borderTop: '3px solid var(--primary)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '16px'
        }}
      />
      <p className="muted" style={{ margin: 0, textAlign: 'center' }}>
        {message || t('ui.loading')}
      </p>
    </div>
  );
}