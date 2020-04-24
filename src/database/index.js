/**
 * Responsável pela conexão com o BD
 */
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/nodeauth', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
})

mongoose.Promise = global.Promise

module.exports = mongoose
