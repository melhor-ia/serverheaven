# Estrutura do Backend com TypeScript

Este documento descreve a estrutura e o fluxo de trabalho para o desenvolvimento do backend do Server Heaven, que utiliza **TypeScript** e **Firebase Cloud Functions**.

## Visão Geral

O código do backend reside no diretório `/functions`. Ele é um projeto Node.js gerenciado pelo `npm` e escrito em TypeScript para garantir um código mais robusto e manutenível.

## Estrutura de Diretórios e Arquivos

A seguir estão os principais arquivos e diretórios dentro de `/functions`:

-   **`/src`**: Este é o diretório mais importante para o desenvolvimento. Todo o código-fonte das suas Cloud Functions deve ser escrito em TypeScript (`.ts`) e colocado aqui.
    -   **`index.ts`**: É o ponto de entrada principal onde as funções são definidas e exportadas.

-   **`/lib`**: Este diretório contém o código JavaScript compilado a partir do diretório `/src`. **Você nunca deve editar os arquivos neste diretório diretamente**, pois eles são gerados automaticamente pelo compilador TypeScript.

-   **`package.json`**: Arquivo padrão do Node.js que gerencia as dependências do projeto (como `firebase-admin`, `firebase-functions`) e os scripts de automação.

-   **`tsconfig.json`**: Arquivo de configuração do TypeScript. Ele define como o seu código `.ts` será compilado para `.js`.

-   **`firebase.json`** (na raiz do projeto): Embora não esteja dentro de `/functions`, este arquivo é crucial. A seção `"functions"` dele está configurada para:
    -   Usar o runtime `nodejs20`.
    -   Apontar para o diretório `functions` como a fonte do código.
    -   Executar um `predeploy` hook que compila automaticamente o código TypeScript antes de cada deploy.

## Fluxo de Desenvolvimento

1.  **Escrever o código**: Adicione ou modifique os arquivos TypeScript no diretório `functions/src`.
2.  **Compilar o código**: Navegue até o diretório `functions` e execute o comando `npm run build`. Isso irá transpilar seu código TypeScript para JavaScript e salvá-lo no diretório `lib`.
3.  **Testar localmente**: Use o comando `npm run serve` (dentro de `functions`) para iniciar os emuladores do Firebase e testar suas funções localmente.

## Deploy

Para fazer o deploy das suas funções para o ambiente do Firebase:

-   Execute o comando `npm run deploy` de dentro do diretório `functions`.

O script de `predeploy` configurado em `firebase.json` garantirá que a versão mais recente do seu código seja compilada antes do envio. 