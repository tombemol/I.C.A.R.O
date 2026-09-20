import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { usePlayerStore } from '../stores/usePlayerStore';
import {
  difficulties,
  difficultyLabels,
  objectiveLabels,
  objectives,
  type PlayerProfile,
  type PlayerProfileInput,
} from '../types/player';

const playerProfileSchema = z.object({
  displayName: z.string().trim().min(2, 'Use pelo menos 2 caracteres.').max(32, 'Use no máximo 32 caracteres.'),
  heightCm: z.number().min(120, 'Informe uma altura válida.').max(230, 'Informe uma altura válida.'),
  weightKg: z.number().min(30, 'Informe um peso válido.').max(300, 'Informe um peso válido.'),
  objective: z.enum(objectives),
  difficulty: z.enum(difficulties),
});

type ProfileFormProps = {
  initialProfile?: PlayerProfile | null;
  onComplete?: () => void;
  submitLabel?: string;
};

export function ProfileForm({ initialProfile, onComplete, submitLabel = 'Criar minha ficha' }: ProfileFormProps) {
  const saveProfile = usePlayerStore((state) => state.saveProfile);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PlayerProfileInput>({
    defaultValues: {
      displayName: initialProfile?.displayName ?? '',
      heightCm: initialProfile?.heightCm ?? 170,
      weightKg: initialProfile?.weightKg ?? 70,
      objective: initialProfile?.objective ?? 'CONDICIONAMENTO',
      difficulty: initialProfile?.difficulty ?? 'PADRAO',
    },
  });

  const submit = async (raw: PlayerProfileInput) => {
    setSubmitError(null);
    const parsed = playerProfileSchema.safeParse(raw);

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (typeof field === 'string') {
          setError(field as keyof PlayerProfileInput, { message: issue.message });
        }
      }
      return;
    }

    try {
      await saveProfile(parsed.data);
      onComplete?.();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Não foi possível salvar a ficha.');
    }
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit(submit)} noValidate>
      <div className="form-field form-field--wide">
        <label htmlFor="displayName">Como quer ser chamado?</label>
        <input id="displayName" autoComplete="nickname" {...register('displayName')} />
        {errors.displayName && <small className="field-error">{errors.displayName.message}</small>}
      </div>

      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="heightCm">Altura</label>
          <div className="input-with-unit">
            <input id="heightCm" type="number" inputMode="decimal" {...register('heightCm', { valueAsNumber: true })} />
            <span>cm</span>
          </div>
          {errors.heightCm && <small className="field-error">{errors.heightCm.message}</small>}
        </div>

        <div className="form-field">
          <label htmlFor="weightKg">Peso</label>
          <div className="input-with-unit">
            <input id="weightKg" type="number" step="0.1" inputMode="decimal" {...register('weightKg', { valueAsNumber: true })} />
            <span>kg</span>
          </div>
          {errors.weightKg && <small className="field-error">{errors.weightKg.message}</small>}
        </div>
      </div>

      <fieldset className="choice-fieldset">
        <legend>Objetivo principal</legend>
        <p>Isso vai orientar as missões quando o gerador entrar na 0.2.0.</p>
        <div className="choice-list">
          {objectives.map((objective) => (
            <label className="choice-row" key={objective}>
              <input type="radio" value={objective} {...register('objective')} />
              <span>{objectiveLabels[objective]}</span>
            </label>
          ))}
        </div>
        {errors.objective && <small className="field-error">{errors.objective.message}</small>}
      </fieldset>

      <fieldset className="choice-fieldset">
        <legend>Dificuldade</legend>
        <p>A dificuldade controla volume e progressão, não uma competição para ver quem se destrói primeiro.</p>
        <div className="difficulty-grid">
          {difficulties.map((difficulty) => (
            <label className="difficulty-choice" key={difficulty}>
              <input type="radio" value={difficulty} {...register('difficulty')} />
              <span>{difficultyLabels[difficulty]}</span>
            </label>
          ))}
        </div>
        {errors.difficulty && <small className="field-error">{errors.difficulty.message}</small>}
      </fieldset>

      {submitError && <p className="form-error" role="alert">{submitError}</p>}

      <button className="button button--primary button--full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Salvando…' : submitLabel}
      </button>
    </form>
  );
}
