var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser')
var jwt = require('jsonwebtoken')
var bcrypt = require('bcryptjs')

var config = require('./config.js')
var userStore = require('./db/userStore.js')
var checkParams = require('./util.js').checkParams
var verifyToken = require('./authController.js').verifyToken
var verifyPermission = require('./authController.js').verifyPermission

router.use(bodyParser.urlencoded({extended: true}))
router.use(bodyParser.json())

router.post('/createUser', async function(req, res){
  try{
    await checkParams(req.body, ['email', 'password'])
    let hashedPassword = bcrypt.hashSync(req.body.password, 8)

    let user = await userStore.createUser({
      email: req.body.email,
      hashedPassword
    })

    let token = jwt.sign({id: user._id}, config.api_secret, {
      expiresIn: 86400
    })

    res.send({
      email: user.email,
      timestamp: user.timestamp,
      auth: true,
      token
    })
  } catch (err) {
    console.error('route createUser:', err)
    res.send({
      'error': 'ERROR while processing request. Please contact the system admin.'
    })
  }
})

router.post('/login', async function(req, res){
  try{
    await checkParams(req.body, ['email', 'password'])
    let user = await userStore.findByEmail(req.body.email)
    
    if (!user){
      return res.status(401).json({error: 'User not found.'})
    }

    let passwordIsValid = bcrypt.compareSync(req.body.password, user.hashedPassword)
    if (!passwordIsValid){
      return res.status(401).json({error: 'ERROR invalid email and password combination.'})
    }

    let token = jwt.sign({id: user._id}, config.api_secret, {
      expiresIn: 86400
    })

    res.send({
      auth: true,
      token
    })
  } catch (error){
    res.status(500).json({error})
  }
})

router.get('/verifyToken', verifyToken, async function(req, res){
  try{
    res.send({
      auth: true,
      userId: req.userId
    })
  } catch (err){
    console.error('route verifyToken:', err)
    res.send({
      'error': 'ERROR while processing request. Please contact the system admin.'
    })
  }
})

router.post('/verifyPermission', verifyToken, verifyPermission, async function(req, res){
  try{
    res.send({
      permission: true,
      userId: req.userId
    })
  } catch (err){
    console.error('route verifyPermission:', err)
    res.send({
      'error': 'ERROR while processing request. Please contact the system admin.'
    })
  }
})

router.post('/grantPermission', verifyToken, verifyPermission, async function(req, res){
  try{
    await checkParams(req.body, ['email'])
    let user = await userStore.findByEmail(req.body.email)
    user.permission = true
    await userStore.updateUser(user)
    res.send({
      message: 'Permission granted',
      result: true
    })
  } catch (err){
    console.error('route grantPermission:', err)
    res.send({
      'error': 'ERROR while processing request. Please contact the system admin.'
    })
  }
})

router.get('/list', verifyToken, verifyPermission, async function(req, res){
  try{
    const users = await userStore.findAll()
    res.send({
      users
    })
  } catch (err){
    console.error('route list:', err)
    res.send({
      'error': 'ERROR while processing request. Please contact the system admin.'
    })
  }
})

module.exports = router
