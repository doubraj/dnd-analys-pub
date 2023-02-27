# dnd-analys-pub

This script makes some analysis over the DnD LARP game format prepared for child summer camp.
It's copy of ongoing private project, and this repo is only a timestamp.

## Init
`npm ci`

Project is written in typescript. Currently it's in dev state without compiling some production code.

## Start
There are some questions, which these scripts are trying to get aswer for.
* `npm run app:deps` prints all dependencies of game areas
* `npm run app:ways` prints all variants of gamethrough
* `npm run app:ways:g` prints analysis of game placement to the areas

## Source data
Are placed in `src/DataSource.ts`

## Disclaimer
Whole code structure is simplified to accomplish this simple task and prevent over-engineering
