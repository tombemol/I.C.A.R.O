---
name: I.C.A.R.O.
version: 0.4.0
reference: https://impeccable.style/
---

# Overview

I.C.A.R.O. usa uma interface escura, direta e mobile-first, com linguagem de **RPG futurista sóbrio + HUD de personagem + fitness**.

A 0.4.0 adiciona dados reais do Android sem transformar a experiência em dashboard clínico.

# Princípios

1. Progresso precisa parecer progresso.
2. A informação mais importante domina a hierarquia.
3. Dourado é recompensa, ação e progressão, não papel de parede.
4. Divisores, tipografia e spacing vêm antes de outra caixa.
5. Atributos explicam **como** o jogador evolui; XP explica **quanto**.
6. Eventos mostram fatos em linguagem humana.
7. Automação deve ser visível, mas não barulhenta.
8. Dados de saúde são evidência, não diagnóstico.
9. Falta de permissão nunca deve parecer erro do usuário.

# Colors

- Background: `#0a0a0b`
- Superfície: `#111113`
- Superfície secundária: `#171719`
- Linha: `#2b2b2f`
- Texto: `#f5f3ef`
- Texto secundário: `#96969f`
- Ação/progresso: `#f0b74a`

# Health Connect

O bloco de Health Connect fica entre o HUD e as quests.

Ele deve comunicar, nesta ordem:

1. estado da conexão;
2. resumo do dia quando houver acesso;
3. ação de conectar/sincronizar;
4. resultado automático relevante.

Não usar uma nova cor "médica" só porque apareceu uma API de saúde. O dourado continua sendo o destaque do jogo.

## Estados

### Verificando
Mensagem curta, sem bloquear o restante da tela.

### Disponível sem acesso
Explica o benefício e oferece `Conectar`. Nenhum prompt do sistema abre sozinho.

### Acesso parcial
Mostra somente métricas autorizadas e permite completar acesso.

### Ativo
Mostra passos, distância e minutos de treino de forma compacta.

### Indisponível
Explica que o jogo continua manualmente. Sem tom de falha.

# Quests automáticas

Missões verificáveis recebem uma indicação discreta de que podem ser validadas automaticamente.

A quest não perde o botão manual. A automação reduz atrito; não transforma o Health Connect em porteiro da experiência.

# Eventos

Eventos vindos do Health Connect exibem:

- tipo;
- quantidade/unidade;
- fonte;
- horário.

IDs, `dedupe_key` e payload técnico continuam escondidos.

# Atributos

- Condicionamento
- Força
- Mobilidade
- Constância

Pontos são progressão de jogo derivada de regras, não pontuação médica.

# Motion

Animações continuam reservadas para XP, missão concluída, level up e transições curtas. `prefers-reduced-motion` deve ser respeitado.

# Do / Don't

- Mostrar claramente quando algo foi validado automaticamente.
- Preservar fallback manual.
- Pedir permissão apenas após ação explícita.
- Mostrar somente dados autorizados.
- Manter telas funcionais a partir de 320 px.
- Não usar neon em tudo.
- Não confundir passos com "saúde".
- Não conceder XP proporcionalmente a dados brutos.
- Não transformar a tela Hoje num relatório de laboratório.
- Não criar battle pass. Continuamos civilizados.
