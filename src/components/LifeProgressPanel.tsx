import { useEffect } from 'react';
import { useLifeEngineStore } from '../stores/useLifeEngineStore';
import {
  ATTRIBUTE_LEVEL_STEP,
  attributeLabels,
  lifeEventSourceLabels,
  lifeEventTypeLabels,
} from '../types/lifeEvent';

const eventTime = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
});

export function LifeProgressPanel() {
  const { attributes, recentEvents, status, error, hydrate } = useLifeEngineStore();

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return (
    <div className="life-progress">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Motor de evolução</p>
          <h2>Atributos da vida real</h2>
        </div>
        <span className="engine-status">EVENTOS</span>
      </div>

      <p className="life-progress__intro">
        Missões agora viram eventos idempotentes antes de alimentar atributos. Na 0.4.0, Health Connect entra pela mesma porta.
      </p>

      {status === 'loading' && <p className="inline-status">Sincronizando eventos locais…</p>}

      {status === 'error' && (
        <p className="inline-status" role="alert">
          Motor de eventos indisponível: {error}
        </p>
      )}

      {status === 'ready' && (
        <>
          <div className="attribute-grid">
            {attributes.map((attribute) => {
              const levelProgress = (attribute.points % ATTRIBUTE_LEVEL_STEP) / ATTRIBUTE_LEVEL_STEP;
              const ariaLabel = attribute.points + ' pontos em ' + attributeLabels[attribute.attribute];
              return (
                <article className="attribute-stat" key={attribute.attribute}>
                  <div className="attribute-stat__head">
                    <div>
                      <span>{attributeLabels[attribute.attribute]}</span>
                      <strong>Nv. {attribute.level}</strong>
                    </div>
                    <b>{attribute.points} pts</b>
                  </div>
                  <div className="attribute-meter" aria-label={ariaLabel}>
                    <i style={{ transform: 'scaleX(' + levelProgress + ')' }} />
                  </div>
                  <small>{ATTRIBUTE_LEVEL_STEP - (attribute.points % ATTRIBUTE_LEVEL_STEP)} pts para o próximo nível</small>
                </article>
              );
            })}
          </div>

          <div className="event-log">
            <div className="event-log__head">
              <span>Eventos recentes</span>
              <strong>{recentEvents.length}</strong>
            </div>

            {recentEvents.length === 0 ? (
              <p className="event-log__empty">Conclua uma missão para registrar o primeiro evento.</p>
            ) : (
              <div className="event-log__list">
                {recentEvents.slice(0, 5).map((event) => {
                  const effect = event.attribute
                    ? '+' + event.attributePoints + ' ' + attributeLabels[event.attribute]
                    : 'Sem efeito de atributo';

                  return (
                    <div className="event-log__item" key={event.id}>
                      <div>
                        <strong>{lifeEventTypeLabels[event.type]}</strong>
                        <span>{effect}</span>
                      </div>
                      <div>
                        <span>{lifeEventSourceLabels[event.source]}</span>
                        <time dateTime={event.createdAt}>{eventTime.format(new Date(event.createdAt))}</time>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
