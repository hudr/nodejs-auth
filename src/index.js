const express = require('express')
const bodyParser = require('body-parser')

// Instancia a aplicação
const app = express()

// Entender json
app.use(bodyParser.json())

// Entender parâmetros via URL
app.use(bodyParser.urlencoded({ extended: false }))

// Importação de Controllers para utilizar
// nossas rotas dentro do express.

// Injeção de dependência no controller
// para poder utilizar o app internamente
// pois estaremos rodando um só servidor.
require('./controllers/authConntroller')(app)

// Rota de exemplo para validação de JWT
require('./controllers/projectController')(app)

app.get('/', (req, res) => {
  res.send('Estou rodando.')
})

// Desativa o X-Powered-By: Express
app.disable('x-powered-by')

// Onde estou sendo servido?
app.listen(3000, () => {
  console.log('Aplicação rodando na porta 3000')
})
