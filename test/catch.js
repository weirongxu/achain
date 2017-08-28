const test = require('ava')
const achain = require('../')
const {asyncFunc} = require('./_utils')

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

  achain(func())().then(() => {
  }).catch(err => {
    t.is(err.message, 'error')
    t.end()
  })

  achain(func2()).catch(err => {
    t.is(err.message, 'error')
    t.end()
  })
})
