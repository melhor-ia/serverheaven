# Sistema de Autenticação e Perfis

## Visão Geral
Este documento descreve o sistema de autenticação e gerenciamento de perfis de usuário para o Server Heaven. O sistema utiliza Firebase Authentication para lidar com o registro e login de usuários e o Firestore para armazenar dados de perfil, seguindo o modelo definido em [[Modelagem de Dados]].

## Entidades e Modelagem
A entidade principal deste sistema é o **User**, conforme detalhado em [[Modelagem de Dados]]. Após a criação de um usuário no Firebase Authentication, um documento correspondente é criado na coleção `users` do Firestore.

## Fluxo de Funcionamento
1.  **Criação de Usuário:** Um usuário se registra através do frontend usando e-mail e senha. O Firebase Authentication cria a conta e dispara a Cloud Function `onUserCreate`.
    *   **`onUserCreate`**: Esta função cria um novo documento na coleção `users` do Firestore com os dados padrão do perfil do usuário.
2.  **Visualização de Perfil:**
    *   Qualquer pessoa pode visualizar um perfil público acessando a URL `[FRONTEND]/profile/:userId`.
    *   Um usuário autenticado pode ver seu próprio perfil em `[FRONTEND]/profile`.
3.  **Atualização de Perfil:**
    *   Um usuário autenticado pode atualizar seu nome de exibição, biografia e URL do avatar através de um formulário em sua página de perfil.

## APIs / Interfaces
As seguintes rotas de API foram implementadas no serviço `api` (Cloud Function):

*   `GET /profile/:userId`
    *   **Descrição:** Retorna os dados públicos do perfil de um usuário.
    *   **Proteção:** Nenhuma.
*   `PATCH /profile`
    *   **Descrição:** Atualiza o perfil do usuário autenticado.
    *   **Proteção:** Requer token de autenticação do Firebase (Bearer Token).

## Dependências
*   Firebase Authentication
*   Firestore
*   Firebase Functions

## Referências Cruzadas
*   [[Modelagem de Dados]]
*   [[Fluxos Principais de Usuário e API]]

## Histórico de Alterações
*   **2024-07-27:** Correção do erro de `serverTimestamp` na criação e atualização de perfis de usuário.
*   **2024-07-26:** Implementação inicial do fluxo de autenticação, criação de perfil via trigger e endpoints de API para obter e atualizar perfis. 