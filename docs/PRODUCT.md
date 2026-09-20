# Produto — I.C.A.R.O.

## Significado
**Índice de Condicionamento, Atividade, Rotina e Objetivos.**

## Proposta
Transformar evolução física cotidiana em uma jornada de RPG: ficha, dificuldade, missões diárias, validação de atividade, XP, níveis, sequência e histórico.

## Ciclo principal
1. Criar ficha.
2. Escolher dificuldade.
3. Gerar missões diárias a partir da ficha.
4. Registrar ou validar atividade.
5. Receber XP.
6. Subir de nível e manter sequência.
7. Aplicar regras de progressão coerentes com a dificuldade.
8. Salvar progresso localmente.

## Estado da 0.2.0
- A ficha existe e é persistida localmente.
- Missões do dia são geradas de forma determinística.
- Objetivo influencia seleção de categoria.
- Dificuldade altera volume e recompensa.
- Missões são persistidas para não mudar durante o mesmo dia.
- O catálogo inicial segue navegável.
- A próxima fase torna conclusão, XP, nível e sequência persistentes.

## Princípios de produto
- Offline-first.
- Progressão explicável, nunca caixa-preta.
- Saúde antes de gamificação punitiva.
- Missões pequenas o bastante para caber em um dia real.
- Sem dependência obrigatória de nuvem.
- Código e regras abertas para auditoria e contribuição.
- O sistema pode aumentar desafio, mas não premia comportamento irresponsável.

## Direção visual
O projeto usa https://impeccable.style/ como referência de qualidade de interface. O sistema visual está documentado em `DESIGN.md`.
