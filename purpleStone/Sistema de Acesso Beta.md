# Sistema de Acesso Beta

**Data de Criação:** 28 de Julho de 2024

---

## 1. Visão Geral

O Sistema de Acesso Beta foi projetado para gerenciar a entrada de novos usuários durante a fase de testes privados da ServerHeaven. Ele cumpre duas funções principais:

1.  **Inscrição de Pioneiros (Beta Testers):** Permite que usuários interessados se inscrevam para obter acesso antecipado à plataforma. Esses usuários, chamados "Pioneiros", têm a oportunidade de fornecer feedback, relatar bugs e ajudar a moldar o desenvolvimento. Em troca, são recompensados com um emblema exclusivo de "Pioneiro" em seu perfil após o lançamento oficial.
2.  **Lista de Notificação:** Oferece uma opção para que outros usuários se cadastrem para receberem uma notificação por e-mail quando a plataforma for lançada publicamente.

O sistema gerencia o fluxo desde a inscrição inicial por e-mail, passando pela verificação de token, até a criação final do perfil de usuário com preferências de contribuição.

---

## 2. Entidades e Modelagem

### 2.1. Firestore: Coleção `beta-access`

O coração do sistema é a coleção `beta-access` no Firestore, onde cada documento representa a inscrição de um usuário.

| Campo                 | Tipo        | Descrição                                                                                                                              |
| --------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `email`               | `string`    | O endereço de e-mail fornecido pelo usuário.                                                                                           |
| `choice`              | `string`    | A escolha do usuário: `feedback` para ser um Pioneiro ou `notify` para apenas ser notificado.                                          |
| `status`              | `string`    | O estado atual da inscrição: `pending`, `completed`, `expired`, `unsubscribed`.                                                        |
| `createdAt`           | `timestamp` | A data e hora em que a inscrição foi criada.                                                                                             |
| `confirmationToken`   | `string`    | Um token criptograficamente seguro, único e de curta duração, usado para verificar o e-mail e autorizar a criação do perfil. É deletado após o uso. |
| `tokenExpiresAt`      | `timestamp` | A data e hora em que o `confirmationToken` expira (geralmente 48 horas após a criação). É deletado após o uso.                            |
| `uid`                 | `string`    | O ID do usuário do Firebase Authentication, vinculado após a conclusão do perfil.                                                      |
| `completedAt`         | `timestamp` | A data e hora em que o perfil foi concluído.                                                                                             |
| `contribution`        | `array`     | Uma lista de strings que representa as áreas em que o Pioneiro deseja contribuir (ex: `server-discovery`, `feedback-bugs`).           |
| `discordUsername`     | `string`    | O nome de usuário do Discord do Pioneiro (opcional).                                                                                  |

### 2.2. Firebase Auth: Custom Claim

-   **`betaPioneer: true`**: Uma `Custom Claim` é adicionada ao usuário no Firebase Authentication quando ele completa com sucesso o perfil de Pioneiro. Isso permite um controle de acesso fácil e a identificação desses usuários em outras partes do sistema.

---

## 3. Fluxo de Funcionamento

O sistema opera principalmente através de dois fluxos distintos, baseados na escolha do usuário no momento da inscrição.

### 3.1. Fluxo 1: Inscrição como Pioneiro (`choice: 'feedback'`)

1.  **Inscrição Inicial:** O usuário submete seu e-mail na página de inscrição beta, escolhendo a opção de ser um Pioneiro.
2.  **Chamada da API:** O frontend chama a Cloud Function `betaSignup`.
3.  **Processamento no Backend:**
    *   A função `betaSignup` valida os dados de entrada.
    *   Gera um `confirmationToken` seguro.
    *   Cria um novo documento na coleção `beta-access` com `status: 'pending'` e o token de confirmação.
    *   Envia um e-mail de boas-vindas para o usuário contendo um link de confirmação para a página de configuração do perfil (`/beta/setup?token=...`). Para garantir a entrega, o sistema utiliza um webhook de backup como fallback ao serviço de e-mail principal.
4.  **Verificação do Usuário:**
    *   O usuário clica no link do e-mail e é direcionado para a página de configuração.
    *   O frontend extrai o token da URL e chama a Cloud Function `verifyBetaToken`.
    *   A função `verifyBetaToken` valida o token, verificando se ele existe, não expirou e se o status é `pending`.
5.  **Criação do Perfil (Frontend Multi-passo):**
    *   **Passo 1: Boas-vindas:** Se o token for válido, uma tela de boas-vindas é exibida.
    *   **Passo 2: Configuração do Perfil:** O usuário seleciona suas áreas de interesse para contribuição e, opcionalmente, insere seu nome de usuário do Discord.
    *   **Passo 3: Autenticação:** O usuário cria sua conta, seja por E-mail/Senha ou via Google Sign-In. O sistema garante que o e-mail da conta criada seja o mesmo do convite.
6.  **Finalização no Backend:**
    *   Após a autenticação bem-sucedida, o frontend chama a Cloud Function `completeBetaProfile`.
    *   A função `completeBetaProfile` executa uma verificação final do token.
    *   Valida se o `uid` do usuário autenticado corresponde ao e-mail do convite.
    *   Atualiza o documento em `beta-access`:
        *   `status` é alterado para `completed`.
        *   O `uid` e as preferências do usuário são salvos.
        *   `confirmationToken` e `tokenExpiresAt` são deletados por segurança.
    *   Define a `Custom Claim` `{ betaPioneer: true }` no registro do usuário no Firebase Auth.
7.  **Conclusão:** Uma tela de agradecimento é exibida, e o usuário pode prosseguir para a plataforma.

### 3.2. Fluxo 2: Pedido de Notificação (`choice: 'notify'`)

1.  **Inscrição Inicial:** O usuário submete seu e-mail, escolhendo a opção de ser notificado no lançamento.
2.  **Processamento:** A função `betaSignup` cria um documento em `beta-access` com `choice: 'notify'`.
3.  **Confirmação:** Um e-mail de agradecimento é enviado, confirmando que o usuário está na lista. Nenhuma ação adicional é necessária.

### 3.3. Fluxo de Cancelamento de Inscrição

1.  **Ação do Usuário:** O usuário clica no link "Unsubscribe" presente em qualquer e-mail enviado pelo sistema.
2.  **Processamento:** O link aciona a Cloud Function `unsubscribe`, passando o token do usuário.
3.  **Atualização:** A função localiza o documento correspondente em `beta-access` e atualiza seu `status` para `unsubscribed`, removendo-o de futuras comunicações.

---

## 4. APIs / Interfaces

### 4.1. Cloud Functions (`functions/src/beta.ts`)

*   **`betaSignup` (Callable):**
    *   **Entrada:** `{ email: string, choice: 'feedback' | 'notify' }`
    *   **Saída:** `{ success: boolean, message: string }`
*   **`verifyBetaToken` (Callable):**
    *   **Entrada:** `{ token: string }`
    *   **Saída:** `{ success: boolean, email: string }` em caso de sucesso.
*   **`completeBetaProfile` (Callable):**
    *   **Entrada:** `{ token: string, uid: string, contribution: string[], discordUsername?: string }`
    *   **Saída:** `{ success: boolean, message: string }`
*   **`unsubscribe` (HTTP Request):**
    *   **Entrada:** URL com query param `?token=<token>`
    *   **Saída:** Página HTML de confirmação.

### 4.2. Frontend

*   **Página de Login Beta (`/platforms/web/src/app/beta/signin/page.tsx`):**
    *   Página dedicada para que usuários beta já registrados possam fazer login.
    *   Verifica se o usuário possui a `Custom Claim` de `betaPioneer` antes de autorizar o acesso.
    *   Interage com o Firebase Authentication para `signInWithEmailAndPassword` e `signInWithPopup`.
*   **Página de Configuração de Perfil Beta (`/platforms/web/src/app/beta/setup/page.tsx`):**
    *   Renderizada quando um usuário acessa a rota com um token de convite válido.
    *   Gerencia a autenticação do usuário e a coleta de preferências através de um fluxo de múltiplos passos.
    *   Interage com as Cloud Functions `verifyBetaToken` e `completeBetaProfile`.

---

## 5. Dependências

*   **Firebase Authentication:** Para login do usuário e gerenciamento de `uid` e `Custom Claims`.
*   **Firestore:** Para persistência dos dados de inscrição.
*   **Firebase Functions:** Para orquestrar a lógica de backend.
*   **Nodemailer:** Para o envio de e-mails transacionais.

---

## 6. Referências Cruzadas

*   Este sistema é o ponto de entrada para usuários que eventualmente serão gerenciados pelo [[Sistema de Autenticação e Perfis]].