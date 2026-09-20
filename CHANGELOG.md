# Changelog

Todas as mudanças relevantes do I.C.A.R.O. serão documentadas aqui.

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
