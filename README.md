# AChain

[![NPM version](https://img.shields.io/npm/v/achain.svg?style=flat-square)](https://npmjs.com/package/achain)
[![NPM downloads](https://img.shields.io/npm/dm/achain.svg?style=flat-square)](https://npmjs.com/package/achain)
[![Build Status](https://img.shields.io/circleci/project/weirongxu/achain/master.svg?style=flat-square)](https://circleci.com/gh/weirongxu/achain)

asynchronous chain function based on [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

## Usage
npm
```sh
npm i achain
```

or yarn

```sh
yarn add achain
```

```javascript
const achain = require('achain')

let attr = await achain(promise()).attr.asyncFunc().asyncFunc()().attr
```

## Example
Before
```javascript
async function func1() {
  return {
    prop: {
      func2,
    },
  }
}

async function func2() {
  return 'msg'
}

async function main() {
  await (await func1()).prop.func()
}
```

After
```javascript
async function main() {
  await achain(func1()).prop.func()
}
```

---

Before
```javascript
async function getUser(id) {
  return new Promise((resolve) => {
    resolve(new User({
    }))
  })
}

async function main() {
  await (await getUser(1)).update({
    name: 'new name',
  })
}
```

After
```javascript
async function main() {
  await achain(getUser(1)).update({
    name: 'new name',
  })
}
```

## License

MIT
