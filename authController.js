var jwt = require('jsonwebtoken');

var config = require('./config.js')
var userStore = require('./db/userStore.js')

function verifyToken(req, res, next) {
  try{
    let token = null
    let wsVerification = false
    if(req.headers){
      token = req.headers['x-access-token']
    } else if (req.upgradeReq && req.upgradeReq.headers){
      token = req.upgradeReq.headers.token
      wsVerification = true
    }
    if(!token){
      if(res.status && res.send){
        return res.status(401).send({
          auth: false,
          message: 'No token provided.'
        })
      } else {
        return console.log('Websocket authentication error')
      }
    }

    jwt.verify(token, config.api_secret, function(error, decoded){
      if(error && wsVerification === false){
        return res.send({
          auth: false,
          message: 'Failed to authenticate token.'
        })
      } else if(error){
        return console.log('Websocket authentication error')
      }
      // do we need to check the expiration manually?
      req.userId = decoded.id;
      next()
    })
  } catch (err){
    console.error('verifyToken:', err)
    res.send({
      'error': 'ERROR while processing request. Please contact the system admin.'
    })
  }
}

async function verifyPermission(req, res, next){
  try{
    if(!req.userId){
      return res.status(401).send({
        auth: false,
        message: 'Invalid user id.'
      })
    }
    let user = await userStore.findById(req.userId)
    let userPermission = user.permission
    if(user.permission === true){
      next()
    } else {
      return res.send({
        auth: false,
        message: 'Invalid permission for user.'
      })
    }
  } catch (err){
    console.error('verifyUserPermission:', err)
    res.send({
      'error': 'ERROR while processing request. Please contact the system admin.'
    })
  }
}

exports.verifyToken = verifyToken
exports.verifyPermission = verifyPermission
