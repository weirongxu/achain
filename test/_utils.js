const delay = require('delay')

exports.asyncFunc = ret => {
  return async () => {
    await delay(10)
    return ret
  }
}

exports.delay = delay
