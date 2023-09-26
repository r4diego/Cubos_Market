const express = require("express");
const { cadastrarUsuario, loginUsuario, detalharUsuario, atualizarUsuario, listarProdutos, cadastrarProduto, atualizarProduto, detalharProduto, excluirProduto } = require("./controladores"); // Importe a função para cadastrar usuário do arquivo controladores/usuarios.js
const router = express.Router();

// Rota para cadastrar usuario
router.post("/usuario", cadastrarUsuario);

// Rota para fazer login do usuario
router.post('/login', loginUsuario);

// Rota para Detalhar usuario logado
router.get('/usuario', detalharUsuario)

//Rota para atualizar usuario logado
router.put('/usuario', atualizarUsuario)




//Rota para listar produtos associados ao usuario logado
router.get('/produtos', listarProdutos)

//Rota para detalhar um produto associado ao usuario logado
router.get('/produtos/:id', detalharProduto)

//Rota para cadastrar um produto associando ao usuario logado
router.post('/produtos', cadastrarProduto)

//Rota para atualizar produto associado ao usuario logado
router.put('/produtos/:id', atualizarProduto)

//Rota para excluir produto associado ao usuario logado
router.delete('/produtos/:id', excluirProduto)




module.exports = router;
