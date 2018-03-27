var rp = require('request-promise-native')
var config = require('../config.js')

async function createUser(user){
  let options = {
    method: 'POST',
    uri: config.apiServerAddress+'/users/createUser',
    form: {
      email: user.email,
      password: user.password
    },
    json: true,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  try{
    return await rp(options)
  } catch(err){
    console.log('ERROR:', err)
  }
}

async function login(user){
  let options = {
    method: 'POST',
    uri: config.apiServerAddress+'/users/login',
    form: {
      email: user.email,
      password: user.password
    },
    json: true,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  try{
    return await rp(options)
  } catch(err){
    console.log('ERROR:', err)
  }
}

module.exports.createUser = createUser
module.exports.login = login
