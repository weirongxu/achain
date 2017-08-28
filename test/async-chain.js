const test = require('ava')
const achain = require('../')
const {delay, asyncFunc} = require('./_utils')

test('function', async t => {
  const func = asyncFunc({
    val: 2,
    func2,
  })

  async function func2() {
    return this.val
  }

  const achainFunc = achain(func())
  achainFunc.func2()
  t.is(await achainFunc.func2(), 2)
})

test('prop', async t => {
  const func = asyncFunc({
    prop: 'prop',
  })

  t.is(await achain(func()).prop, 'prop')
})

test('prop and function', async t => {
  const func = asyncFunc({
    prop: {
      val: 2,
      func2,
      func3,
    },
  })

  async function func2() {
    return this.val
  }

  async function func3() {
    delay(10)
    return this.val
  }

  t.is(await achain(func()).prop.func2(), 2)
  t.is(await achain(func()).prop.func3(), 2)
})

test('multiple async chain', async t => {
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
