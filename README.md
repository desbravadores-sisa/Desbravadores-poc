# Desbravadores POC

Repositorio de prova de conceito para validar a experiencia de um quadro
Kanban de tarefas do projeto Desbravadores.

Este repositorio nao e o backend principal do sistema. A API oficial fica no
repositorio `Desbravadores-BackEnd-Java`, dentro da pasta `APIDesbravadores`.

## Estrutura

```text
poc-dnd/
  back/api-tasks/       API Spring Boot experimental de tarefas
  front/kanban-ui/      Interface Kanban em React/Vite
  repos/                Submodules com backend oficial e banco
  package.json          Scripts para executar front e API oficial juntos
```

## Objetivo

- Provar o fluxo visual de tarefas em Kanban.
- Reaproveitar o fluxo da SPA Tigre da Montanha em React.
- Testar drag and drop com `@dnd-kit`.
- Validar login por perfil consumindo a `APIDesbravadores`.
- Servir como referencia para a integracao dos endpoints de tarefas no backend
  principal.

## Tecnologias

- Java 21
- Spring Boot 4
- Spring Data JPA
- H2 para execucao local da POC
- Springdoc OpenAPI/Swagger
- React 19
- Vite
- `@dnd-kit`

## Organizacao do front

O front da POC separa responsabilidades em:

- `src/services/api.js`: chamadas HTTP para a `APIDesbravadores`.
- `src/utils/`: normalizacao de papeis, senha e dados do Kanban.
- `src/components/`: telas e componentes visuais reutilizaveis.
- `src/constants.js`: constantes compartilhadas do fluxo da POC.

## Funcionalidades

- Criacao, consulta, atualizacao e remocao de tarefas.
- Agrupamento por status Kanban.
- Atualizacao de status por endpoint dedicado.
- Quadro com as colunas `A fazer`, `Em andamento`, `Em revisao` e
  `Concluido`.
- Drag and drop no front com chamada para persistir a mudanca de status.
- Login via `POST /usuarios/login`.
- Cadastro via `POST /usuarios/cadastro`.
- Diretor acessa o painel de unidades.
- Conselheiro acessa o quadro Kanban.
- Logoff via `POST /usuarios/logoff`.

## Configuracao local

Arquivos de ambiente e configuracao local nao devem ser versionados.

O backend da POC pode usar um `application.properties` local em:

```text
poc-dnd/back/api-tasks/src/main/resources/application.properties
```

Esse arquivo fica fora do Git. Exemplo para H2 local:

```properties
spring.application.name=api-tasks
spring.datasource.url=jdbc:h2:mem:desbravadoresdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

## Instalacao

Instale as dependencias do orquestrador:

```bash
cd poc-dnd
npm install
```

Instale as dependencias do front:

```bash
cd front/kanban-ui
npm install
```

## Como executar

Depois de clonar, inicialize os submodules:

```bash
git submodule update --init --recursive
```

Configure o `.env` da API oficial em:

```text
poc-dnd/repos/Desbravadores-BackEnd-Java/APIDesbravadores/.env
```

Para iniciar o front e a API oficial em paralelo:

```bash
cd poc-dnd
npm run dev
```

Tambem e possivel executar separadamente:

```bash
# API oficial
cd poc-dnd/repos/Desbravadores-BackEnd-Java/APIDesbravadores
./mvnw.cmd spring-boot:run

# Frontend
cd poc-dnd/front/kanban-ui
npm run dev
```

URLs:

- Frontend: `http://localhost:5173`
- API oficial esperada pelo proxy: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger-ui.html`

## Endpoints usados pela POC

```http
POST   /usuarios/login
POST   /usuarios/cadastro
POST   /usuarios/logoff
GET    /unidades/diretor
POST   /tarefas
GET    /tarefas
GET    /tarefas/{id}
PUT    /tarefas/{id}
DELETE /tarefas/{id}
PATCH  /tarefas/{id}/status
GET    /tarefas/kanban
```

## Banco de dados

Este repositorio referencia o banco oficial por submodule:

```text
poc-dnd/repos/Desbravadores-Banco-De-Dados
```

## Observacoes

- `node_modules`, `dist`, `target`, `.env` e arquivos locais de configuracao
  ficam fora do versionamento.
- O frontend usa proxy do Vite para encaminhar chamadas `/usuarios`,
  `/unidades` e `/tarefas` para `http://localhost:8080`.
- Mudancas definitivas de backend devem ser feitas na `APIDesbravadores`, nao
  neste repositorio de POC.
- A API experimental antiga ainda existe em `poc-dnd/back/api-tasks` e pode ser
  executada com `npm run dev:legacy`.
