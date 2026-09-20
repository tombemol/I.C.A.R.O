# Produto — I.C.A.R.O.

## Significado
**Índice de Condicionamento, Atividade, Rotina e Objetivos.**

## Proposta
Transformar evolução física cotidiana em uma jornada de RPG: ficha, dificuldade, missões diárias, validação de atividade, XP, níveis, sequência e histórico.

## Ciclo principal
1. Criar ficha.
2. Escolher dificuldade.
3. Gerar missões diárias a partir da ficha.
4. Registrar ou validar conclusão.
5. Conceder XP uma única vez.
6. Atualizar nível e sequência.
7. Salvar progresso localmente.
8. Repetir no próximo dia sem rerrolar o passado.

## Estado da 0.3.0
- A ficha existe e é persistida localmente.
- Missões do dia são geradas e persistidas.
- Objetivo influencia seleção de categoria.
- Dificuldade altera volume e recompensa.
- Conclusões ficam registradas por `mission_id`.
- XP, nível e streak agora são dados persistentes.
- Recompensa duplicada é bloqueada no banco.
- A próxima fase integra fontes Android/Health Connect para reduzir dependência de conclusão manual.

## Princípios de produto
- Offline-first.
- Progressão explicável, nunca caixa-preta.
- Saúde antes de gamificação punitiva.
- Missões pequenas o bastante para caber em um dia real.
- Sem dependência obrigatória de nuvem.
- Código e regras abertas para auditoria e contribuição.
- O sistema pode aumentar desafio, mas não premia comportamento irresponsável.
- Persistência e recompensa devem ser idempotentes.

## Direção visual
O projeto usa https://impeccable.style/ como referência de qualidade de interface. O sistema visual está documentado em `DESIGN.md`.
