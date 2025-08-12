import { useState } from 'react';
import { useI18n } from '@/core/i18n';
import type { Lang } from '@/core/types';

interface CopyLinkButtonProps {
  lang: Lang;
  className?: string;
}

export default function CopyLinkButton({ lang, className = 'btn' }: CopyLinkButtonProps) {
  const { t } = useI18n(lang);
  const [showPopup, setShowPopup] = useState(false);

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(location.href);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    } catch (error) {
      // Fallback for browsers that don't support clipboard API
      alert(t('group.copyLink.success'));
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <button className={className} onClick={handleCopyLink}>
        {t('group.copyLink')}
      </button>
      
      {showPopup && (
        <div 
          className="copy-popup"
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '8px',
            padding: '12px 16px',
            backgroundColor: '#2d3748',
            color: 'white',
            borderRadius: '8px',
            fontSize: '14px',
            whiteSpace: 'nowrap',
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <div style={{ fontWeight: '500', marginBottom: '4px' }}>
            {t('group.copyLink.success')}
          </div>
          <div style={{ fontSize: '12px', opacity: 0.9 }}>
            {t('group.copyLink.shareMessage')}
          </div>
          <div 
            style={{
              position: 'absolute',
              top: '-6px',
              right: '16px',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderBottom: '6px solid #2d3748'
            }}
          />
        </div>
      )}
    </div>
  );
}