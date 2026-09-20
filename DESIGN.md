---
name: I.C.A.R.O.
version: 0.3.2
reference: https://impeccable.style/
---

# Overview

I.C.A.R.O. usa uma interface escura, direta e mobile-first. A linguagem é **RPG futurista sóbrio + HUD de personagem + fitness**. A 0.3.2 acrescenta a leitura de atributos e eventos de vida sem transformar a interface num painel corporativo fantasiado de videogame.

# Princípios

1. Progresso precisa parecer progresso.
2. A informação mais importante do momento domina a hierarquia.
3. Dourado é recompensa, ação e progressão, não papel de parede.
4. Divisores, tipografia e spacing vêm antes de criar outra caixa.
5. Eventos importantes usam menos palavras.
6. Animação responde ao estado persistido. Nunca é fonte da verdade.
7. Atributos explicam **como** o jogador evolui; XP explica **quanto** ele evoluiu.
8. Um evento recente deve ser legível como fato, sem jargão técnico da integração que o originou.

# Colors

- Background principal: `#0a0a0b`
- Superfície elevada: `#111113`
- Superfície secundária: `#171719`
- Linha/divisor: `#2b2b2f`
- Texto principal: `#f5f3ef`
- Texto secundário: `#96969f`
- Ação/destaque: `#f0b74a`

O dourado é reservado para ação, XP, rank e progressão. Evitar uma cor diferente por atributo só porque alguém descobriu que gráficos podem ter arco-íris.

# Typography

- Família: system UI / Inter quando disponível.
- Títulos têm contraste forte de tamanho e peso.
- Labels são pequenas, em caixa alta e com tracking leve.
- Eventos importantes usam mensagens curtas: `MISSÃO CONCLUÍDA`, `NÍVEL AUMENTADO`, `SEQUÊNCIA MANTIDA`.
- Textos explicativos nunca disputam atenção com XP, nível, atributo ou objetivo.

# Layout

- Mobile-first.
- Largura útil confortável em telas maiores.
- Safe area Android sempre respeitada.
- Fluxo vertical como padrão.
- Uma ação principal por contexto.
- Conteúdo concluído perde contraste para a próxima missão ganhar prioridade.

# HUD

O `PlayerHud` é o resumo principal da tela Hoje e deve exibir:

- nome;
- nível;
- rank;
- XP atual / XP necessário;
- barra de XP;
- streak;
- missões concluídas / disponíveis.

A frase motivacional fica secundária ao HUD.

# Ranks

Ranks são puramente representacionais e nunca alteram a fórmula de XP:

- 1–4: Recruta
- 5–9: Iniciado
- 10–19: Explorador
- 20–34: Combatente
- 35–49: Veterano
- 50–74: Ascendente
- 75–99: Mestre
- 100+: Lendário

# Quests

Cada missão diária deve comunicar rapidamente:

- categoria;
- título;
- descrição curta;
- objetivo;
- recompensa;
- dificuldade;
- ação de conclusão.

A categoria é diferenciada principalmente por ícone e texto. Cor é apoio, não identidade única.

## Estados

### Disponível
A missão mostra detalhes completos e `CONCLUIR MISSÃO`.

### Validando
O botão responde imediatamente e mostra `VALIDANDO...`.

### Concluída
A missão é condensada, perde contraste e mostra:
- `✓ MISSÃO CONCLUÍDA`
- `+XP OBTIDO`

# Atributos

A ficha de progresso passa a incluir quatro atributos persistentes:

- Condicionamento
- Força
- Mobilidade
- Constância

A UI deve priorizar comparação rápida entre eles sem fingir precisão biométrica. Pontos são progressão de jogo derivada de regras explicáveis, não diagnóstico de saúde.

# Eventos recentes

O log de Life Events mostra fatos normalizados de forma humana:

- origem resumida;
- tipo de atividade;
- quantidade quando relevante;
- atributo afetado;
- data.

`dedupe_key`, IDs internos e payloads brutos pertencem à camada técnica, não à tela principal.

# Feedback

## XP
A barra de XP anima em aproximadamente 400–700 ms. O feedback de missão aparece sem bloquear o fluxo.

## Level up
Level up pode usar overlay curto com:
- `NÍVEL AUMENTADO`;
- nível novo;
- expansão de luz discreta;
- duração aproximada de 1,5 s;
- possibilidade de dispensar.

Sem animações longas para recompensas pequenas. Caminhar dois quilômetros continua não sendo a batalha final da humanidade.

# Ficha de progresso

A tela Progresso deve parecer uma ficha de personagem e responder “estou evoluindo?” rapidamente.

Prioridades:
- nome;
- nível + rank;
- XP do nível;
- atributos;
- XP total;
- sequência atual;
- missões concluídas;
- eventos recentes;
- últimos sete dias.

# Perfil

Perfil é a ficha editável do jogador:
- nome;
- nível + rank;
- objetivo;
- dificuldade;
- altura;
- peso.

A edição continua simples e funcional.

# Navegação

Barra inferior com quatro destinos:
- Hoje;
- Exercícios;
- Progresso;
- Perfil.

Ícones devem compartilhar a mesma linguagem de traço. O item ativo usa dourado discreto e fundo suave. Área de toque mínima confortável e safe area Android obrigatória.

# Motion

Usar Framer Motion apenas onde melhora leitura do estado:
- XP crescendo;
- missão concluída;
- level up;
- transição curta de tela;
- mudança de rank.

`prefers-reduced-motion` deve remover ou praticamente zerar essas animações.

# Do's and Don'ts

- Fazer a hierarquia responder “o que importa agora?” em menos de dois segundos.
- Usar spacing, tipografia e divisores antes de criar mais uma caixa.
- Preservar contraste e foco visível.
- Mostrar conclusão e recompensa sem depender apenas de cor.
- Manter a UI funcional em telas de 320px.
- Não usar neon em tudo.
- Não usar gradiente decorativo genérico.
- Não transformar rank ou atributo em outra economia.
- Não criar estado persistido para efeitos temporários.
- Não misturar cinco estilos de botão.
- Não criar battle pass. Há limites até para software.
