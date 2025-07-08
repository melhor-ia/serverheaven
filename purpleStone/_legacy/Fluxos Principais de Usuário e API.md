### 🔐 **Fluxo de Autenticação**

* Login via Firebase Authentication:

  * Métodos: E-mail/Senha, Google, Discord (OAuth customizado).
* Cadastro de novo usuário:

  * Cria registro no Firebase Auth.
  * Cria documento na coleção `Users` no Firestore.
* Recuperação de senha e gerenciamento de sessão nativos do Firebase.

---

### 👤 **Fluxo de Criação e Gerenciamento de Perfis**

* Após autenticação:

  * Usuário preenche perfil (display name, bio, avatar, etc.).
  * Cadastra seus `PlayerIdentities` (IGN por jogo e servidor) \[opcional na criação].
* Endpoints/API:

  * GET `/profile/{user_id}` — Ver perfil público.
  * POST `/profile` — Criar/atualizar perfil.
  * POST `/profile/identity` — Adicionar ou atualizar IGN.

---

### ⭐ **Fluxo de Avaliações (Reviews)**

* Jogador → Servidor.
* Servidor → Jogador.
* Jogador → Jogador (**Desativado no MVP, modelado para o futuro.**)
* Endpoints/API:

  * POST `/review` — Criar avaliação.
  * GET `/reviews/{target_id}` — Listar avaliações de um servidor ou jogador.
* Backend atualiza reputação agregada após cada review.

---

### 📰 **Fluxo de Posts e Feed Social**

* Usuário ou Servidor cria posts:

  * Texto, imagens, links, mídia.
* Interações:

  * Curtidas e comentários.
* O feed é **personalizado ao contexto do usuário**, priorizando:

  * Posts de servidores nos quais o usuário joga, segue ou interage.
  * Posts de jogadores seguidos ou com alta reputação.
  * Posts recentes e relevantes, baseados nas tags de interesse (como tipo de gameplay, idioma, localização, etc.).
  * Posts de servidores ou usuários em destaque (boosts).
* Endpoints/API:

  * POST `/post` — Criar post.
  * GET `/feed` — Feed personalizado.
  * GET `/post/{id}` — Ver post específico.
  * POST `/post/{id}/like` — Curtir.
  * POST `/post/{id}/comment` — Comentar.

---

### 🔍 **Fluxo de Busca Inteligente**

* Filtros combináveis:

  * Tipo de gameplay, reputação, idioma, localização, tags, status de boost.
* Endpoints/API:

  * GET `/search/servers` — Buscar servidores.
  * GET `/search/users` — Buscar jogadores.
* Backend prioriza resultados com boosts (via `boost_priority_level`).

---

### 🚀 **Fluxo de Boost (Apoio via Patreon)**

* Verificação automática de apoiadores Patreon via webhook ou sincronização periódica.
* Backend ativa boosts simbólicos:

  * Atualiza campo `is_supporter` no usuário.
  * Cria registro em `Boost` para usuários ou servidores.
* Efeitos:

  * Destaque na busca.
  * Selo visual no perfil e nos posts.
* Endpoints/API:

  * GET `/boost/status` — Checar status do boost.
  * POST `/boost/sync` — Sincronizar boosts (interno/admin).

---

### 🚨 **Fluxo de Moderação e Denúncias (Reports)**

* Qualquer conteúdo pode ser denunciado:

  * Perfis, servidores, posts, comentários, avaliações.
* Endpoints/API:

  * POST `/report` — Criar denúncia.
  * GET `/reports` — Listar (admin/moderação).
  * POST `/reports/{id}/action` — Tomar ação (banir, ocultar, remover conteúdo).
* Backend mantém logs de ações administrativas.

---

## 🔗 **Resumo dos Fluxos Chave:**

* 🔐 Autenticação e gestão de perfil.
* ⭐ Avaliações e reputação.
* 📰 Posts e feed social.
* 🔍 Busca inteligente com destaque para apoiadores.
* 🚀 Boost simbólico via Patreon.
* 🚨 Moderação robusta e ativa.

---
