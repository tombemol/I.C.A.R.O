import { useState } from 'react';
import { usePlayerStore } from '../stores/usePlayerStore';
import { difficultyLabels, objectiveLabels } from '../types/player';
import { ProfileForm } from './ProfileForm';

export function ProfileView() {
  const profile = usePlayerStore((state) => state.profile);
  const [editing, setEditing] = useState(false);

  if (!profile) return null;

  if (editing) {
    return (
      <section className="view-section" aria-labelledby="edit-profile-title">
        <div className="page-intro">
          <p className="eyebrow">Ficha</p>
          <h1 id="edit-profile-title">Ajuste seu ponto de partida.</h1>
          <p>Alterações ficam salvas no dispositivo e serão usadas pelo sistema de missões nas próximas versões.</p>
        </div>
        <ProfileForm
          initialProfile={profile}
          submitLabel="Salvar alterações"
          onComplete={() => setEditing(false)}
        />
      </section>
    );
  }

  return (
    <section className="view-section" aria-labelledby="profile-view-title">
      <div className="page-intro">
        <p className="eyebrow">Ficha</p>
        <h1 id="profile-view-title">{profile.displayName}</h1>
        <p>Seu contexto local para progressão. Sem ranking global, sem perfil público, sem circo.</p>
      </div>

      <dl className="profile-summary">
        <div><dt>Objetivo</dt><dd>{objectiveLabels[profile.objective]}</dd></div>
        <div><dt>Dificuldade</dt><dd>{difficultyLabels[profile.difficulty]}</dd></div>
        <div><dt>Altura</dt><dd>{profile.heightCm} cm</dd></div>
        <div><dt>Peso</dt><dd>{profile.weightKg} kg</dd></div>
      </dl>

      <button className="button button--quiet" type="button" onClick={() => setEditing(true)}>
        Editar ficha
      </button>
    </section>
  );
}
