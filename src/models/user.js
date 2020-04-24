/**
 *  Definição de Modelo de Usuário
 */

const mongoose = require('../database')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Encriptação de senha de maneira assíncrona
// o método pré acontece antes de alguma ação
// ser executada, nesse caso 'save'
UserSchema.pre('save', async function (next) {
  // Esse 10 se refere a quantidade
  // de passagens pela incriptação
  const hash = await bcrypt.hash(this.password, 10)
  this.password = hash

  // Prossegue para a próxima tarefa
  next()
})

const User = mongoose.model('User', UserSchema)

module.exports = User
