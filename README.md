# Desbravadores POC

Prova de conceito para um quadro Kanban de tarefas do projeto Desbravadores.
O projeto combina uma API Java/Spring Boot para gerenciamento de tarefas com
uma interface React/Vite que permite arrastar tarefas entre colunas.

## Estrutura

```text
poc-dnd/
  back/api-tasks/       API Spring Boot das tarefas
  front/kanban-ui/      Interface Kanban em React
  package.json          Scripts para executar front e back juntos
```

## Tecnologias

- Java 21
- Spring Boot 4
- Spring Data JPA
- H2 Database para execucao local
- Springdoc OpenAPI/Swagger
- React 19
- Vite
- @dnd-kit para drag and drop

## Funcionalidades da POC

- Criacao, consulta, atualizacao e remocao de tarefas.
- Agrupamento das tarefas por status Kanban.
- Atualizacao do status via endpoint dedicado.
- Quadro Kanban com colunas: `A fazer`, `Em andamento`, `Em revisao` e
  `Concluido`.
- Drag and drop no front com persistencia da mudanca de status na API.

## Requisitos

- Node.js
- npm
- Java 21
- Maven, ou uso do wrapper `mvnw.cmd` incluido no backend

## Configuracao local

Arquivos de ambiente e configuracao local nao devem ser versionados. Caso seja
necessario configurar credenciais ou parametros locais, crie os arquivos apenas
na sua maquina.

O backend usa `application.properties` em
`poc-dnd/back/api-tasks/src/main/resources/` para a execucao local. Esse arquivo
esta ignorado pelo Git para evitar envio acidental de configuracoes sensiveis.

Exemplo de configuracao local para H2:

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

Instale as dependencias do orquestrador da POC:

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

Para iniciar front e back em paralelo:

```bash
cd poc-dnd
npm run dev
```

Tambem e possivel executar cada parte separadamente:

```bash
# Backend
cd poc-dnd/back/api-tasks
./mvnw.cmd spring-boot:run

# Frontend
cd poc-dnd/front/kanban-ui
npm run dev
```

URLs principais:

- Frontend: `http://localhost:5173`
- API: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- Console H2: `http://localhost:8080/h2-console`

## Endpoints principais

- `POST /tarefas` cria uma tarefa.
- `GET /tarefas` lista tarefas.
- `GET /tarefas/{id}` busca uma tarefa por ID.
- `PUT /tarefas/{id}` atualiza uma tarefa.
- `DELETE /tarefas/{id}` remove uma tarefa.
- `PATCH /tarefas/{id}/status` altera o status Kanban.
- `GET /tarefas/kanban` lista tarefas agrupadas por coluna.

## Observacoes

- `node_modules`, `dist`, `target`, `.env` e arquivos locais de configuracao
  ficam fora do versionamento.
- O frontend usa proxy do Vite para encaminhar chamadas `/tarefas` para
  `http://localhost:8080`.
- A modelagem e os scripts de banco devem ficar no repositorio
  `Desbravadores-Banco-De-Dados`.
