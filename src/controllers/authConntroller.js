const express = require('express')

const User = require('../models/user')

// Usado para definição de rotas
// neste caso para nossos usuários
const router = express.Router()

router.post('/register', async (req, res) => {
  const { email } = req.body

  try {
    // Tratativa para saber se o e-mail já existe
    if (await User.findOne({ email })) {
      return res.status(400).send({ erro: 'Este usuário já existe!' })
    }

    // Pega todos os parâmetros que vem
    // no corpo da requisição
    const user = await User.create(req.body)

    // Para que o password não volte na response
    user.password = undefined

    return res.send({ user })
  } catch (err) {
    res.status(400).send({ erro: 'Oops! O registro falhou!' })
  }
})

// Ou seja, com esta injeção acontecendo aqui
// a aplicação se resolve com a rota: '/auth/register'
// onde o método 'POST' será chamado.
module.exports = (app) => app.use('/auth', router)
