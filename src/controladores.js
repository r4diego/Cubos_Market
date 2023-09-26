// controladores/usuarios.js

const { query } = require("./conexao");
const jwt = require("jsonwebtoken");
const { senhaSegura } = require("./senhaJWT"); 
const bcrypt = require("bcrypt"); 



const gerarToken = (idUsuario) => {
  const token = jwt.sign({ id: idUsuario }, senhaSegura, { expiresIn: "1h" });
  return token;
};




const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha, nome_loja } = req.body;

  try {
    // Validar campos obrigatórios
    if (!nome || !email || !senha || !nome_loja) {
      return res
        .status(400)
        .json({ mensagem: "Todos os campos são obrigatórios." });
    }

    // Verificar se o e-mail já existe no banco de dados
    const verificaEmail = await query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email]
    );
    if (verificaEmail.rows.length > 0) {
      return res.status(400).json({
        mensagem: "Já existe usuário cadastrado com o e-mail informado.",
      });
    }

    // Criptografar a senha
    const senhaCriptografada = await bcrypt.hash(senha, 10); // Cria um hash seguro da senha

    // Cadastrar o usuário no banco de dados
    const inserirUsuario = await query(
      "INSERT INTO usuarios (nome, email, senha, nome_loja) VALUES ($1, $2, $3, $4)",
      [nome, email, senhaCriptografada, nome_loja]
    );

    return res.status(201).end(); // Resposta de sucesso
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ mensagem: "Ocorreu um erro ao cadastrar o usuário." });
  }
};


const loginUsuario = async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Validar campos 
    if (!email || !senha) {
      return res
        .status(400)
        .json({ mensagem: "Email e senha são obrigatórios." });
    }

    // Verificar se o e-mail existe no banco de dados
    const usuario = await query("SELECT * FROM usuarios WHERE email = $1", [
      email,
    ]);

    if (usuario.rows.length === 0) {
      return res
        .status(401)
        .json({ mensagem: "Usuário e/ou senha inválido(s)." });
    }

    // Verificar se a senha é válida
    const senhaValida = await bcrypt.compare(senha, usuario.rows[0].senha);

    if (!senhaValida) {
      return res
        .status(401)
        .json({ mensagem: "Usuário e/ou senha inválido(s)." });
    }

    // Se chegou até aqui, o login foi bem-sucedido
    const token = gerarToken(usuario.rows[0].id);

    res.status(200).json({ token });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ mensagem: "Ocorreu um erro durante o login." });
  }
};

const detalharUsuario = async (req, res) => {
  try {
    // Verificar se o token foi enviado no cabeçalho da requisição
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({
          mensagem:
            "Para acessar este recurso um token de autenticação válido deve ser enviado.",
        });
    }

    // Verificar se o token é válido e decodificá-lo para obter o ID do usuário
    const payload = jwt.verify(token, senhaSegura);

    // Consultar o usuário no banco de dados com base no ID do token
    const usuario = await query(
      "SELECT id, nome, email, nome_loja FROM usuarios WHERE id = $1",
      [payload.id]
    );

    if (usuario.rows.length === 0) {
      return res.status(404).json({ mensagem: "Usuário não encontrado." });
    }

    // Retornar os detalhes do usuário (exceto a senha)
    const dadosUsuario = usuario.rows[0];
    res.status(200).json(dadosUsuario);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ mensagem: "Ocorreu um erro ao obter os detalhes do usuário." });
  }
};

const atualizarUsuario = async (req, res) => {
  const { nome, email, senha, nome_loja } = req.body;

  try {
    // Verificar se o token foi enviado no cabeçalho da requisição
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({
          mensagem:
            "Para acessar este recurso um token de autenticação válido deve ser enviado.",
        });
    }

    // Verificar se o token é válido e decodificá-lo para obter o ID do usuário
    const payload = jwt.verify(token, senhaSegura);

    // Consultar o usuário no banco de dados com base no ID do token
    const usuario = await query("SELECT email FROM usuarios WHERE id = $1", [
      payload.id,
    ]);

    if (usuario.rows.length === 0) {
      return res.status(404).json({ mensagem: "Usuário não encontrado." });
    }

    // Verificar se o novo e-mail já existe no banco de dados para outro usuário
    const verificaNovoEmail = await query(
      "SELECT id FROM usuarios WHERE email = $1 AND id <> $2",
      [email, payload.id]
    );

    if (verificaNovoEmail.rows.length > 0) {
      return res
        .status(400)
        .json({
          mensagem:
            "O e-mail informado já está sendo utilizado por outro usuário.",
        });
    }

    // Criptografar a senha, caso seja fornecida
    let senhaCriptografada = usuario.rows[0].senha; // Mantém a senha anterior se não fornecida

    if (senha) {
      senhaCriptografada = await bcrypt.hash(senha, 10); // Cria um novo hash seguro da senha
    }

    // Atualizar as informações do usuário no banco de dados
    await query(
      "UPDATE usuarios SET nome = $1, email = $2, senha = $3, nome_loja = $4 WHERE id = $5",
      [nome, email, senhaCriptografada, nome_loja, payload.id]
    );

    return res.status(204).end(); // Resposta de sucesso sem conteúdo no corpo
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ mensagem: "Ocorreu um erro ao atualizar o usuário." });
  }
};

const listarProdutos = async (req, res) => {
  try {
    // Verificar se o token foi enviado no cabeçalho da requisição
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({
          mensagem:
            "Para acessar este recurso um token de autenticação válido deve ser enviado.",
        });
    }

    // Verificar se o token é válido e decodificá-lo para obter o ID do usuário
    const payload = jwt.verify(token, senhaSegura);

    // Consultar os produtos associados ao usuário no banco de dados
    const produtos = await query(
      "SELECT * FROM produtos WHERE usuario_id = $1",
      [payload.id]
    );

    return res.status(200).json(produtos.rows);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ mensagem: "Ocorreu um erro ao listar os produtos." });
  }
};

const detalharProduto = async (req, res) => {
  try {
    // Verificar se o token foi enviado no cabeçalho da requisição
    const token = req.headers.authorization?.replace("Bearer ", "");
//const usuario = req.usuario.id;
    if (!token) {
      return res
        .status(401)
        .json({
          mensagem:
            "Para acessar este recurso um token de autenticação válido deve ser enviado.",
        });
    }

    // Verificar se o token é válido e decodificá-lo para obter o ID do usuário
    const payload = jwt.verify(token, senhaSegura);

    // Verificar se o produto existe e pertence ao usuário logado
    const produtoId = req.params.id;
    const produto = await query(
      "SELECT * FROM produtos WHERE usuario_id = $1 AND id = $2",
      [payload.id, produtoId]
    );

    if (produto.rows.length === 0) {
      return res
        .status(404)
        .json({
          mensagem: `Não existe produto cadastrado com ID ${produtoId}.`
        });
    }

      return res.status(200).json(produto.rows[0]);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ mensagem: "Ocorreu um erro ao detalhar o produto." });
  }
};

const cadastrarProduto = async (req, res) => {
  const { nome, quantidade, categoria, preco, descricao, imagem } = req.body;

  try {
    // Verificar se o token foi enviado no cabeçalho da requisição
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({
          mensagem:
            "Para cadastrar um produto, o usuário deve estar autenticado.",
        });
    }

    // Verificar se o token é válido e decodificá-lo para obter o ID do usuário
    const payload = jwt.verify(token, senhaSegura);

    // Validar campos obrigatórios
    if (!nome || !quantidade || !preco || !descricao) {
      return res
        .status(400)
        .json({
          mensagem:
            "Os campos nome, quantidade, preço e descrição são obrigatórios.",
        });
    }

    // Verificar se a quantidade do produto é maior que zero
    if (quantidade <= 0) {
      return res
        .status(400)
        .json({ mensagem: "A quantidade do produto deve ser maior que zero." });
    }

    // Cadastrar o produto associado ao usuário logado
    const inserirProduto = await query(
      "INSERT INTO produtos (usuario_id, nome, quantidade, categoria, preco, descricao, imagem) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [payload.id, nome, quantidade, categoria, preco, descricao, imagem]
    );

    return res.status(201).end(); // Resposta de sucesso
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ mensagem: "Ocorreu um erro ao cadastrar o produto." });
  }
};

const atualizarProduto = async (req, res) => {
  const idProduto = req.params.id;
  const { nome, quantidade, categoria, preco, descricao, imagem } = req.body;

  try {
    // Verificar se o token de autenticação foi enviado no cabeçalho da requisição
    const token = req.headers.authorization;
    if (!token) {
      return res
        .status(401)
        .json({
          mensagem:
            "Para acessar este recurso, um token de autenticação válido deve ser enviado.",
        });
    }

    // Verificar se o token é válido
    jwt.verify(
      token.replace("Bearer ", ""),
      senhaSegura,
      async (err, decoded) => {
        if (err) {
          return res
            .status(401)
            .json({ mensagem: "Token de autenticação inválido." });
        }
        // O token é válido, você pode acessar decoded.id para obter o ID do usuário

        // Verificar se o produto existe no banco de dados
        const verificaProduto = await query(
          "SELECT * FROM produtos WHERE id = $1",
          [idProduto]
        );

        if (verificaProduto.rows.length === 0) {
          return res.status(404).json({
            mensagem: `Não existe produto cadastrado com ID ${idProduto}.`,
          });
        }

        const produto = verificaProduto.rows[0];

        // Verificar se o produto pertence ao usuário logado
        if (produto.usuario_id !== decoded.id) {
          return res.status(403).json({
            mensagem: "Você não tem permissão para atualizar este produto.",
          });
        }

        // Validar campos obrigatórios
        if (!nome || !quantidade || !categoria || !preco || !descricao || !imagem) {
          return res
            .status(400)
            .json({ mensagem: "Todos os campos são obrigatórios." });
        }

        // Atualizar o produto no banco de dados
        const atualizar = await query(
          "UPDATE produtos SET nome = $1, quantidade = $2, categoria = $3, preco = $4, descricao = $5, imagem = $6 WHERE id = $7",
          [nome, quantidade, categoria, preco, descricao, imagem, idProduto]
        );

        return res.status(204).end(); // Resposta de sucesso sem conteúdo no corpo
      }
    );
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ mensagem: "Ocorreu um erro ao atualizar o produto." });
  }
};

const excluirProduto = async (req, res) => {
  const idProduto = req.params.id;

  // Verificar se o token de autenticação foi enviado no cabeçalho da requisição
  const token = req.headers.authorization;
  if (!token) {
    return res
      .status(401)
      .json({
        mensagem:
          "Para acessar este recurso, um token de autenticação válido deve ser enviado.",
      });
  }

  // Verificar se o token é válido
  let decoded;
  try {
    decoded = jwt.verify(token.replace("Bearer ", ""), senhaSegura);
  } catch (err) {
    return res
      .status(401)
      .json({ mensagem: "Token de autenticação inválido." });
  }

  try {
    // Verificar se o produto existe no banco de dados
    const verificaProduto = await query(
      "SELECT * FROM produtos WHERE id = $1",
      [idProduto]
    );

    if (verificaProduto.rows.length === 0) {
      return res.status(404).json({
        mensagem: `Não existe produto para o ID ${idProduto}.`,
      });
    }

    const produto = verificaProduto.rows[0];

    // Verificar se o produto pertence ao usuário logado
    if (produto.usuario_id !== decoded.id) {
      return res.status(403).json({
        mensagem: "Você não tem permissão para excluir este produto.",
      });
    }

    // Excluir o produto do banco de dados
    await query("DELETE FROM produtos WHERE id = $1", [idProduto]);

    return res.status(204).end(); // Resposta de sucesso sem conteúdo no corpo
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ mensagem: "Ocorreu um erro ao excluir o produto." });
  }
};


module.exports = {
  cadastrarUsuario,
  loginUsuario,
  detalharUsuario,
  atualizarUsuario,
  listarProdutos,
  detalharProduto,
  cadastrarProduto,
  atualizarProduto,
  excluirProduto,
}
