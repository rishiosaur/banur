![CLI Header](../../assets/banur-cli.svg)

# 🎛 CLI

![lint status](https://github.com/rishiosaur/banur/workflows/lint/badge.svg)
![format status](https://github.com/rishiosaur/banur/workflows/format/badge.svg)
![build status](https://github.com/rishiosaur/banur/workflows/build/badge.svg)
![GitHub](https://img.shields.io/github/license/rishiosaur/banur)

A tiny CLI that manages instances of Banur.

## Getting started

Run `yarn global add @banur/cli` to install the Banur CLI into your path.

## Development

`lerna bootstrap` at root should give you all dependencies required. After that, run `cd packages/cli && yarn run build && npm link`.

`banur` should be available in your path now.
