// index.js
const express = require('express')
const exphbs = require('express-handlebars')
const mysql = require('mysql2')
const path = require('path') // <<< Certifique-se de ter importado 'path'

const app = express()

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.use(
  express.urlencoded({
    extended: true,
  }),
)

app.use(express.json())

// Configuração para servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public'))) // Serve tudo que está em '06/public/'

// NOVO: Configuração para servir arquivos estáticos da pasta 'IMG'
// Isso fará com que '06/IMG' seja acessível via '/IMG' no navegador.
app.use('/IMG', express.static(path.join(__dirname, 'IMG'))); // <<< AQUI!

app.get('/', function (req, res) {
  res.render('home')
})

app.post('/books/insertbook', function (req, res) {
  const title = req.body.title
  const pageqty = req.body.pageqty

  const query = `INSERT INTO books (title, pageqty) VALUES ('${title}', ${pageqty})`

  conn.query(query, function (err) {
    if (err) {
      console.log(err)
      return res.status(500).send('Erro ao cadastrar livro.') 
    }

    res.redirect('/')
  })
})

app.get('/books', function (req, res) {
  const query = `SELECT * FROM books`

  conn.query(query, function (err, data) {
    if (err) {
      console.log(err)
      return res.status(500).send('Erro ao buscar livros.') 
    }

    const books = data

    console.log(data)

    res.render('books', { books })
  })
})

app.get('/books/:id', function (req, res) {
  const id = req.params.id

  const query = `SELECT * FROM books WHERE id = ${id}`

  conn.query(query, function (err, data) {
    if (err) {
      console.log(err)
      return res.status(500).send('Erro ao buscar livro.') 
    }

    const book = data[0]

    console.log(data[0])

    res.render('book', { book })
  })
})

app.get('/books/edit/:id', function (req, res) {
  const id = req.params.id

  const query = `SELECT * FROM books WHERE id = ${id}`

  conn.query(query, function (err, data) {
    if (err) {
      console.log(err)
      return res.status(500).send('Erro ao buscar livro para edição.') 
    }

    const book = data[0]

    console.log(data[0])

    res.render('editbook', { book })
  })
})

app.post('/books/updatebook', function (req, res) {
  const id = req.body.id
  const title = req.body.title
  const pageqty = req.body.pageqty

  const query = `UPDATE books SET title = '${title}', pageqty = ${pageqty} WHERE id = ${id}`

  conn.query(query, function (err) {
    if (err) {
      console.log(err)
      return res.status(500).send('Erro ao atualizar livro.') 
    }

    res.redirect(`/books/edit/${id}`)
  })
})

app.post('/books/remove/:id', function (req, res) {
  const id = req.params.id

  const query = `DELETE FROM books WHERE id = ${id}`

  conn.query(query, function (err) {
    if (err) {
      console.log(err)
      return res.status(500).send('Erro ao remover livro.') 
    }

    res.redirect(`/books`)
  })
})

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nodemysql',
})

conn.connect(function (err) {
  if (err) {
    console.log(err)
  }

  console.log('Conectado ao MySQL!')

  app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
  })
})