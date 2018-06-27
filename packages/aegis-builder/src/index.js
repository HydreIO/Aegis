#!/usr/bin/env node

import Aegis from '@hydre.io/aegis';

import { join, resolve, dirname } from 'path';

import posthtml from 'posthtml';
import htmlnano from 'htmlnano';
import components from './posthtml-components';
import postcss from 'posthtml-postcss';
import autoprefixer from 'autoprefixer';

const [configName = 'config.json'] = process.argv.slice(2);

if (configName === '--help') {
	console.log(
		`${process.argv[1]} [config]

Options:
\t--help\tShow help
`
	);
	process.exit(0);
}

(async function() {
	const configPath = resolve(process.cwd(), configName);
	const {
		strategies,
		theme: themeName,
		deploy: deployName,
		settings: {
			theme: themeSettings,
			strategies: strategiesSettings = {},
			deploy: deploySettings
		} = {}
	} = await import(configPath);

	const aegis = new Aegis();
	const nodeModules = join(dirname(configPath), 'node_modules');

	if (strategies)
		strategies.forEach(name => aegis.loadModule(resolve(nodeModules, name)));

	const theme = await aegis.loadModule(resolve(nodeModules, themeName));
	const deployer = await aegis.loadModule(resolve(nodeModules, deployName));

	const deploy = await deployer.deploy(deploySettings, dirname(configPath));

	await Promise.all(
		[...aegis.strategies.entries()].map(async ([name, { template }], i) => {
			const page = theme.boilerplate(
				template(strategiesSettings[name]),
				themeSettings
			);

			const { html } = await posthtml([
				components(aegis.components),
				postcss([autoprefixer()], {
					from: undefined
				}),
				htmlnano({
					collapseWhitespace: 'all'
				})
			]).process(page);

			await deploy.add(`${i === 0 ? 'index' : name}.html`, html);
		})
	);

	await deploy.end();
})();
