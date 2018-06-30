import posthtml from 'posthtml';
import htmlnano from 'htmlnano';
import components from './posthtml-components';
import postcss from 'posthtml-postcss';
import autoprefixer from 'autoprefixer';

export default async function build(aegis) {
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
}
