module.exports = function (source) {
  const chains = []

  let current = null
  let previous = null
  let isExecuting = false
  let done = () => {}
  let executeError = null

  const execute = async () => {
    if (current === null) {
      current = await source
      await execute()
    } else if (chains.length > 0) {
      const node = chains.shift()
      let ret
      switch (node.type) {
        case 'val':
          ret = await current[node.name]
          previous = current
          current = ret
          break
        case 'apply':
          ret = await current.apply(previous, node.args)
          previous = current
          current = ret
          break
        default:
          break
      }
      await execute()
    }
  }

  const run = async () => {
    if (isExecuting || executeError) {
      return
    }

    isExecuting = true
    try {
      await execute()
    } catch (err) {
      executeError = err
    }
    isExecuting = false
    done(current)
  }

  run()

  const target = function () {}
  const delayPromise = () => {
    return new Promise((resolve, reject) => {
      done = current => {
        if (executeError) {
          reject(executeError)
        } else {
          resolve(current)
        }
      }
    })
  }
  target.then = (...args) => {
    const p = delayPromise()
    return p.then.apply(p, args)
  }
  target.catch = (...args) => {
    const p = delayPromise()
    return p.catch.apply(p, args)
  }

  const proxy = new Proxy(target, {
    get(target, name) {
      if (name in target) {
        return target[name]
      }

      chains.push({type: 'val', name})
      run()
      return proxy
    },
    apply(target, thisArg, args) {
      chains.push({type: 'apply', args})
      run()
      return proxy
    },
  })
  return proxy
}

