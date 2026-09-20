import { useMemo, useState } from 'react';
import {
  exerciseCategories,
  exerciseCategoryLabels,
  exercises,
  type ExerciseCategory,
} from '../data/exercises';

export function ExerciseCatalog() {
  const [category, setCategory] = useState<(typeof exerciseCategories)[number]>('TODOS');

  const visibleExercises = useMemo(
    () => category === 'TODOS' ? exercises : exercises.filter((exercise) => exercise.category === category),
    [category],
  );

  return (
    <section className="view-section" aria-labelledby="catalog-title">
      <div className="page-intro">
        <p className="eyebrow">Biblioteca</p>
        <h1 id="catalog-title">Exercícios que cabem na vida real.</h1>
        <p>Um catálogo inicial pequeno de propósito. Melhor oito opções claras do que cento e cinquenta nomes para rolar sem saber o que fazer.</p>
      </div>

      <div className="filter-row" aria-label="Filtrar exercícios">
        {exerciseCategories.map((item) => (
          <button
            key={item}
            type="button"
            className={item === category ? 'filter-chip is-active' : 'filter-chip'}
            onClick={() => setCategory(item)}
          >
            {exerciseCategoryLabels[item]}
          </button>
        ))}
      </div>

      <div className="exercise-list">
        {visibleExercises.map((exercise) => (
          <article className="exercise-row" key={exercise.id}>
            <div className="exercise-row__heading">
              <div>
                <span className="category-label">{exerciseCategoryLabels[exercise.category as ExerciseCategory]}</span>
                <h2>{exercise.title}</h2>
              </div>
              <span className="intensity-label">{exercise.intensity}</span>
            </div>
            <p>{exercise.summary}</p>
            <dl className="exercise-meta">
              <div>
                <dt>Proposta</dt>
                <dd>{exercise.prescription}</dd>
              </div>
              <div>
                <dt>Equipamento</dt>
                <dd>{exercise.equipment}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
