#!/usr/bin/env node

import { Command } from 'commander'
import epochCommand from './epoch'
import petrichorCommand from './petrichor'

const program = new Command()
program.version('0.0.1')

program
	.command('epoch')
	.description('Generate an Epoch server using the starter kit.')
	.action(epochCommand)

program
	.command('petrichor')
	.description('Generate a Petrichor server from the template.')
	.action(petrichorCommand)

program.parse(process.argv)
