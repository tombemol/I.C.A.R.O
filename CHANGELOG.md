# Changelog

Todas as mudanças relevantes do I.C.A.R.O. serão documentadas aqui.

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
- Contratos preparados para distância e duração vindas do Health Connect.
- Atributos e eventos recentes na tela Progresso.
- Documento técnico `docs/LIFE_EVENT_ENGINE.md`.

### Alterado
- A arquitetura passa a usar o pipeline `vida real → evento → regra → progressão`.
- A conclusão manual passa pelo mesmo motor preparado para fontes automáticas.
- Produto reposicionado como RPG que usa a vida real como input.
- README, PRODUCT e DESIGN atualizados para a nova direção.
- Versões frontend, Rust e Tauri sincronizadas em 0.3.2.

## [0.3.1] - 2026-09-20

### Adicionado
- HUD do jogador com nível, rank, XP, sequência e missões do dia.
- Barra de XP animada.
- Ranks visuais sem alterar a fórmula de progressão.
- Missões apresentadas como quests.
- Feedback imediato de conclusão e recompensa.
- Overlay curto de level up.
- Tela Progresso em formato de ficha de personagem.
- Histórico visual dos últimos sete dias.
- Navegação inferior refinada e compatível com safe area.
- Transições discretas com suporte a `prefers-reduced-motion`.

### Alterado
- Perfil alinhado à linguagem visual da ficha do jogador.
- Direção visual consolidada como RPG futurista sóbrio + HUD + fitness.

## [0.3.0] - 2026-09-20

### Adicionado
- Persistência de XP, nível, sequência e último dia ativo.
- Migration `player_progress` e `mission_completion`.
- Trigger SQLite que concede XP e atualiza sequência apenas na primeira conclusão de cada missão.
- Conclusão manual de missões na tela Hoje.
- Estado visual de missão concluída.
- Resumo de progresso ligado aos dados persistidos.
- Branch e PR dedicados para a versão.
- Guia de teste Android no PC com Android Emulator.
- Scripts `android:init`, `android:dev`, `android:studio` e `android:build`.

### Alterado
- Valores demonstrativos de nível/XP/streak foram removidos do Player Store.
- A tela Progresso agora lê dados reais do armazenamento local.
- Processo de release formalizado em `docs/RELEASE_PROCESS.md`.

## [0.2.0] - 2026-09-20

### Adicionado
- Gerador determinístico de três missões diárias.
- Missões adaptadas ao objetivo e à dificuldade da ficha.
- Multiplicadores de meta e XP por dificuldade.
- Persistência das missões do dia em SQLite.
- Migration `daily_mission` com índice por data.
- Fallback de missões para localStorage no preview web.
- Tratamento visual para carregamento e falha do gerador.
- GitHub Actions para validar TypeScript e build Vite em cada push na `main`.

### Alterado
- Tela Hoje não depende mais de missões hardcoded.
- A ficha agora explica que objetivo e dificuldade alimentam o gerador diário.
- README atualizado para a 0.2.0.

## [0.1.0] - 2026-09-20

### Adicionado
- Ficha inicial do jogador com nome, altura, peso, objetivo e dificuldade.
- Persistência nativa SQLite via plugin SQL oficial do Tauri.
- Migration inicial versionada para `player_profile`.
- Fallback para localStorage durante preview no navegador.
- Catálogo inicial de exercícios com filtros por categoria.
- Tela de perfil com edição da ficha.
- Tela de progresso com resumo de XP, nível e sequência.
- `DESIGN.md` registrando o sistema visual do projeto.

### Alterado
- Navegação principal agora possui Hoje, Exercícios, Progresso e Perfil.
- Interface refinada para reduzir cards aninhados e melhorar leitura em telas pequenas.
- README atualizado para refletir o estado da 0.1.0.

## [0.0.1] - 2026-09-20

### Adicionado
- Scaffold React + TypeScript + Vite.
- Estrutura inicial Tauri 2 para desktop/mobile.
- Dashboard mobile-first da jornada diária.
- Protótipo de nível, XP, sequência e missões.
- Store inicial de jogador com Zustand.
- Documento de produto e princípios visuais.
- README versionado junto da release.
