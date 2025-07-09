# Sistema de Avaliações (Reviews)

## Visão Geral
Este documento descreve o sistema de avaliações (Reviews) da plataforma Server Heaven. Ele permite que usuários avaliem servidores e que servidores (representados por seus donos/admins) avaliem jogadores, criando um ecossistema de reputação. Este sistema é fundamental para ajudar os usuários a escolherem servidores de qualidade e para que os donos de servidores possam identificar bons jogadores.

## Entidades e Modelagem
A entidade principal é a **Review**, conforme detalhado em [[Modelagem de Dados]]. Cada avaliação é feita por um `author_id` e direcionada a um `target_server_id` ou `target_user_id`, dependendo do tipo da avaliação.

## Fluxo de Funcionamento
1.  **Criação de Avaliação:** Um usuário autenticado pode criar uma nova avaliação através da API (`POST /reviews`). A API valida os dados, o tipo de avaliação (`player_to_server` ou `server_to_player`) e cria um novo documento na coleção `reviews` do Firestore. Avaliações do tipo `player_to_player` não são permitidas no MVP.
2.  **Visualização de Avaliações:** Qualquer pessoa pode visualizar as avaliações de um servidor ou de um jogador específico. A API (`GET /reviews/:targetId`) retorna uma lista de todas as avaliações associadas àquele alvo.
3.  **Atualização de Reputação:** Após a criação de uma nova avaliação, a Cloud Function `onReviewCreate` é acionada automaticamente. Ela recalcula a avaliação média e a contagem de avaliações, e atualiza o objeto `rating` no documento do respectivo servidor ou usuário.

## APIs / Interfaces
As seguintes rotas de API foram implementadas no serviço `api` e montadas sob o prefixo `/reviews`:

*   `POST /reviews`
    *   **Descrição:** Cria uma nova avaliação.
    *   **Proteção:** Requer token de autenticação (Bearer Token).
    *   **Corpo da Requisição:** `{ "rating": number, "content": string, "type": "player_to_server" | "server_to_player", "target_server_id"?: string, "target_user_id"?: string }`
*   `GET /reviews/:targetId`
    *   **Descrição:** Retorna todas as avaliações para um determinado alvo (servidor ou jogador).
    *   **Proteção:** Nenhuma.

## Dependências
*   Firestore
*   Firebase Authentication
*   [[Sistema de Autenticação e Perfis]]
*   [[Sistema de Servidores]]

## Referências Cruzadas
*   [[Modelagem de Dados]]
*   [[Fluxos Principais de Usuário e API]]

## Funções de Nuvem (Cloud Functions)
*   **`onReviewCreate`**
    *   **Gatilho:** `onDocumentCreated("reviews/{reviewId}")`
    *   **Descrição:** Acionada quando uma nova avaliação é criada. Atualiza a pontuação de `rating` (média e contagem) do servidor ou usuário alvo.

## Histórico de Alterações
*   **2024-07-29:** Implementação da lógica de agregação de `rating` com a Cloud Function `onReviewCreate`.
*   **2024-07-29:** Implementação inicial dos endpoints CRUD para avaliações e da estrutura de permissões.
