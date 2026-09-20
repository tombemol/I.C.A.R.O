import { useEffect, useState } from 'react';
import { localDateKey } from '../lib/missionGenerator';
import { usePlayerStore } from '../stores/usePlayerStore';
import { useProgressStore } from '../stores/useProgressStore';
import { difficultyLabels, objectiveLabels } from '../types/player';
import { RankBadge } from './game/RankBadge';
import { ProfileForm } from './ProfileForm';

export function ProfileView() {
  const profile = usePlayerStore((state) => state.profile);
  const { progress, hydrate } = useProgressStore();
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    void hydrate(localDateKey());
  }, [hydrate]);

  if (!profile) return null;

  if (editing) {
    return (
      <section className="view-section" aria-labelledby="edit-profile-title">
        <div className="page-intro">
          <p className="eyebrow">Ficha do jogador</p>
          <h1 id="edit-profile-title">Ajuste seu ponto de partida.</h1>
          <p>Alterações ficam salvas no dispositivo e orientam a geração das próximas missões.</p>
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
      <div className="character-sheet-head">
        <div>
          <p className="eyebrow">Ficha do jogador</p>
          <h1 id="profile-view-title">{profile.displayName}</h1>
        </div>
        {progress && (
          <div className="character-sheet-level">
            <strong>Nv. {progress.level}</strong>
            <RankBadge level={progress.level} />
          </div>
        )}
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
