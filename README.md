# Email Application CLI

Projeto simples em **Node.js + TypeScript** para enviar emails manualmente pelo terminal usando **Gmail + Nodemailer**.

O projeto foi pensado para envios manuais de candidaturas, currículos, contatos profissionais e follow-ups.

Ele **não possui banco de dados, cron, servidor HTTP ou detecção automática de respostas**.

Nada é enviado sozinho.

Você sempre escolhe manualmente:

- para quem enviar;
- quando enviar;
- qual mensagem usar;
- qual PDF anexar;
- se deseja realmente confirmar o envio.

---

# Fluxo do projeto

O funcionamento é simples:

```text
Cadastrar contatos
      ↓
data/emails.json

Adicionar currículo
      ↓
files/curriculo.pdf

Executar
      ↓
npm run emails

Escolher destinatários
      ↓
1
1,3,5
todos

Revisar
      ↓

Confirmar
      ↓

Gmail + Nodemailer
      ↓

Email enviado
```

---

# 1. Requisitos

Antes de começar, você precisa ter:

- Node.js 20 ou superior;
- npm;
- uma conta Gmail;
- verificação em duas etapas ativada na conta Google;
- uma senha de app do Google;
- o currículo ou outro PDF que deseja enviar.

Recomendado:

```text
Node.js 22
```

Você pode verificar sua versão com:

```bash
node --version
```

E verificar o npm com:

```bash
npm --version
```

---

# 2. Estrutura do projeto

O projeto utiliza aproximadamente esta estrutura:

```text
email-application-cli/
│
├── data/
│   └── emails.json
│
├── files/
│   └── curriculo.pdf
│
├── src/
│   ├── config.ts
│   ├── contacts.ts
│   ├── email-service.ts
│   ├── index.ts
│   ├── selection.ts
│   └── types.ts
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

# 3. Instalar as dependências

Abra o terminal dentro da pasta do projeto.

Por exemplo:

```bash
cd email-application-cli
```

Depois execute:

```bash
npm install
```

O projeto utiliza principalmente:

```text
nodemailer
dotenv
typescript
tsx
```

Se estiver criando o projeto manualmente, as dependências podem ser instaladas com:

```bash
npm install nodemailer dotenv
```

E as dependências de desenvolvimento:

```bash
npm install -D typescript tsx @types/node @types/nodemailer
```

---

# 4. Criar o arquivo `.env`

O arquivo `.env` contém informações privadas utilizadas pelo projeto.

Se existir um arquivo:

```text
.env.example
```

copie ele para:

```text
.env
```

No Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

No CMD:

```cmd
copy .env.example .env
```

Você também pode simplesmente criar manualmente um arquivo chamado:

```text
.env
```

na raiz do projeto.

Ele deverá ficar assim:

```env
GMAIL_USER=seuemail@gmail.com
GMAIL_APP_PASSWORD=sua_senha_de_app
GMAIL_FROM_NAME=Seu Nome
DEFAULT_ATTACHMENT=./files/curriculo.pdf
```

Exemplo:

```env
GMAIL_USER=contactmatheusduart@gmail.com
GMAIL_APP_PASSWORD=abcdefghijklmnop
GMAIL_FROM_NAME=Matheus Duarte
DEFAULT_ATTACHMENT=./files/MATHEUS_DUARTE_CV_TEC.pdf
```

---

# 5. Criar uma senha de app do Gmail

O projeto **não utiliza sua senha normal do Gmail**.

Para permitir que o Nodemailer envie emails pela sua conta, você deve criar uma **Senha de App do Google**.

## Passo 1 — Ativar a verificação em duas etapas

Acesse:

```text
https://myaccount.google.com/security
```

Procure a seção:

```text
Como você faz login no Google
```

Ative:

```text
Verificação em duas etapas
```

Conclua as etapas solicitadas pelo Google.

---

## Passo 2 — Criar a senha de app

Depois de ativar a verificação em duas etapas, acesse:

```text
https://myaccount.google.com/apppasswords
```

O Google poderá solicitar seu login novamente.

No campo para nome do aplicativo, você pode colocar:

```text
Node Email CLI
```

ou:

```text
Nodemailer
```

Clique em:

```text
Criar
```

O Google irá gerar uma senha semelhante a:

```text
abcd efgh ijkl mnop
```

Essa senha é diferente da sua senha normal.

Ela será utilizada apenas pelo projeto.

---

# 6. Adicionar a senha no `.env`

Copie a senha de app e coloque em:

```env
GMAIL_APP_PASSWORD=
```

Exemplo:

```env
GMAIL_APP_PASSWORD=abcdefghijklmnop
```

O projeto pode remover os espaços automaticamente, então tanto:

```text
abcd efgh ijkl mnop
```

quanto:

```text
abcdefghijklmnop
```

podem funcionar dependendo da implementação do `config.ts`.

O recomendado é colocar sem espaços.

---

# 7. Segurança do `.env`

Nunca coloque sua senha normal do Gmail no projeto.

Também nunca publique seu `.env`.

O `.gitignore` deve conter:

```gitignore
.env
```

Recomenda-se também ignorar:

```gitignore
node_modules/
.env
files/*.pdf
```

Exemplo:

```gitignore
node_modules/
.env
files/*.pdf
```

Assim seu currículo e suas credenciais não serão enviados para o GitHub.

---

# 8. Configurar o remetente

No `.env`:

```env
GMAIL_USER=seuemail@gmail.com
GMAIL_FROM_NAME=Seu Nome
```

Por exemplo:

```env
GMAIL_USER=contactmatheusduart@gmail.com
GMAIL_FROM_NAME=Matheus Duarte
```

O destinatário verá aproximadamente:

```text
De: Matheus Duarte <contactmatheusduart@gmail.com>
```

---

# 9. Adicionar o currículo

Coloque seu currículo dentro da pasta:

```text
files/
```

Por exemplo:

```text
files/MATHEUS_DUARTE_CV_TEC.pdf
```

Depois configure o `.env`:

```env
DEFAULT_ATTACHMENT=./files/MATHEUS_DUARTE_CV_TEC.pdf
```

Esse será o PDF padrão utilizado pelos contatos.

---

# 10. Cadastrar os emails

Abra:

```text
data/emails.json
```

O arquivo deve conter uma lista JSON.

Exemplo:

```json
[
  {
    "id": "empresa-x-backend",
    "nome": "João",
    "empresa": "Empresa X",
    "email": "joao@empresa.com",
    "assunto": "Candidatura - Desenvolvedor Backend",
    "mensagem": "Olá João, tudo bem?\n\nGostaria de demonstrar meu interesse na oportunidade de Desenvolvedor Backend.\n\nSegue meu currículo em anexo.\n\nAtenciosamente,\nMatheus Duarte",
    "ativo": true
  }
]
```

---

# 11. Campos do `emails.json`

## `id`

Identificador único do cadastro.

Exemplo:

```json
"id": "eight-vision-backend"
```

Não repita o mesmo ID para dois contatos diferentes.

---

## `nome`

Nome do recrutador ou responsável.

Exemplo:

```json
"nome": "João"
```

Se não souber o nome:

```json
"nome": "Equipe de RH"
```

---

## `empresa`

Nome da empresa.

Exemplo:

```json
"empresa": "Eight Vision"
```

---

## `email`

Email que receberá sua candidatura.

Exemplo:

```json
"email": "rh@empresa.com.br"
```

---

## `assunto`

Assunto do email.

Exemplo:

```json
"assunto": "Back-end Pleno/Sênior"
```

---

## `mensagem`

Corpo do email.

Para criar quebras de linha utilize:

```text
\n
```

Exemplo:

```json
"mensagem": "Olá João, tudo bem?\n\nGostaria de me candidatar à vaga.\n\nSegue meu currículo em anexo.\n\nAtenciosamente,\nMatheus Duarte"
```

---

## `ativo`

Se estiver:

```json
"ativo": true
```

o contato aparece na lista.

Se estiver:

```json
"ativo": false
```

o contato fica escondido sem precisar apagar do JSON.

Isso é útil depois que você não deseja mais enviar para aquela empresa.

---

## `anexo`

Campo opcional.

Se não colocar:

```json
"anexo"
```

o programa usa:

```env
DEFAULT_ATTACHMENT
```

do `.env`.

Por exemplo:

```env
DEFAULT_ATTACHMENT=./files/MATHEUS_DUARTE_CV_TEC.pdf
```

Mas você também pode colocar um currículo específico:

```json
{
  "id": "empresa-y",
  "nome": "Ana",
  "empresa": "Empresa Y",
  "email": "ana@empresa.com",
  "assunto": "Candidatura Backend",
  "mensagem": "Olá Ana...",
  "ativo": true,
  "anexo": "./files/curriculo-backend.pdf"
}
```

---

# 12. Exemplo com vários contatos

Seu `emails.json` pode ter vários:

```json
[
  {
    "id": "empresa-x",
    "nome": "João",
    "empresa": "Empresa X",
    "email": "joao@empresa.com",
    "assunto": "Candidatura - Backend",
    "mensagem": "Olá João, tudo bem?\n\nGostaria de me candidatar à oportunidade.\n\nSegue meu currículo em anexo.\n\nAtenciosamente,\nMatheus Duarte",
    "ativo": true
  },
  {
    "id": "empresa-y",
    "nome": "Maria",
    "empresa": "Empresa Y",
    "email": "maria@empresa.com",
    "assunto": "Candidatura - Node.js Developer",
    "mensagem": "Olá Maria, tudo bem?\n\nGostaria de demonstrar meu interesse na vaga.\n\nSegue meu currículo em anexo.\n\nAtenciosamente,\nMatheus Duarte",
    "ativo": true
  },
  {
    "id": "empresa-z",
    "nome": "Carlos",
    "empresa": "Empresa Z",
    "email": "carlos@empresa.com",
    "assunto": "Desenvolvedor Backend",
    "mensagem": "Olá Carlos, tudo bem?\n\nEstou entrando em contato sobre a oportunidade de Desenvolvedor Backend.\n\nSegue meu currículo em anexo.\n\nAtenciosamente,\nMatheus Duarte",
    "ativo": false
  }
]
```

Nesse caso, Carlos não aparecerá porque:

```json
"ativo": false
```

---

# 13. Executar o projeto

No terminal:

```bash
npm run emails
```

O programa mostrará algo parecido com:

```text
Emails cadastrados:

[1] João — Empresa X
    joao@empresa.com
    Candidatura - Backend

[2] Maria — Empresa Y
    maria@empresa.com
    Candidatura - Node.js Developer

Digite números separados por vírgula, por exemplo: 1,3,5

Ou digite: todos

Quem você deseja enviar hoje? >
```

---

# 14. Enviar para apenas uma pessoa

Digite:

```text
1
```

O programa selecionará apenas:

```text
João — Empresa X
```

---

# 15. Enviar para várias pessoas

Digite:

```text
1,2
```

Também pode ser:

```text
1,3,5
```

---

# 16. Selecionar todos

Digite:

```text
todos
```

O programa selecionará todos os contatos ativos.

---

# 17. Revisar antes do envio

Antes de enviar, o programa exibirá:

```text
────────────────────────────────────────
REVISÃO DO ENVIO
────────────────────────────────────────

1. João — Empresa X
   Para: joao@empresa.com
   Assunto: Candidatura - Backend
   Anexo: C:\...\files\curriculo.pdf

2. Maria — Empresa Y
   Para: maria@empresa.com
   Assunto: Candidatura - Node.js Developer
   Anexo: C:\...\files\curriculo.pdf

Total: 2 email(s).
```

Depois:

```text
Confirmar o envio de TODOS os emails acima? (s/n) >
```

Digite:

```text
s
```

para confirmar.

Qualquer outra resposta pode cancelar o envio dependendo da implementação.

---

# 18. Verificação da conexão com Gmail

Antes de começar a enviar, o programa testa a autenticação:

```text
Verificando conexão com o Gmail... OK ✓
```

Se aparecer:

```text
OK ✓
```

significa que:

- seu email está correto;
- a senha de app está funcionando;
- o Gmail aceitou a autenticação.

---

# 19. Envio

Depois:

```text
Enviando...

Empresa X <joao@empresa.com> ... ENVIADO ✓

Empresa Y <maria@empresa.com> ... ENVIADO ✓
```

O programa também pode mostrar o `Message-ID`:

```text
Message-ID: <abc123@gmail.com>
```

Ao final:

```text
────────────────────────────────────────
Enviados: 2
Falhas:   0
────────────────────────────────────────
```

---

# 20. Caso um email dê erro

Um erro em um destinatário não precisa interromper todos os outros.

Por exemplo:

```text
Empresa X <joao@empresa.com> ... ENVIADO ✓

Empresa Y <emailerrado> ... FALHOU ✗
Motivo: endereço inválido

Empresa Z <ana@empresa.com> ... ENVIADO ✓
```

Resultado:

```text
────────────────────────────────────────
Enviados: 2
Falhas:   1
────────────────────────────────────────
```

---

# 21. Testar antes de enviar para empresas

Antes de utilizar com recrutadores, faça um teste enviando para você mesmo.

No `emails.json`:

```json
[
  {
    "id": "teste-email",
    "nome": "Matheus",
    "empresa": "Teste",
    "email": "seuemail@gmail.com",
    "assunto": "Teste Email CLI",
    "mensagem": "Olá!\n\nEste é um teste do meu projeto Node.js + Nodemailer.\n\nAtenciosamente,\nMatheus Duarte",
    "ativo": true
  }
]
```

Depois:

```bash
npm run emails
```

Escolha:

```text
1
```

Confirme:

```text
s
```

E verifique se o email chegou.

---

# 22. Verificar TypeScript

Para verificar se existem erros de TypeScript:

```bash
npm run check
```

O `package.json` pode possuir:

```json
{
  "scripts": {
    "emails": "tsx src/index.ts",
    "check": "tsc --noEmit"
  }
}
```

Então:

```bash
npm run check
```

deve terminar sem erros.

---

# 23. Exemplo de `package.json`

Uma configuração possível:

```json
{
  "name": "email-application-cli",
  "version": "1.0.0",
  "description": "CLI em Node.js e TypeScript para envio manual de candidaturas por Gmail.",
  "type": "module",
  "scripts": {
    "emails": "tsx src/index.ts",
    "check": "tsc --noEmit"
  },
  "dependencies": {
    "dotenv": "^16.4.5",
    "nodemailer": "^6.9.16"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/nodemailer": "^6.4.16",
    "tsx": "^4.19.0",
    "typescript": "^5.6.0"
  }
}
```

---

# 24. Exemplo de `.env.example`

Crie também:

```text
.env.example
```

com:

```env
GMAIL_USER=seuemail@gmail.com
GMAIL_APP_PASSWORD=sua_senha_de_app
GMAIL_FROM_NAME=Seu Nome
DEFAULT_ATTACHMENT=./files/curriculo.pdf
```

Esse arquivo pode ir para o GitHub porque ele não possui credenciais reais.

---

# 25. `.gitignore`

Use:

```gitignore
node_modules/

.env

files/*.pdf

dist/

.DS_Store
```

Isso impede que:

- credenciais;
- currículo;
- dependências;

sejam publicadas.

---

# 26. Erro de autenticação do Gmail

Se aparecer algo relacionado a:

```text
Invalid login
```

ou:

```text
Username and Password not accepted
```

verifique:

```env
GMAIL_USER=
```

e:

```env
GMAIL_APP_PASSWORD=
```

Confirme também se você criou uma **Senha de App**.

Não utilize sua senha normal.

---

# 27. Se "Senhas de app" não aparecer

Primeiro confirme se a verificação em duas etapas está ativada:

```text
https://myaccount.google.com/security
```

Depois tente:

```text
https://myaccount.google.com/apppasswords
```

Algumas contas corporativas, educacionais ou administradas por organizações podem não permitir senhas de app.

---

# 28. Cuidados para evitar spam

Mesmo utilizando Gmail, não existe garantia de que um email nunca cairá no spam.

Algumas boas práticas:

- não envie dezenas de emails de uma vez;
- personalize as mensagens;
- evite enviar vários emails seguidos para a mesma pessoa;
- evite assuntos como `URGENTE!!!`;
- evite excesso de links;
- utilize mensagens simples;
- envie apenas o currículo necessário;
- use seu nome real;
- mantenha um volume de envio baixo.

Para candidaturas, prefira:

```text
Candidatura — Desenvolvedor Backend | Matheus Duarte
```

em vez de:

```text
URGENTE!!! CURRÍCULO DESENVOLVEDOR!!!
```

---

# 29. Exemplo de mensagem profissional

```json
"mensagem": "Olá, equipe de RH, tudo bem?\n\nGostaria de me candidatar à oportunidade de Desenvolvedor Backend.\n\nTenho experiência com Node.js, TypeScript, APIs REST e integrações entre serviços, além de interesse em arquitetura de software e sistemas distribuídos.\n\nSegue meu currículo em anexo para avaliação.\n\nFico à disposição para conversar sobre minha experiência e sobre a oportunidade.\n\nObrigado pela atenção.\n\nAtenciosamente,\nMatheus Duarte"
```

---

# 30. O que este projeto propositalmente NÃO faz

Este projeto:

- não envia automaticamente;
- não possui cron;
- não possui banco de dados;
- não monitora respostas;
- não acessa sua caixa de entrada;
- não decide quem deve receber;
- não registra histórico permanente;
- não dispara emails sem confirmação;
- não faz scraping de vagas;
- não procura emails automaticamente.

Você mantém o controle de cada execução.

---

# 31. Resumo de uso diário

Depois que tudo estiver configurado, seu uso diário será basicamente:

```bash
npm run emails
```

Depois:

```text
Emails cadastrados:

[1] Empresa A
[2] Empresa B
[3] Empresa C

Quem você deseja enviar hoje? >
```

Você digita:

```text
1,3
```

Revisa:

```text
Empresa A
Empresa C

Total: 2 emails
```

Confirma:

```text
s
```

E o projeto envia.

---

# 32. Resumo da configuração inicial

Na primeira vez:

```text
1. Instalar Node.js
2. Abrir o projeto
3. Rodar npm install
4. Ativar verificação em duas etapas
5. Criar senha de app
6. Criar .env
7. Configurar Gmail
8. Colocar currículo em files/
9. Cadastrar contatos no emails.json
10. Rodar npm run check
11. Rodar npm run emails
12. Testar enviando para você mesmo
```

Depois disso, para os próximos envios, normalmente basta:

```text
editar emails.json
        ↓
npm run emails
        ↓
selecionar
        ↓
confirmar
        ↓
enviar
```