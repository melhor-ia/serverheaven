# Sistema de Posts e Feed

## 1. Visão Geral

O Sistema de Posts e Feed é o coração da interação social dentro do Server Heaven. Ele permite que tanto usuários quanto servidores publiquem atualizações, eventos, e outras informações, que são então agregadas em um feed principal para os usuários consumirem.

**Arquivos de Código Relevantes:**
*   Backend (API): `functions/src/posts.ts`
*   Frontend (Feed Page): `platforms/web/src/app/feed/page.tsx`
*   Frontend (Componente Post): `platforms/web/src/app/components/PostCard.tsx`
*   Frontend (Formulário Post): `platforms/web/src/app/components/PostForm.tsx`

---

## 2. Entidades e Modelagem

### Post
Representa uma única publicação feita por um usuário ou servidor.

*   `id` (string)
*   `author_user_id` (string, opcional)
*   `author_server_id` (string, opcional)
*   `content` (string)
*   `media_urls` (array de strings)
*   `tags` (array de strings)
*   `created_at` (timestamp)
*   `updated_at` (timestamp)
*   `status` (enum: 'active', 'flagged', 'removed')
*   `type` (enum: 'update', 'event', 'recruitment', 'media')
*   `like_count` (number)
*   `comment_count` (number)

### Interaction
Representa uma interação de um usuário com um post (curtida ou comentário).

*   `id` (string)
*   `post_id` (string)
*   `user_id` (string)
*   `type` (enum: 'like', 'comment')
*   `content` (string, para comentários)
*   `created_at` (timestamp)

---

## 3. Fluxo de Funcionamento

1.  **Criação de Post**:
    *   Um usuário autenticado ou um admin de servidor envia o conteúdo do post através do `PostForm`.
    *   A API (`POST /posts`) valida a autoria e cria um novo documento na coleção `posts`.
2.  **Visualização do Feed**:
    *   A página `/feed` busca os posts mais recentes da API (`GET /posts`).
    *   A API, por sua vez, não apenas retorna os posts, mas também busca os dados públicos dos autores (sejam usuários ou servidores) e os anexa a cada post, otimizando a exibição no frontend.
    *   Cada post é renderizado usando o componente `PostCard`.
3.  **Interações**:
    *   **Curtir**: Um usuário clica no botão de curtir em um `PostCard`. A API (`POST /posts/:postId/like`) cria ou remove uma interação do tipo `like` e atualiza o `like_count` do post de forma atômica.
    *   **Comentar**: Um usuário envia um comentário através do `PostCard`. A API (`POST /posts/:postId/comment`) cria uma nova interação do tipo `comment` e incrementa o `comment_count`.

---

## 4. APIs / Interfaces

*   `POST /posts`: Cria um novo post.
*   `GET /posts`: Retorna uma lista de posts para o feed, com os dados do autor (usuário ou servidor) já anexados a cada post.
*   `GET /posts/:postId`: Retorna os detalhes de um post específico.
*   `POST /posts/:postId/like`: Adiciona ou remove uma curtida de um post.
*   `POST /posts/:postId/comment`: Adiciona um comentário a um post.

---

## 5. Dependências

*   **[[Sistema de Autenticação e Perfis]]**: Para validar a autoria dos posts e das interações.
*   **[[Sistema de Servidores]]**: Para validar posts feitos em nome de um servidor.

---

## 6. Referências Cruzadas

*   Referenciado em: `functions/src/posts.ts` 