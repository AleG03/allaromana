import { useI18n } from '@/core/i18n';
import LoadingSpinner from './LoadingSpinner';
import type { Lang } from '@/core/types';

interface LoadingPageProps {
  lang?: Lang;
  message?: string;
  showBrand?: boolean;
}

export default function LoadingPage({ 
  lang = 'it', 
  message,
  showBrand = true 
}: LoadingPageProps) {
  const { t } = useI18n(lang);

  return (
    <div className="container">
      {showBrand && (
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1>{t('app.brand')}</h1>
          <p className="muted">{t('app.tagline')}</p>
        </div>
      )}
      
      <div className="card" style={{ textAlign: 'center' }}>
        <LoadingSpinner 
          lang={lang} 
          message={message || t('group.loading')} 
          size="large" 
        />
      </div>
    </div>
  );
}