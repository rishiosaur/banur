# 🏴 Banur

![lint status](https://github.com/rishiosaur/banur/workflows/lint/badge.svg)
![format status](https://github.com/rishiosaur/banur/workflows/format/badge.svg)
![build status](https://github.com/rishiosaur/banur/workflows/build/badge.svg)
![GitHub](https://img.shields.io/github/license/rishiosaur/banur)
![GitHub issues](https://img.shields.io/github/issues/rishiosaur/banur)
![GitHub contributors](https://img.shields.io/github/contributors/rishiosaur/banur)
![GitHub last commit](https://img.shields.io/github/last-commit/rishiosaur/banur)

## Getting Started

Before doing anything, make sure you read through the specification documentation to truly understand how the different server pieces fit together.

### Spinning up an instance

You can start up a server by using the Banur CLI (also packaged in this repository): `npx @banur/cli epoch` or `npx @banur/cli petrichor`.

### Local development

After cloning this repository, use `lerna bootstrap` to install all dependencies for all packages. You may need to `cd` into each package and run `yarn` to install any side dependencies.

Both [`epoch`](packages/epoch) and `petrichor` are just Typescript libraries. You can run `npm link` in each of their directories to allow your local distribution (run `yarn build` before) to be locally tested & used.

The [`cli`](packages/cli) package also has support for `npm link`, but it it meant to be used in the terminal.

## Packages

This repository is a monorepo managed by [Lerna](lerna.json), and holds all the core serverware, packages and clients distributed over NPM for Banur.

|          Name           |                                                                            Description                                                                            |
| :---------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|   [CLI](packages/cli)   |                                     CLI for spinning up & managing Banur instances. Pulls templates from custom repositories.                                     |
| [Epoch](packages/epoch) |                                            Community server library; distributed instances of discrete channels & RTM.                                            |
|        Petrichor        | Coming soon. Library for the core network server; allows distributed instances of Epoch to be linked together into discrete communities in one centralized space. |
