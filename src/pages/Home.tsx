import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRemoteGroup } from '@/core/remote';
import { t } from '@/core/i18n';
import type { Lang } from '@/core/types';

export default function Home() {
  const navigate = useNavigate();
  const browserLang: Lang = (navigator.language || '').toLowerCase().startsWith('it') ? 'it' : 'en';
  const [lang, setLang] = useState<Lang>(browserLang);
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    document.title = t(lang, 'app.title');
  }, [lang]);

  async function create() {
    try {
      setBusy(true);
      const g = await createRemoteGroup(name.trim() || t(lang, 'app.title'), lang);
      navigate(`/group/${g.id}`);
    } catch (e: any) {
      alert(`Failed to create group: ${e.message || e}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container">
      <div className="topbar">
        <div className="segmented" role="tablist" aria-label={t(lang, 'home.lang')}>
          <button className={lang === 'it' ? 'active' : ''} aria-pressed={lang === 'it'} onClick={() => setLang('it')}>IT</button>
          <button className={lang === 'en' ? 'active' : ''} aria-pressed={lang === 'en'} onClick={() => setLang('en')}>EN</button>
        </div>
      </div>

      <h1>{t(lang, 'app.brand')}</h1>
      <p className="muted">{t(lang, 'app.tagline')}</p>

      <div className="card">
        <h2>{t(lang, 'home.createTitle')}</h2>
        <div className="row">
          <input
            className="input"
            placeholder={t(lang, 'home.namePlaceholder')}
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <button className="btn primary" onClick={create} disabled={busy}>
            {t(lang, 'home.create')}
          </button>
        </div>
      </div>

      <div className="card">
        <h2>{t(lang, 'home.openTitle')}</h2>
        <p className="muted">{t(lang, 'home.openDesc')}</p>
      </div>
    </div>
  );
}