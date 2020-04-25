const express = require('express')
const bcrypt = require('bcryptjs')

// Autenticação
const jwt = require('jsonwebtoken')
const authConfig = require('../config/auth')

const User = require('../models/user')

// Usado para definição de rotas
// neste caso para nossos usuários
const router = express.Router()

// Como iremos utilizar o token
// em mais de um lugar, o ideal
// é atribuir isto a uma função
function generateToken(params = {}) {
  // Geração de JWT
  // Primeiro parâmetro, algo que nunca se repete
  // neste caso utilizaremos o ID do usuário
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400,
  })
}

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

    return res.send({ user, token: generateToken({ id: user.id }) })
  } catch (err) {
    res.status(400).send({ erro: 'Oops! O registro falhou!' })
  }
})

router.post('/authenticate', async (req, res) => {
  const { email, password } = req.body

  // Nesse caso precisamos requisitar o campo
  // que veio default do Scheema como 'false'
  const user = await User.findOne({ email }).select('+password')

  // Tratativa de usuário inexistente
  if (!user) {
    return res.status(400).send({ erro: 'Usuário não encontrado!' })
  }

  // Bcrypt retorna uma Promise por isso o await
  // Neste caso verificamos se a senha está correta
  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(400).send({ erro: 'Senha inválida!' })
  }

  // Para que o password não volte na response
  user.password = undefined

  // Retorna o usuário caso tenha sido sucesso!
  res.send({ user, token: generateToken({ id: user.id }) })
})

// Ou seja, com esta injeção acontecendo aqui
// a aplicação se resolve com a rota: '/auth/register'
// onde o método 'POST' será chamado.
module.exports = (app) => app.use('/auth', router)
