function checkParams(givenParams, requiredParams){
  return new Promise(function(resolve, reject){
    let givenParamList = Object.keys(givenParams)
    for(let i in requiredParams){
      if(givenParamList.includes(requiredParams[i]) === false){
        reject(Error('Required parameter ' + requiredParams[i] + ' missing from API call'))
        break
      }
    }
    resolve()
  })
}

var stringToByteArrayConvertor = str => {
  var arr=[]
  for(var i=0; i<str.length; i++) {
    arr.push(str.charCodeAt(i))
  }
  return arr
}

module.exports.checkParams = checkParams
module.exports.stringToByteArrayConvertor = stringToByteArrayConvertor
