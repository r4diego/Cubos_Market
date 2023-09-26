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











