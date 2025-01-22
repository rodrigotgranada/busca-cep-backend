# Busca CEP Backend

Este é um backend desenvolvido em Node.js com o framework NestJS para fornecer informações de CEP usando múltiplos provedores. Ele também possui endpoints para verificar a saúde da aplicação e expor métricas no formato Prometheus.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript.
- **NestJS**: Framework para construção de aplicações backend.
- **Prometheus**: Para coleta de métricas.
- **Docker**: Containerização da aplicação.
- **Jest**: Para testes unitários e E2E.

## Estratégia Utilizada, Arquitetura e Padrões
A estratégia para a criaçãp da aplicação foi priorizar modularidade, clareza e confiabilidade. Conforme os requisitos do teste em questão, foi identificado como principal funcionalidade a consulta de CEP e a integração com um backend para comunicação com a API. Foi optado pelo uso do React para o desenvolvimento do frontend por sua flexibilidade e conhecimento prévio.

A abordagem utilizada foi modular, segmentando a aplicação em componentes reutilizáveis, como o UserCard, o Offcanvas, o TextInput e o Header. Essa divisão não apenas facilitou a manutenção do código, mas também garantiu um fluxo de trabalho ágil e organizado. Também foram implementamos testes automatizados, abrangendo tanto testes unitários quanto end-to-end (E2E).

A integração com o backend foi estruturada para ser eficiente e escalável. Centralizando as chamadas à API em um módulo próprio, o fetchWithAuth, promovendo clareza e evitando duplicação de código. Essa abordagem facilita futuras manutenções ou expansões.

Para a estilização, foi utilizado o TailwindCSS, que proporcionou uma base consistente e acelerou o desenvolvimento das interfaces. No gerenciamento de estado, foi utilizado o useState e a Context API, garantindo uma arquitetura simples e eficiente. Junto com os princípios de Clean Code, foi utilizado nomes de variáveis e funções que fossem autoexplicativos, mantendo o código claro e de fácil leitura.

Finalizando, foi configurado para que a aplicação possa rodar em um ambiente Docker. Foi criada uma imagem Docker que facilita a distribuição e o deploy da aplicação em diferentes ambientes, garantindo a consistência entre desenvolvimento, teste e produção. Toda essa estratégia resultou em uma aplicação bem estruturada, confiável e fácil de manter.

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

1. **Acessar root do projeto:**
 ```bash
    cd ${PATH}/busca-cep-backend
   ```

2. **Build e execução:**

   ```bash
   docker-compose up --build
   ```

3. **Acesse a aplicação:**

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

## Usuário Mockado para teste

- **Usuário**:
 ```bash
admin
```
- **Senha**: 
```bash
password123
```

## Processo HTTP (Client/Server)
Quando um usuário digita uma URL no navegador, como http://www.netshoes.com.br, e pressiona enter, vários processos ocorrem para que a página seja exibida. Esse fluxo pode ser dividido em etapas:

O navegador verifica se o endereço digitado é uma URL válida. Caso seja, ele inicia uma consulta dns para traduzir o nome de domínio www.netshoes.com.br em um endereço ip... Esse endereço ip é utilizado para localizar o servidor onde o site está hospedado. a busca pelo dns pode ser resolvida localmente (cache) ou através de servidores dns externos.

agora com o endereçco ip,  o navegador inicia uma conexão com o servidor usando o protocolo http (https). Com uma conexão tcp com o servidor do endereço ip encontrado, geralmente na porta 80 para http ou 443 para https.

com isso, o navegador envia uma requisição http ao servidor. Essa requisição contém informações como o método (GET, POST, PUT ...), o cabeçalho com vários detalhes, um deles,  o caminho do recurso solicitado (por exemplo, / para a página inicial).

com todas essas informações, o servidor, ao receber essa requisição, processa o pedido. Em seguida, o servidor responde com um código de status http (200 OK para indicar sucesso) e os dados solicitados.

com a responsta o navegador recebe a resposta e inicia o processo de renderização. Ele recebe as informções e faz novas requisições para carregar recursos adicionais, como css, scripts e imagens, utilizando urls encontradas no documento.

Enquanto os recursos são baixados, o navegador constrói o DOM e aplica os estilos e comportamentos definidos nos arquivos de CSS e scripts. Finalmente, ele renderiza a página para o usuário.

Para ilustar esse processo gerei um PlantUml (https://www.plantuml.com/plantuml/uml) onde sintetiza o processo como um todo:

![Diagrama HTTP](https://raw.githubusercontent.com/rodrigotgranada/busca-cep-backend/main/PlantUml.png)
