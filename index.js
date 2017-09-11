'use strict'

const proxy = (source, isLazy) => {
  const target = () => {}
  const promise = new Promise((resolve, reject) => {
    source.then(([result]) => {
      resolve(result)
    }, reject)
  })
  target.then = (...args) => {
    return promise.then.apply(promise, args)
  }
  target.catch = (...args) => {
    return promise.catch.apply(promise, args)
  }

  return new Proxy(target, {
    get(target, name) {
      if (name in target) {
        return target[name]
      }

      return proxy((async () => {
        const [result] = await source
        return [await result[name], result]
      })(), isLazy)
    },
    apply(target, thisArg, args) {
      return proxy((async () => {
        const [result, self] = await source
        return [await result.apply(self, args), result]
      })(), isLazy)
    },
  })
}

module.exports = (source, isLazy = false) => {
  return proxy((async () => {
    return [await source, source]
  })(), isLazy)
}
