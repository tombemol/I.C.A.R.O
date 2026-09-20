import { useCallback, useEffect } from 'react';
import { localDateKey } from '../lib/missionGenerator';
import { useHealthConnectStore } from '../stores/useHealthConnectStore';
import { useLifeEngineStore } from '../stores/useLifeEngineStore';
import { useProgressStore } from '../stores/useProgressStore';
import { requiredHealthMetrics } from '../types/healthConnect';
import type { DailyMission } from '../types/mission';

type HealthConnectPanelProps = {
  missions: DailyMission[];
};

function formatDistance(meters: number) {
  return (meters / 1000).toLocaleString('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

export function HealthConnectPanel({ missions }: HealthConnectPanelProps) {
  const {
    availability,
    permissions,
    snapshot,
    status,
    error,
    lastSyncDate,
    lastAutoCompletedIds,
    initialize,
    requestAccess,
    syncDay,
    openSettings,
  } = useHealthConnectStore();
  const hydrateProgress = useProgressStore((state) => state.hydrate);
  const hydrateLifeEngine = useLifeEngineStore((state) => state.hydrate);
  const today = localDateKey();

  const syncAndRefresh = useCallback(async (force: boolean) => {
    const result = await syncDay(today, missions, force);
    if (!result) return;

    await Promise.all([
      hydrateProgress(today, true),
      hydrateLifeEngine(),
    ]);
  }, [hydrateLifeEngine, hydrateProgress, missions, syncDay, today]);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  useEffect(() => {
    if (
      status !== 'ready'
      || !availability?.available
      || !permissions?.granted.length
      || missions.length === 0
      || lastSyncDate === today
    ) {
      return;
    }

    void syncAndRefresh(false);
  }, [
    availability,
    lastSyncDate,
    missions.length,
    permissions,
    status,
    syncAndRefresh,
    today,
  ]);

  if (availability?.platform === 'unsupported') return null;

  const granted = permissions?.granted ?? [];
  const hasAny = requiredHealthMetrics.some((metric) => granted.includes(metric));
  const hasAll = requiredHealthMetrics.every((metric) => granted.includes(metric));
  const isBusy = ['checking', 'requesting', 'syncing'].includes(status);

  const handleConnect = async () => {
    const next = await requestAccess();
    if (!next?.granted.length) return;
    await syncAndRefresh(true);
  };

  if (!availability || status === 'checking') {
    return (
      <section className="health-connect-panel is-loading" aria-label="Health Connect">
        <div className="health-connect-mark" aria-hidden="true">HC</div>
        <div>
          <span>Health Connect</span>
          <strong>Verificando dados do Android…</strong>
        </div>
      </section>
    );
  }

  if (!availability.available) {
    return (
      <section className="health-connect-panel" aria-label="Health Connect indisponível">
        <div className="health-connect-mark is-muted" aria-hidden="true">HC</div>
        <div className="health-connect-copy">
          <span>Health Connect</span>
          <strong>Indisponível neste dispositivo</strong>
          <p>As missões continuam funcionando manualmente. Nada do seu progresso depende dessa integração.</p>
        </div>
        {availability.reason === 'providerUpdateRequired' && (
          <button className="health-connect-action" type="button" onClick={() => void openSettings()}>
            Atualizar
          </button>
        )}
      </section>
    );
  }

  return (
    <section className="health-connect-panel is-available" aria-label="Health Connect">
      <div className="health-connect-mark" aria-hidden="true">HC</div>

      <div className="health-connect-copy">
        <div className="health-connect-title">
          <span>Vida real conectada</span>
          <strong>{hasAll ? 'Health Connect ativo' : hasAny ? 'Acesso parcial' : 'Health Connect disponível'}</strong>
        </div>

        {!hasAny && (
          <p>Passos, distância e treinos podem validar missões sem você precisar marcar tudo na mão.</p>
        )}

        {snapshot && hasAny && (
          <div className="health-connect-stats" aria-label="Resumo do Health Connect hoje">
            {granted.includes('steps') && (
              <div>
                <span>Passos</span>
                <strong>{snapshot.steps.toLocaleString('pt-BR')}</strong>
              </div>
            )}
            {granted.includes('distance') && (
              <div>
                <span>Distância</span>
                <strong>{formatDistance(snapshot.distanceMeters)} km</strong>
              </div>
            )}
            {granted.includes('workouts') && (
              <div>
                <span>Treino</span>
                <strong>{Math.round(snapshot.activeMinutes)} min</strong>
              </div>
            )}
          </div>
        )}

        {lastAutoCompletedIds.length > 0 && (
          <p className="health-connect-success">
            ✓ {lastAutoCompletedIds.length} {lastAutoCompletedIds.length === 1 ? 'missão validada' : 'missões validadas'} automaticamente.
          </p>
        )}

        {snapshot?.warnings.map((warning) => (
          <p className="health-connect-warning" key={warning}>{warning}</p>
        ))}

        {error && <p className="health-connect-warning" role="alert">{error}</p>}
      </div>

      <div className="health-connect-actions">
        {!hasAll && (
          <button
            className="health-connect-action is-primary"
            type="button"
            disabled={isBusy}
            onClick={() => void handleConnect()}
          >
            {status === 'requesting' ? 'AGUARDE…' : hasAny ? 'Completar acesso' : 'Conectar'}
          </button>
        )}

        {hasAny && (
          <button
            className="health-connect-action"
            type="button"
            disabled={isBusy}
            onClick={() => void syncAndRefresh(true)}
          >
            {status === 'syncing' ? 'SINCRONIZANDO…' : 'Sincronizar'}
          </button>
        )}

        {hasAny && (
          <button className="health-connect-link" type="button" onClick={() => void openSettings()}>
            Gerenciar
          </button>
        )}
      </div>
    </section>
  );
}
