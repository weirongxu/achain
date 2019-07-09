const test = require('ava')
const {delay, asyncFunc} = require('./_utils')
const achain = require('..')

test('not promise', async t => {
  t.is(await achain('not promise'), 'not promise')

  const a = achain('not promise')
  await delay(10)
  t.is(await a, 'not promise')
})

test('wrapper function', async t => {
  const func = asyncFunc('wrapper function')
  t.is(await achain(func)(), 'wrapper function')

  const achainFunc = achain(func)
  await delay(10)
  t.is(await achainFunc(), 'wrapper function')
})

test('multiple wrapper function', async t => {
  const structure = {
    level1: {
      level2: 'wrapper',
    },
  }
  const afunc = asyncFunc(structure)
  const achainFunc = achain(afunc)
  let a = achainFunc()
  // Let b = achainFunc()
  a = a.level1
  // B = b.level1
  a = a.level2
  // B = b.level2
  t.is(await a, 'wrapper')
  // T.is(await b, 'wrapper')
})
