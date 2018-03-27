var express = require('express')
var app = express()

var UserAPI = require('./userAPI.js')

app.use('/users', UserAPI)

app.get('/isAPIRunning', (req, res) => {
  res.send({
    result: true
  })
})

module.exports = app
