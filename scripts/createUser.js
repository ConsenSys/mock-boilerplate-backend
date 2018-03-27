var testUtils = require('../test/util.js')

async function run(){
  let email = process.env.EMAIL || 'user@test.com'
  let password = process.env.PASSWORD || 'pass'

  await testUtils.createUser({email, password})
  console.log('Created user:', email)

  await testUtils.login({email, password})
  console.log('Logged in user:', email)
}

run()
