var app = require('./app.js')
var config = require('./config.js')

var port = process.env.MOCK_DB_PORT || config.port

let server = app.listen(port, function() {
  console.log('Express server listening on port ' + port)
})
