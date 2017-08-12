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

let attr = await achain(promise).attr.asyncFunc().asyncFunc()().attr
```

## Example
Before
```javascript
async function main() {
  let user = await getUser(1)
  let userDetail = await user.getDetail()
  await userDetail.destroy()

  let user = await getUser(2)
  let name = user.name
}
```

After
```javascript
async function main() {
  await achain(getUser(1)).getDetail().destroy()
  let name = await achain(getUser(2)).name
}
```
---

Before
```javascript
async function main() {
  let res = await fetch('/users.json')
  let data = res.json()
}
```

After
```javascript
api = achain(fetch)
async function main() {
  let data = await api('/users.json').json()
}
```

## License

MIT
