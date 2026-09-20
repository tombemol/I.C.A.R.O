# Produto — I.C.A.R.O.

## Significado
**Índice de Condicionamento, Atividade, Rotina e Objetivos.**

## Proposta

O I.C.A.R.O. é um RPG de evolução pessoal que usa a vida real como input.

A categoria "habit tracker gamificado" já existe aos montes. O diferencial pretendido é reduzir a necessidade de autodeclaração: quando uma fonte confiável consegue observar uma atividade, o jogo pode usar essa evidência automaticamente.

## Princípio central

**O usuário não deveria precisar abrir o aplicativo para provar tudo o que viveu.**

A progressão segue:

```text
vida real → fonte → evento → regra → missão/atributo → XP/nível
```

A fonte nunca decide a recompensa sozinha.

## Estado da 0.4.0

- Health Connect é uma fonte real de eventos.
- Passos, distância e sessões de exercício podem ser lidos localmente.
- Permissões só são solicitadas após ação do usuário.
- Acesso parcial é aceito.
- Métricas brutas não concedem XP nem pontos.
- Missões compatíveis são comparadas a regras explícitas.
- Ao atingir a meta, a conclusão usa o mesmo caminho persistente da validação manual.
- Missões sem evidência confiável continuam manuais.
- Sincronização repetida é idempotente.
- O aplicativo continua utilizável sem Health Connect.

## Dados e privacidade

- leitura apenas;
- armazenamento local;
- sem upload obrigatório;
- mínimo de permissões;
- gerenciamento de acesso pelo Android;
- integração externa não é fonte única da verdade;
- atividade de saúde é usada como evidência de jogo, não como diagnóstico.

## Atributos

- Condicionamento
- Força
- Mobilidade
- Constância

XP representa avanço global. Atributos representam a direção da evolução.

## Regras de produto

- Offline-first.
- Vida real antes de checklist.
- Progressão explicável.
- Automação sem retirar controle.
- Saúde antes de gamificação punitiva.
- Sem recompensar comportamento irresponsável.
- Persistência e recompensa idempotentes.
- Não fingir capacidade de medição que a fonte não oferece.

## Próxima etapa

A linha 0.4.x deve ampliar cobertura de regras, melhorar sincronização e tornar a origem automática mais clara no histórico sem inflar a interface.

## Direção visual

Referência: https://impeccable.style/

A camada de saúde deve parecer parte da ficha do jogador, não um aplicativo médico enxertado dentro do RPG.
