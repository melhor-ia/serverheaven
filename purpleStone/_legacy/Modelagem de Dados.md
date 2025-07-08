### 🔗 Visão Geral da Modelagem
A modelagem de dados do Server Heaven foi pensada para ser **modular, escalável, multigame e moderation-ready**, refletindo as decisões estratégicas adotadas no projeto:

* Plataforma **open-source**, sem billing direto, utilizando **Patreon como sistema de apoio comunitário**.
* Sistema de **Boosts como selo simbólico de apoio**, com efeitos visuais e sociais (não comerciais).
* Estrutura preparada para futuras expansões, como avaliações **jogador para jogador (P2P)**, inicialmente desativadas no MVP.
* Arquitetura pensada desde o início para suportar múltiplos jogos além do Minecraft.

---

### 🏗️ Entidades Principais

#### 1. **User (Jogador)**

* `id`
* `username`
* `display_name`
* `email`
* `avatar_url`
* `bio`
* `reputation_score`
* `is_supporter` (bool - indica apoio no Patreon)
* `supporter_since` (timestamp)
* `created_at`
* `updated_at`
* `status` (active, suspended, banned)

##### 🔗 Relacionamentos:

* Pode ser dono/admin de múltiplos servidores.
* Pode criar posts.
* Pode avaliar servidores.
* Pode avaliar outros usuários (**P2P - desativado inicialmente**).
* Pode receber avaliações de servidores e, futuramente, de outros usuários.
* Possui múltiplas identidades in-game através da entidade `PlayerIdentity`.

---

#### 2. **Server (Servidor)**

* `id`
* `name`
* `description`
* `ip_address` (opcional ou privado)
* `website_url`
* `discord_url`
* `tags` (array)
* `reputation_score`
* `owner_id` (User)
* `game_id` (Game)
* `created_at`
* `updated_at`
* `status` (active, suspended, banned)

##### 🔗 Relacionamentos:

* Possui múltiplos admins (Users).
* Recebe avaliações de jogadores.
* Pode avaliar jogadores.
* Pode criar posts.
* Pode ser destacado via Boost.

---

#### 3. **Game (Jogo)**

* `id`
* `name`
* `slug`
* `icon_url`
* `status` (active, deprecated)

---

#### 4. **Review (Avaliação)**

* `id`
* `author_id` (User)
* `target_server_id` (Server, opcional)
* `target_user_id` (User, opcional)
* `rating` (1-5)
* `content`
* `created_at`
* `updated_at`
* `status` (active, flagged, removed)
* `type` (player\_to\_server, server\_to\_player, player\_to\_player)

🔸 **Observação:** Avaliações do tipo `player_to_player` estarão desativadas no MVP, mas o modelo suporta sua ativação futura.

---

#### 5. **Post (Publicação)**

* `id`
* `author_user_id` (User, opcional)
* `author_server_id` (Server, opcional)
* `content`
* `media_urls` (array)
* `tags` (array)
* `created_at`
* `updated_at`
* `status` (active, flagged, removed)
* `type` (update, event, recruitment, media)

---

#### 6. **Interaction (Interação)**

* `id`
* `post_id`
* `user_id`
* `type` (like, comment)
* `content` (para comentários)
* `created_at`

---

#### 7. **Boost (Selo de Apoio)**

* `id`
* `target_user_id` (User, opcional)
* `target_server_id` (Server, opcional)
* `supporter_since`
* `expires_at` (opcional - se aplicável a mecânicas futuras)
* `priority_level` (int - nível de destaque)
* `is_active`

---

#### 8. **Report (Denúncia)**

* `id`
* `reporter_id` (User)
* `target_type` (user, server, review, post, comment)
* `target_id`
* `reason`
* `description`
* `created_at`
* `status` (pending, reviewed, dismissed, action\_taken)

---

#### 9. **PlayerIdentity (Identidade In-Game)**

* `id`
* `user_id` (User)
* `game_id` (Game)
* `server_id` (Server, opcional)
* `ign` (In-Game Name — nome usado dentro do jogo ou servidor)
* `created_at`
* `updated_at`

##### 🔗 Relacionamentos:

* Relaciona um usuário com um jogo e, opcionalmente, com um servidor específico.
* Permite múltiplas identidades por jogo ou servidor, suportando variações de nicknames.

---

### ⚙️ Considerações Técnicas

* Todos os modelos possuem `status` para controle de moderação.
* Sistema de tags flexível, utilizado em servidores e posts.
* Busca otimizada considerando `reputation_score`, `boost.priority_level`, tags e outros filtros.
* Sistema de boost desacoplado de billing, alinhado com o modelo open-source + Patreon.
* Entidade `Game` garante expansão fácil para outros jogos.
* Avaliação P2P modelada, mas desativada no MVP.
* Sistema de identidades in-game modelado via `PlayerIdentity`, permitindo suporte robusto e escalável para diferentes jogos e servidores.
