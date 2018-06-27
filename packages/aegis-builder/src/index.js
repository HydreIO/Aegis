import Aegis from '@hydre.io/aegis';
import posthtml from 'posthtml';
import htmlnano from 'htmlnano';
import components from './posthtml-components';
import postcss from 'posthtml-postcss';
import autoprefixer from 'autoprefixer';

import module from '@hydre.io/aegis-auth-password';

(async function() {
	const aegis = new Aegis();
	module(aegis);
	const theme = await import('@hydre.io/aegis-theme-material');
	theme.default(aegis);

	for (const { template } of aegis.strategies.values()) {
		const page = theme.boilerplate(template(), {
			logo: 'https://avatars3.githubusercontent.com/u/40317854',
			color: '#4CAF50'
		});

		const result = await posthtml([
			components(aegis.components),
			postcss([
				autoprefixer()
			], {
				from: undefined
			}),
			htmlnano({
				collapseWhitespace: 'all'
			})
		]).process(page);

		console.log(result.html);
	}
})();
