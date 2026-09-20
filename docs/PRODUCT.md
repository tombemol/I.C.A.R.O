# Produto — I.C.A.R.O.

## Significado
**Índice de Condicionamento, Atividade, Rotina e Objetivos.**

## Proposta
Transformar evolução física cotidiana em uma jornada de RPG: ficha, dificuldade, missões diárias, validação de atividade, XP, níveis, sequência e histórico.

## Ciclo principal
1. Criar ficha.
2. Escolher dificuldade.
3. Receber missões diárias.
4. Registrar ou validar atividade.
5. Receber XP.
6. Subir de nível e manter sequência.
7. Aplicar regras de progressão coerentes com a dificuldade.
8. Salvar progresso localmente.

## Estado da 0.1.0
- A ficha existe e é persistida localmente.
- Em Tauri, o armazenamento principal é SQLite.
- No preview web, localStorage mantém o fluxo testável sem runtime nativo.
- O catálogo inicial de exercícios já está navegável.
- A próxima fase conecta missões ao perfil e ao catálogo.

## Princípios de produto
- Offline-first.
- Progressão explicável, nunca caixa-preta.
- Saúde antes de gamificação punitiva.
- Missões pequenas o bastante para caber em um dia real.
- Sem dependência obrigatória de nuvem.
- Código e regras abertas para auditoria e contribuição.

## Direção visual
O projeto usa https://impeccable.style/ como referência de qualidade de interface: hierarquia clara, poucos elementos competindo pela atenção, ações específicas e ausência de ornamentação sem função. O sistema local está registrado em `DESIGN.md`.
