# Busca CEP Backend

Este é um backend desenvolvido em Node.js com o framework NestJS para fornecer informações de CEP usando múltiplos provedores. Ele também possui endpoints para verificar a saúde da aplicação e expor métricas no formato Prometheus.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript.
- **NestJS**: Framework para construção de aplicações backend.
- **Prometheus**: Para coleta de métricas.
- **Docker**: Containerização da aplicação.
- **Jest**: Para testes unitários e E2E.

## Requisitos

- Node.js (v18 ou superior)
- Docker e Docker Compose (para execução com Docker)

## Configuração do Projeto

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/rodrigotgranada/busca-cep-backend.git
   cd busca-cep-backend
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Inicie a aplicação:**

   ```bash
   npm run start
   ```

4. **Acesse a aplicação:**

   - API: `http://localhost:3000`
   - Documentação Swagger: `http://localhost:3000/api-docs`

## Endpoints

### 1. **Busca de CEP**

- **Endpoint:** `POST /cep/{cep}`
- **Entrada:**
  ```json
  {
    "cep": "12345678"
  }
  ```
- **Saída esperada:**
  ```json
  {
    "data": {
      "cep": "12345678",
      "state": "SP",
      "city": "São Paulo",
      "neighborhood": "Centro",
      "street": "Rua Exemplo",
      "service": "via-cep"
    },
    "status": 1,
    "message": "CEP encontrado com sucesso."
  }
  ```

### 2. **Saúde da Aplicação**

- **Endpoint:** `GET /health`
- **Saída esperada:**
  ```json
  {
    "status": "ok",
    "info": {
      "external-service": {
        "status": "up"
      }
    },
    "error": {}
  }
  ```

### 3. **Métricas**

- **Endpoint:** `GET /metrics`
- **Saída esperada:** Texto com métricas no formato Prometheus.

## Testes

### Executar os Testes Unitários

```bash
npm run test
```

### Executar os Testes E2E

```bash
npm run test:e2e
```

## Dockerização

### Requisitos

- Docker e Docker Compose instalados

### Como Executar com Docker

1. **Build e execução:**

   ```bash
   docker-compose up --build
   ```

2. **Acesse a aplicação:**

   - API: `http://localhost:3000`
   - Documentação Swagger: `http://localhost:3000/api-docs`

### Arquivos Docker

**Dockerfile:**

```dockerfile

FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start"]
```

**docker-compose.yml:**

```yaml
version: '3.8'
services:
  backend:
    build:
      context: .
    ports:
      - '3000:3000'
    environment:
      NODE_ENV: development
    volumes:
      - .:/app
      - /app/node_modules
```
