const test = require('ava')
const {asyncFunc} = require('./_utils')
const achain = require('..')

test('catch reject', async t => {
  const func = asyncFunc(func2)

  async function func2() {
    throw new Error('error')
  }

  const error = await t.throwsAsync(achain(func())())
  t.is(error.message, 'error')
})

test.cb('catch reject with callback', t => {
  const func = asyncFunc(func2)

  async function func2() {
    throw new Error('error')
  }

  achain(func())().catch(error => {
    t.is(error.message, 'error')
    t.end()
  })

  achain(func())().then(() => {
  }).catch(error => {
    t.is(error.message, 'error')
    t.end()
  })

  achain(func2()).catch(error => {
    t.is(error.message, 'error')
    t.end()
  })
})
