# Sistema de Servidores

## Visão Geral
Este documento descreve o sistema de gerenciamento de servidores (Server) no Server Heaven. Este sistema permite que usuários criem, visualizem, atualizem e deletem seus próprios servidores de jogos, que são o coração da plataforma. A entidade `Server` é projetada para ser flexível e suportar múltiplos jogos, começando com o Minecraft.

## Entidades e Modelagem
A entidade principal é o **Server**, conforme detalhado em [[Modelagem de Dados]]. Cada servidor está associado a um `owner_id` (o usuário que o criou) e a um `game_id`, e pode ter uma lista de administradores adicionais.

## Fluxo de Funcionamento
1.  **Criação de Servidor:** Um usuário autenticado pode criar um novo servidor através de um formulário no frontend. A API (`POST /servers`) valida os dados e cria um novo documento na coleção `servers` do Firestore. O criador é automaticamente definido como `owner` e `admin`.
2.  **Visualização de Servidor:** Qualquer pessoa pode visualizar um servidor público acessando a URL `[FRONTEND]/servers/:serverId`.
3.  **Atualização de Servidor:** O proprietário ou um administrador do servidor pode atualizar suas informações (nome, descrição, tags, etc.) através de um formulário. A API (`PATCH /servers/:serverId`) valida a permissão antes de aplicar as mudanças.
4.  **Deleção de Servidor:** Apenas o proprietário pode deletar um servidor. A API (`DELETE /servers/:serverId`) remove o documento do Firestore permanentemente.

## APIs / Interfaces
As seguintes rotas de API foram implementadas no serviço `api`:

*   `POST /servers`
    *   **Descrição:** Cria um novo servidor.
    *   **Proteção:** Requer token de autenticação.
*   `GET /servers/:serverId`
    *   **Descrição:** Retorna os dados públicos de um servidor.
    *   **Proteção:** Nenhuma.
*   `PATCH /servers/:serverId`
    *   **Descrição:** Atualiza um servidor existente.
    *   **Proteção:** Requer autenticação e que o usuário seja proprietário ou administrador.
*   `DELETE /servers/:serverId`
    *   **Descrição:** Deleta um servidor.
    *   **Proteção:** Requer autenticação e que o usuário seja o proprietário.

## Dependências
*   Firestore
*   Firebase Authentication
*   [[Sistema de Autenticação e Perfis]]

## Referências Cruzadas
*   [[Modelagem de Dados]]
*   [[Estrutura do Backend]]

## Histórico de Alterações
*   **2024-07-28:** Implementação inicial dos endpoints CRUD para servidores e da estrutura de permissões (proprietário/admin). 