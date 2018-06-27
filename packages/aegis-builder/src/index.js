import Aegis from '@hydre.io/aegis';
import posthtml from 'posthtml';
import components from './posthtml-components';
import htmlnano from 'htmlnano';
import module from '@hydre.io/aegis-auth-password';
import theme from '@hydre.io/aegis-theme-material';

void (async function() {
	const aegis = new Aegis();
	module(aegis);
	theme(aegis);

	const templates = [...aegis.strategies.values()]
		.map(({ template }) => template())
		.join('');

	const page = `
<html>
	<head></head>
	<body>${templates}</body>
</html>
	`;

	const result = await posthtml([
		components(aegis.components),
		htmlnano({
			collapseWhitespace: 'all'
		})
	]).process(page);

	console.log(result.html);
})();
