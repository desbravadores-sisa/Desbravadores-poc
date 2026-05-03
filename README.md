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
  package.json          Scripts para executar o front da POC
```

## Objetivo

- Provar o fluxo visual de tarefas em Kanban.
- Reaproveitar a experiencia visual da SPA `Tigre da Montanha`.
- Testar drag and drop com `@dnd-kit`.
- Validar login e Kanban consumindo a `APIDesbravadores`.
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

## Funcionalidades

- Criacao, consulta, atualizacao e remocao de tarefas.
- Agrupamento por status Kanban.
- Atualizacao de status por endpoint dedicado.
- Quadro com as colunas `A fazer`, `Em andamento`, `Em revisao` e
  `Concluido`.
- Drag and drop no front com chamada para persistir a mudanca de status.
- Login via `POST /usuarios/login` antes de acessar o Kanban.
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

Antes de iniciar o front, execute a API oficial em outro terminal:

```bash
cd ../Desbravadores-BackEnd-Java/APIDesbravadores
./mvnw.cmd spring-boot:run
```

Depois inicie a POC:

```bash
cd poc-dnd
npm run dev
```

Tambem e possivel executar apenas o front diretamente:

```bash
cd poc-dnd/front/kanban-ui
npm run dev
```

O backend experimental antigo ainda pode ser iniciado com `npm run dev:back`,
mas ele nao possui os endpoints de usuarios usados pelo login da SPA.

URLs:

- Frontend: `http://localhost:5173`
- API oficial esperada pelo proxy: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger-ui.html`

## Endpoints usados pela POC

```http
POST   /usuarios/login
POST   /usuarios/logoff
POST   /tarefas
GET    /tarefas
GET    /tarefas/{id}
PUT    /tarefas/{id}
DELETE /tarefas/{id}
PATCH  /tarefas/{id}/status
GET    /tarefas/kanban
```

## Banco de dados

Este repositorio nao deve conter scripts, dumps ou modelagem de banco.

A modelagem e os scripts atualizados ficam no repositorio:

```text
Desbravadores-Banco-De-Dados
```

## Observacoes

- `node_modules`, `dist`, `target`, `.env` e arquivos locais de configuracao
  ficam fora do versionamento.
- O frontend usa proxy do Vite para encaminhar chamadas `/usuarios` e
  `/tarefas` para `http://localhost:8080`.
- Mudancas definitivas de backend devem ser feitas na `APIDesbravadores`, nao
  neste repositorio de POC.
