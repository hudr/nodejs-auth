const jwt = require('jsonwebtoken')
const authConfig = require('../config/auth')

module.exports = (req, res, next) => {
  // Autorização que vem na request
  const authHeader = req.headers.authorization

  // Tratativa de Token inexistente
  if (!authHeader) {
    return res.status(401).send({ erro: 'O token não foi informado!' })
  }

  // Bearer 312321ddav2213
  const parts = authHeader.split(' ')

  if (!(parts.length === 2)) {
    return res.status(401).send({ erro: 'Erro no token!' })
  }

  // Desestruturação para pegar as partes do Token
  // Bearer | Hash
  const [scheme, token] = parts

  // Regex
  // ^ = Início
  // Bearer = palavra
  // $ = final
  // / = para terminar
  // i = case insensitive
  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).send({ erro: 'Token mal formatado!' })
  }

  jwt.verify(token, authConfig.secret, (err, decoded) => {
    // Se chegou erro é porque o token
    // foi enviado mas não bateu com o secret
    if (err) {
      return res.status(401).send({ erro: 'Token inválido!' })
    }

    // Quando o token foi gerado
    // passamos o Id por isso pegamos aqui
    req.userId = decoded.id

    // Passar para próxima tarefa
    return next()
  })
}
