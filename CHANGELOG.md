# Changelog

Todas as mudanças relevantes do I.C.A.R.O. serão documentadas aqui.

## [0.4.1] - 2026-09-21

### Corrigido
- Compatibilidade de inicialização com Android 15+ em dispositivos que usam páginas de memória de 16 KiB.
- Linkedição da biblioteca Rust Android com `max-page-size=16384` e `common-page-size=16384`.
- Pipeline Android fixado no NDK r28 para evitar artefatos nativos de 4 KiB.
- CI e publicação de release passam a inspecionar a `libicaro_lib.so` ARM64 e recusam APK incompatível.

### Mantido
- Health Connect read-only, Life Event Engine, XP, níveis, streak e atributos da 0.4.0 permanecem inalterados.

## [0.4.0] - 2026-09-20

### Adicionado
- Integração read-only com Health Connect.
- Detecção de disponibilidade do provedor.
- Fluxo explícito de permissões para passos, distância e sessões de exercício.
- Suporte a permissões parciais e gerenciamento pelo sistema.
- Snapshot diário normalizado com passos, distância, minutos ativos, caminhada, mobilidade e maior sessão.
- Life Events de evidência para passos, distância e sessões.
- Upsert idempotente para métricas que mudam durante o dia.
- Regras de validação automática de missões compatíveis.
- Painel Health Connect na tela Hoje.
- Indicador de compatibilidade automática nas quests.
- Fallback manual preservado.
- Build Android incluído na validação de CI da release.

### Alterado
- Health Connect passa a fornecer evidência ao Life Event Engine em vez de conceder recompensa diretamente.
- Conclusões automáticas usam a mesma tabela `mission_completion`, trigger de XP e proteção de duplicidade da conclusão manual.
- Life Event de conclusão registra `HEALTH_CONNECT` como fonte quando validado automaticamente.
- Android mínimo passa a API compatível com a integração de saúde.
- README, PRODUCT, DESIGN e documentação Android atualizados.
- Versões frontend, Rust e Tauri sincronizadas em 0.4.0.

## [0.3.2] - 2026-09-20

### Adicionado
- Life Event Engine com contrato canônico para atividade real.
- Fontes `MANUAL`, `SYSTEM` e `HEALTH_CONNECT`.
- Persistência de Condicionamento, Força, Mobilidade e Constância.
- Tabela `life_event` com `dedupe_key` única para idempotência.
- Migration SQLite 4.
- Trigger para aplicar pontos de atributo no registro de eventos.
- Backfill e reconciliação das missões já concluídas.
- Serviço de conclusão que registra evento sem duplicar XP.
- Atributos e eventos recentes na tela Progresso.

### Alterado
- A arquitetura passa a usar `vida real → evento → regra → progressão`.
- Produto reposicionado como RPG que usa a vida real como input.

## [0.3.1] - 2026-09-20

### Adicionado
- HUD do jogador, barra de XP, ranks e quests.
- Feedback de recompensa e overlay de level up.
- Ficha de personagem e histórico dos últimos sete dias.
- Navegação refinada com safe area e reduced motion.

## [0.3.0] - 2026-09-20

### Adicionado
- Persistência de XP, nível, sequência e conclusões.
- Trigger SQLite idempotente de recompensa.
- Conclusão manual de missões.
- Guia e scripts Android.

## [0.2.0] - 2026-09-20

### Adicionado
- Gerador determinístico de missões diárias.
- Persistência de missões em SQLite.
- GitHub Actions para TypeScript e Vite.

## [0.1.0] - 2026-09-20

### Adicionado
- Ficha inicial persistida.
- Catálogo de exercícios.
- Tela de perfil e progresso.
- Design system.

## [0.0.1] - 2026-09-20

### Adicionado
- Scaffold React + TypeScript + Vite + Tauri.
- Dashboard mobile-first inicial.
