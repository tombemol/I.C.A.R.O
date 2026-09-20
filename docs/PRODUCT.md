# Produto — I.C.A.R.O.

## Significado
**Índice de Condicionamento, Atividade, Rotina e Objetivos.**

## Proposta
O I.C.A.R.O. é um RPG de evolução pessoal que usa a vida real como input.

A gamificação não é o diferencial por si só. O produto existe para observar atividade real, normalizar esses fatos em eventos explicáveis e transformar o que aconteceu em progressão: atributos, missões, XP, nível, sequência e histórico.

## Princípio central
O usuário não deve precisar abrir o aplicativo para provar tudo o que viveu.

Na 0.3.2 ainda existe conclusão manual, mas ela já passa pelo mesmo motor de eventos preparado para receber fontes automáticas. A partir da 0.4.0, Health Connect será uma dessas fontes.

## Ciclo principal
1. Criar ficha.
2. Receber atividade de uma fonte: manual, sistema ou integração.
3. Normalizar a atividade como Life Event.
4. Aplicar regras explícitas e idempotentes.
5. Atualizar atributos e, quando aplicável, validar missões.
6. Conceder XP uma única vez.
7. Atualizar nível, sequência e histórico.
8. Reconciliar o estado local quando necessário.

## Atributos iniciais
- Condicionamento
- Força
- Mobilidade
- Constância

Esses atributos coexistem com XP e nível. XP representa progresso global; atributos mostram **como** o jogador está evoluindo.

## Estado da 0.3.2
- Ficha e missões continuam persistidas localmente.
- XP, nível e streak continuam protegidos contra recompensa duplicada.
- Existe um contrato canônico de Life Events.
- Eventos possuem fonte, tipo, quantidade/unidade, referência, metadados e `dedupe_key`.
- Atributos são persistentes e atualizados a partir de eventos.
- Missões concluídas podem ser reconciliadas com o novo motor.
- A tela Progresso mostra atributos e eventos recentes.
- Contratos para distância e duração já aceitam a futura origem Health Connect.

## Princípios de produto
- Offline-first.
- Vida real como input, não apenas checklist.
- Progressão explicável, nunca caixa-preta.
- Automação reduz atrito, mas não tira controle do usuário.
- Saúde antes de gamificação punitiva.
- Sem dependência obrigatória de nuvem.
- Integrações externas nunca são a única fonte da verdade.
- Persistência e recompensa devem ser idempotentes.
- O sistema pode aumentar desafio, mas não premia comportamento irresponsável.

## Direção visual
O projeto usa https://impeccable.style/ como referência de qualidade de interface. O sistema visual está documentado em `DESIGN.md`.

A interface deve parecer um RPG de evolução pessoal, mas sem transformar cada copo d'água numa abertura cinematográfica de oito minutos.
