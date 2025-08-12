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
  const [copiedLink, setCopiedLink] = useState('');

  async function handleCopyLink() {
    try {
      const currentLink = location.href;
      await navigator.clipboard.writeText(currentLink);
      setCopiedLink(currentLink);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    } catch (error) {
      // Fallback for browsers that don't support clipboard API
      alert(t('group.shareGroup.success'));
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <button className={className} onClick={handleCopyLink}>
        {t('group.shareGroup')}
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
            minWidth: '280px',
            maxWidth: '400px',
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <div style={{ fontWeight: '500', marginBottom: '6px' }}>
            {t('group.shareGroup.success')}
          </div>
          <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '8px' }}>
            {t('group.shareGroup.shareMessage')}
          </div>
          <div 
            style={{
              fontSize: '11px',
              fontFamily: 'monospace',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '6px 8px',
              borderRadius: '4px',
              color: '#cbd5e0',
              wordBreak: 'break-all',
              lineHeight: '1.3'
            }}
          >
            {copiedLink}
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