const test = require('ava')
const achain = require('./')

test('not promise', async t => {
  const a = await achain('not promise')
  t.is(a, 'not promise')
})

test('delay promise', async t => {
  const p = new Promise(resolve => {
    setTimeout(() => {
      resolve('delay promise')
    }, 10)
  })
  const a = await achain(p)
  t.is(a, 'delay promise')
})

test('async function', async t => {
  async function func() {
    return 'async function'
  }

  const a = await achain(func())
  t.is(a, 'async function')
})

test('async chain', async t => {
  async function func() {
    return {
      val: 2,
      func2,
    }
  }

  async function func2() {
    return this.val
  }

  const a = await achain(func()).func2()
  t.is(a, 2)
})

test('async chain with prop', async t => {
  async function func() {
    return {
      prop: 'prop',
    }
  }

  const a = await achain(func()).prop
  t.is(a, 'prop')
})

test('async chain with prop function', async t => {
  async function func() {
    return {
      prop: {
        val: 2,
        func2,
      },
    }
  }

  async function func2() {
    return this.val
  }

  const a = await achain(func()).prop.func2()
  t.is(a, 2)
})

test('async chain with delay function', async t => {
  async function func() {
    return {
      prop: {
        val: 2,
        func2,
      },
    }
  }

  async function func2() {
    return new Promise(resolve => {
      resolve(this.val)
    })
  }

  const a = await achain(func()).prop.func2()
  t.is(a, 2)
})

test('multiple async chain with prop function', async t => {
  async function func() {
    return {
      prop: {
        val: 2,
        fun2,
      },
    }
  }

  async function fun2(val) {
    if (val) {
      return val
    }
    return this.val
  }

  let a = achain(func())
  let b = achain(func())
  a = await a.prop.fun2(3)
  b = await b.prop.fun2()
  t.is(a, 3)
  t.is(b, 2)
})

test('async function chain', async t => {
  async function func() {
    return func2
  }

  async function func2() {
    return 2
  }

  const a = await achain(func())()
  t.is(a, 2)
})

test('catch reject', async t => {
  async function func() {
    return func2
  }
  async function func2() {
    throw new Error('error')
  }

  const error = await t.throws(achain(func())())
  t.is(error.message, 'error')
})

test.cb('catch reject with callback', t => {
  async function func() {
    return func2
  }
  async function func2() {
    throw new Error('error')
  }

  achain(func())().catch(err => {
    t.is(err.message, 'error')
    t.end()
  })
})
