var db;

// Non-persistant storage
var userObj = {}

async function createUser(_user){
  let timestamp = new Date().getTime()

  let user = {
    email: _user.email,
    hashedPassword: _user.hashedPassword,
    permission: false,
    timestamp
  }

  // First user will be granted permission
  if(userObj.keys == undefined || userObj.keys.length === 0){
    user.permission = true
  }
  user.id = '123456'+timestamp,
  user._id = user.id,
  userObj[user.id] = user
  return new Promise(function(resolve, reject){
    resolve(user)
  })
}

async function findAll(){
  return new Promise(function(resolve, reject){
    resolve(Object.keys(userObj).map(function (id) { return userObj[id] }))
  })
}

async function findById(id){
  return new Promise(function(resolve, reject){
    resolve(userObj[id])
  })
}

async function findByEmail(email){
  let user = null
  for(let key in userObj){
    if(userObj[key].email === email){
      user = userObj[key]
      break
    }
  }
  return new Promise(function(resolve, reject){
    resolve(user)
  })
}

async function updateUser(user){
  return new Promise(function(resolve, reject){
    userObj[user._id] = user
    resolve(user)
  })
}

function closeDB(){
  if(db !== undefined){
    db.close()
  }
}

exports.createUser = createUser
exports.findAll = findAll
exports.findById = findById
exports.findByEmail = findByEmail
exports.updateUser = updateUser
exports.closeDB = closeDB
