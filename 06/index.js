// index.js
const express = require('express')
const exphbs = require('express-handlebars')
const mysql = require('mysql2')
const path = require('path')

const app = express()

// Configuração do Handlebars
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

// Middleware para processar dados de formulário (urlencoded)
app.use(
  express.urlencoded({
    extended: true,
  }),
)

// Middleware para processar dados JSON (MUITO IMPORTANTE para AJAX/fetch)
app.use(express.json())

// Configuração para servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public'))) // Serve tudo que está em 'sua_pasta/public/'

// Configuração para servir arquivos estáticos da pasta 'IMG' (se estiver fora de public)
// Isso fará com que 'sua_pasta/IMG' seja acessível via '/IMG' no navegador.
// Certifique-se de que sua imagem de fundo (6714.png) está nesta pasta 'IMG'.
app.use('/IMG', express.static(path.join(__dirname, 'IMG')));

// Rota principal (página de cadastro)
app.get('/', function (req, res) {
  res.render('home') // Assumindo que 'home.handlebars' é seu insert-book.hbs
})

// Rota POST para cadastrar um novo livro
app.post('/books/insertbook', function (req, res) {
  const title = req.body.title
  const pageqty = req.body.pageqty

  // Validação básica
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).render('error', { errorMessage: 'O título do livro é obrigatório.' });
  }
  if (!pageqty || isNaN(parseInt(pageqty)) || parseInt(pageqty) <= 0) {
    return res.status(400).render('error', { errorMessage: 'O número de páginas é obrigatório e deve ser um número positivo.' });
  }

  // PREVENÇÃO DE SQL INJECTION: Use placeholders '?' e passe os valores como array
  const query = `INSERT INTO books (title, pageqty) VALUES (?, ?)`

  conn.query(query, [title, pageqty], function (err) {
    if (err) {
      console.log(err)
      return res.status(500).render('error', { errorMessage: 'Erro interno do servidor ao cadastrar o livro.' });
    }

    res.status(201).render('success', { successMessage: 'Livro cadastrado com sucesso!! A Leitura é uma forma gloriosa de se aprimorar os conhecimentos!!' });
  })
})

// Rota para listar todos os livros
app.get('/books', function (req, res) {
  const query = `SELECT * FROM books`

  conn.query(query, function (err, data) {
    if (err) {
      console.log(err)
      return res.status(500).render('error', { errorMessage: 'Erro ao buscar a lista de livros.' });
    }

    const books = data

    res.render('books', { books })
  })
})

// Rota para detalhes de um livro específico
app.get('/books/:id', function (req, res) {
  const id = req.params.id

  // Validação básica do ID
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).render('error', { errorMessage: 'ID do livro inválido.' });
  }

  // PREVENÇÃO DE SQL INJECTION
  const query = `SELECT * FROM books WHERE id = ?`

  conn.query(query, [id], function (err, data) {
    if (err) {
      console.log(err)
      return res.status(500).render('error', { errorMessage: 'Erro ao buscar detalhes do livro.' });
    }

    if (data.length === 0) {
      return res.status(404).render('error', { errorMessage: 'Livro não encontrado.' });
    }

    const book = data[0]

    res.render('book', { book })
  })
})

// Rota para a página de edição de um livro
app.get('/books/edit/:id', function (req, res) {
  const id = req.params.id

  // Validação básica do ID
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).render('error', { errorMessage: 'ID do livro para edição inválido.' });
  }

  // PREVENÇÃO DE SQL INJECTION
  const query = `SELECT * FROM books WHERE id = ?`

  conn.query(query, [id], function (err, data) {
    if (err) {
      console.log(err)
      return res.status(500).render('error', { errorMessage: 'Erro ao buscar livro para edição.' });
    }

    if (data.length === 0) {
      return res.status(404).render('error', { errorMessage: 'Livro para edição não encontrado.' });
    }

    const book = data[0]

    res.render('editbook', { book })
  })
})

// Rota POST para atualizar um livro
app.post('/books/updatebook', function (req, res) {
  const id = req.body.id
  const title = req.body.title
  const pageqty = req.body.pageqty

  // Validação básica
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).render('error', { errorMessage: 'ID do livro inválido para atualização.' });
  }
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).render('error', { errorMessage: 'O título do livro é obrigatório para atualização.' });
  }
  if (!pageqty || isNaN(parseInt(pageqty)) || parseInt(pageqty) <= 0) {
    return res.status(400).render('error', { errorMessage: 'O número de páginas é obrigatório e deve ser um número positivo para atualização.' });
  }

  // PREVENÇÃO DE SQL INJECTION
  const query = `UPDATE books SET title = ?, pageqty = ? WHERE id = ?`

  conn.query(query, [title, pageqty, id], function (err) {
    if (err) {
      console.log(err)
      return res.status(500).render('error', { errorMessage: 'Erro ao atualizar livro.' });
    }

    res.redirect(`/books/edit/${id}`)
  })
})

// Rota POST para remover um livro
app.post('/books/remove/:id', function (req, res) {
  const id = req.params.id

  // Validação básica do ID
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).render('error', { errorMessage: 'ID do livro inválido para remoção.' });
  }

  // PREVENÇÃO DE SQL INJECTION
  const query = `DELETE FROM books WHERE id = ?`

  conn.query(query, [id], function (err) {
    if (err) {
      console.log(err)
      return res.status(500).render('error', { errorMessage: 'Erro ao remover livro.' });
    }

    res.redirect(`/books`)
  })
})

// === NOVA ROTA PARA LIMPAR TODOS OS LIVROS ===
// Esta rota está no seu código mais recente, mas pode ter sido perdida em alguma etapa anterior.
// Garanta que ela esteja presente.
app.post('/books/clear', function(req, res) {
  // Comando SQL para DELETAR TODOS os registros da tabela 'books'
  // CUIDADO: Este comando é irreversível e removerá TUDO!
  const query = `DELETE FROM books`;

  conn.query(query, function(err) {
    if (err) {
      console.log(err);
      // Se houver erro, renderiza a página de erro estilizada
      return res.status(500).render('error', { errorMessage: 'Erro ao limpar a lista de livros.' });
    }

    // Se a limpeza for bem-sucedida, redireciona de volta para a página de livros (agora vazia)
    res.redirect('/books');
  });
});


// Configuração da conexão com o MySQL
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nodemysql',
})

// Inicia a conexão com o banco de dados e o servidor Express
conn.connect(function (err) {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err)
    process.exit(1);
  }

  console.log('Conectado ao MySQL!')

  app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000')
  })
})