#!/usr/bin/env node

import Aegis from '@hydre.io/aegis';

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
	const aegis = await Aegis.fromConfig(configName);

	await Promise.all(
		Array.from(aegis.strategies).map(async ([name, { template }], i) => {
			const page = aegis.theme(template);

			const { html } = await posthtml([
				components(aegis.components),
				postcss([autoprefixer()], {
					from: undefined
				}),
				htmlnano({
					collapseWhitespace: 'all'
				})
			]).process(page);

			await aegis.deploy.add(`${i === 0 ? 'index' : name}.html`, html);
		})
	);

	await aegis.deploy.end();
})();
