![Epoch header](../../assets/banur-epoch.svg)

# 🌁 Epoch

![lint status](https://github.com/rishiosaur/banur/workflows/lint/badge.svg)
![format status](https://github.com/rishiosaur/banur/workflows/format/badge.svg)
![build status](https://github.com/rishiosaur/banur/workflows/build/badge.svg)
![GitHub](https://img.shields.io/github/license/rishiosaur/banur)

A reference implementation of the Banur Community server specification.

## Getting started

Run `npx banur epoch` to create an instance of an Epoch server on your local machine.

## Development

`lerna bootstrap` at root should give you all dependencies required. After that, run `cd packages/epoch && yarn run build && npm link`.

Run `npx @banur/cli epoch` in another directory to create a reference server using the locally available package..
