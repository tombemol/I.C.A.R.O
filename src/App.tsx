import { useEffect, useState } from 'react';
import { BottomNav, type AppTab } from './components/BottomNav';
import { ExerciseCatalog } from './components/ExerciseCatalog';
import { Onboarding } from './components/Onboarding';
import { ProfileView } from './components/ProfileView';
import { ProgressView } from './components/ProgressView';
import { TodayView } from './components/TodayView';
import { usePlayerStore } from './stores/usePlayerStore';

export function App() {
  const { profile, hydrationStatus, hydrationError, hydrate } = usePlayerStore();
  const [tab, setTab] = useState<AppTab>('today');

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  if (hydrationStatus === 'idle' || hydrationStatus === 'loading') {
    return (
      <main className="loading-shell">
        <p className="brand">I.C.A.R.O.</p>
        <div className="loading-line" aria-label="Carregando" />
        <p>Preparando sua jornada local…</p>
      </main>
    );
  }

  if (hydrationStatus === 'error') {
    return (
      <main className="error-shell">
        <p className="eyebrow">Persistência</p>
        <h1>Não consegui abrir sua ficha.</h1>
        <p>{hydrationError}</p>
        <button className="button button--primary" type="button" onClick={() => void hydrate()}>
          Tentar novamente
        </button>
      </main>
    );
  }

  if (!profile) {
    return <Onboarding />;
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="brand">I.C.A.R.O.</p>
          <p className="brand-subtitle">Índice de Condicionamento, Atividade, Rotina e Objetivos</p>
        </div>
        <button className="avatar" type="button" aria-label="Abrir perfil" onClick={() => setTab('profile')}>
          {profile.displayName.slice(0, 1).toUpperCase()}
        </button>
      </header>

      {tab === 'today' && <TodayView />}
      {tab === 'exercises' && <ExerciseCatalog />}
      {tab === 'progress' && <ProgressView />}
      {tab === 'profile' && <ProfileView />}

      <BottomNav active={tab} onChange={setTab} />
    </main>
  );
}
