#!/usr/bin/env node

import sywac from 'sywac';
import chalk from 'chalk';

import Aegis from '.';
import build from './build';
import serve from './serve';

sywac
	.command('build [config=config.json]', {
		desc: 'Build and deploy aegis web part',
		async run({ config }) {
			await build(await Aegis.fromConfig(config));
		}
	})
	.command('serve [config=config.json]', {
		desc: 'serve aegis server part',
		async run({ config }) {
			await serve(await Aegis.fromConfig(config));
		}
	})
	.help()
	.showHelpByDefault()
	.style({
		// style usage components
		usagePrefix: str =>
			chalk.white(str.slice(0, 6)) + ' ' + chalk.magenta(str.slice(7)),
		// style normal help text
		group: str => chalk.white(str),
		flags: str => {
			const [command, args] = str.split(' ', 2);
			return chalk.green(command) + (args ? chalk.yellow(' ' + args) : '');
		},
		desc: str => chalk.white(str),
		hints: str => chalk.dim(str),
		example: str => {
			return (
				chalk.yellow(str.slice(0, 2)) +
				str
					.slice(2)
					.split(' ')
					.map(word => {
						return word.startsWith('-')
							? chalk.green.dim(word)
							: chalk.gray(word);
					})
					.join(' ')
			);
		},
		// use different style when a type is invalid
		groupError: str => chalk.red(str),
		flagsError: str => chalk.red(str),
		descError: str => chalk.yellow(str),
		hintsError: str => chalk.red(str),
		// style error messages
		messages: str => chalk.red(str)
	})
	.parseAndExit();
