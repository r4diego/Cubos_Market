
# Market Cubos

Projeto desenvolvido para um ecomerce, que faz parte do desafio do modulo 3 do curso de desenvolvimento de software backend da cubos academy


## Autores

- [@Diego rafael Goetz Poersch](https://github.com/r4diego)


## Funcionalidades

- Fazer Login
- Cadastrar Usuario
- Detalhar Usuario
- Editar Usuario
- Listar Produtos
- Detalhar Produtos
- Cadastrar Produtos
- Editar Produtos
- Remover Produtos
## Instalação

Instale as dependencias utilizando o seguinte comando no terminal:

```bash
  npm install
```
    
   ## Criacao do bando de dados

 execute as querys presentes no arquivo query.sql, utilizando o aplicativo Beekeeper

 ```bash
CREATE DATABASE market_cubos;

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255),
    nome_loja VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    senha VARCHAR(255)
);

CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id),
    nome VARCHAR(255),
    quantidade INT,
    categoria VARCHAR(255),
    preco NUMERIC,
    descricao TEXT,
    imagem VARCHAR(255)
);
```

## Configuração do Banco de dados 

insira os dados de conexao com o banco de dados no arquivo conexao
segue exemplo:

```bash
const pool = new Pool({
  user: "postgres",
  host: "192.168.2.5",
  database: "market_cubos",
  password: "123456",
  port: 5432,
});
```
## Rodando localmente

Clone o projeto

```bash
  git clone https://github.com/r4diego/desafio-alternativo-dbe-t02
```

Entre no diretório do projeto

```bash
  cd desafio-alternativo-dbe-t02
```

Instale as dependências

```bash
  npm install
```

Inicie o servidor

```bash
  npm run dev
```


## Stack utilizada


**Back-end:** Node, Express, PostgressSQL


## Screenshots

![Banco de dados]("https://imgur.com/cq1kJUR")

![conexao com banco de dados]("https://imgur.com/hzbN3Tv")



## Como usar cada rota

Cadastrar usuario:

Use o verbo POST e a rota '/usuario'

no body da requisicao deve conter um objeto com as seguintes propriedades:
   
```bash
    -   nome
    -   email
    -   senha
    -   nome_loja


    Exemplo de requisição

// POST /usuario
{
    "nome": "José",
    "email": "jose@lojadasflores.com.br",
    "senha": "j1234",
    "nome_loja": "Loja das Flores"
}
```

Login:

Use o verbo POST e a rota '/login'

no body da requisicao deve conter um objeto com as seguintes propriedades:

```bash
  - email
  - senha

    Exemplo de requisição

// POST /login
{
    "email": "jose@lojadasflores.com.br",
    "senha": "j1234"
}
  ```

  após o login o servidor ira retorna um token de acesso valido por 1 hora, que devera ser utilizado para acessar todas as demais rotas

  exemplo de token:

  ```bash
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNjk1NTcyMzQzLCJleHAiOjE2OTU1NzU5NDN9.puwJpqz63o8Js0kHK9nFT3YY_9oWCnHSpjirjE62fMk
  ```

  ## Detalhar usuario

  Use o verbo GET e a rota '/usuario' e insira o token de acesso na aba de autenticação

  Esta rota nao necessita de nenhuma informação adicional

  exemplo de resposta do servidor:

  ```bash
{
    "id": 1,
    "nome": "José",
    "email": "jose@lojadasflores.com.br",
    "nome_loja": "Loja das Flores"
}
  ```

  ## Atualizar usuario

  Use o verbo PUT e a rota '/usuario' e insira o token de acesso na aba de autenticação

  O body da requisicao deve conter um objeto com as seguintes propriedades:

  ```bash
    -   nome
    -   email
    -   senha
    -   nome_loja

    exemplo de requisicao:

    {
    "nome": "José de Abreu",
    "email": "jose_abreu@gmail.com",
    "senha": "j4321",
    "nome_loja": "Loja das Flores Cheirosas"
}
  ```

  Esta rota nao retorna nada ao editar alguma informação do usuario


  ## Listar produtos

  Use o verbo GET e a rota '/produtos' e insira o token de acesso na aba de autenticação

  esta rota nao necessita de nenhuma informação adicional

  esta rota exibe apenas produtos relacionados ao id do usuario logado

  exemplo de resposta do servidor:

  ```bash
 [
    {
        "id": 1,
        "usuario_id": 1,
        "nome": "Camisa preta",
        "quantidade": 12,
        "categoria": "Camisas",
        "preco": 4990,
        "descricao": "Camisa de malha com acabamento fino.",
        "imagem": "https://bit.ly/3ctikxq",
    },
    {
        "id": 2,
        "usuario_id": 1,
        "nome": "Calça jeans azul",
        "quantidade": 8,
        "categoria": "Calças",
        "preco": 4490,
        "descricao": "Calça jeans azul.",
        "imagem": "https://bit.ly/3ctikxq",
    },
  ```

  ## Detalhar produtos

  Use o verbo GET e a rota '/produtos/:id'(onde id é o id do produto desejado) e insira o token de acesso na aba de autenticação

  esta rota exibe apenas produtos relacionados ao id do usuario logado

  esta rota nao necessita de nenhuma informação adicional

  exemplo de resposta do servidor:

  ```bash
{
    "id": 1,
    "usuario_id": 1,
    "nome": "Camisa preta",
    "quantidade": 8,
    "categoria": "Camisa",
    "preco": 4990,
    "descricao": "Camisa de malha com acabamento fino.",
    "imagem": "https://bit.ly/3ctikxq"
}
  ```

  ## Cadastrar produtos

  Use o verbo POST e a rota '/produtos' e insira o token de acesso na aba de autenticação

  esta rota anexa ao produto cadastrado o id do usuario, para que apenas o mesmo possa obter ou alterar inforções do produtos

o body da requisição deve conter um objeto com as seguintes propriedades:

  ```bash
  -   nome
    -   quantidade
    -   categoria
    -   preco
    -   descricao
    -   imagem

    exemplo de requisição:

{
    "nome": "Camisa preta",
    "quantidade": 8,
    "categoria": "Camisa",
    "preco": 4990,
    "descricao": "Camisa de malha com acabamento fino.",
    "imagem": "https://bit.ly/3ctikxq"
}
  ```

  esta rota nao retorna nada ao Cadastrar um produto

  ## Atualizar produtos

  Use o verbo PUT e a rota '/produtos/:id'(onde id é o id do produto desejado) e insira o token de acesso na aba de autenticação

 O body da requisicao deve conter um objeto com as seguintes propriedades:

  ```bash
    -   nome
    -   quantidade
    -   categoria
    -   preco
    -   descricao
    -   imagem

    exemplo de requisicao:

   {
    "nome": "Calça jeans preta",
    "quantidade": 22,
    "categoria": "Calças",
    "preco": 4490,
    "descricao": "Calça jeans preta.",
    "imagem": "https://bit.ly/3ctikxq"
}
  ```
Esta rota nao retorna nada ao Atualizar um produto

## Excluir produto

Use o verbo DELETE e a rota '/produtos/:id'(onde id é o id do produto a ser excluido) e insira o token de acesso na aba de autenticação

Esta rota nao necessita de nenhuma informação adicional e tambem nao exibe nada ao excluir um produto










