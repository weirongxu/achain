const test = require('ava')
const delay = require('delay')
const achain = require('./')

const asyncFunc = (ret) => {
  return async () => {
    await delay(10)
    return ret
  }
}

test('not promise', async t => {
  t.is(await achain('not promise'), 'not promise')
})

test('async function', async t => {
  const func = asyncFunc('async function')

  t.is(await achain(func()), 'async function')
})

test('async chain', async t => {
  const func = asyncFunc({
    val: 2,
    func2,
  })

  async function func2() {
    return this.val
  }

  t.is(await achain(func()).func2(), 2)
})

test('async chain with prop', async t => {
  const func = asyncFunc({
    prop: 'prop',
  })

  t.is(await achain(func()).prop, 'prop')
})

test('async chain with prop function', async t => {
  const func = asyncFunc({
    prop: {
      val: 2,
      func2,
    },
  })

  async function func2() {
    return this.val
  }

  t.is(await achain(func()).prop.func2(), 2)
})

test('async chain with delay function', async t => {
  const func = asyncFunc({
    prop: {
      val: 2,
      func2,
    },
  })

  async function func2() {
    delay(10)
    return this.val
  }

  t.is(await achain(func()).prop.func2(), 2)
})

test('multiple async chain with prop function', async t => {
  const func = asyncFunc({
    prop: {
      val: 2,
      fun2,
    },
  })

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
  const func = asyncFunc(func2)

  async function func2() {
    return 2
  }

  t.is(await achain(func())(), 2)
})

test('catch reject', async t => {
  const func = asyncFunc(func2)

  async function func2() {
    throw new Error('error')
  }

  const error = await t.throws(achain(func())())
  t.is(error.message, 'error')
})

test.cb('catch reject with callback', t => {
  const func = asyncFunc(func2)

  async function func2() {
    throw new Error('error')
  }

  achain(func())().catch(err => {
    t.is(err.message, 'error')
    t.end()
  })
})
