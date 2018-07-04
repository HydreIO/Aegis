import posthtml from 'posthtml';
import htmlnano from 'htmlnano';
import components from './posthtml-components';
import postcss from 'posthtml-postcss';
import autoprefixer from 'autoprefixer';

async function buildFromTemplate(aegis, template, inject) {
	const page = aegis.theme(template);

	const { html } = await posthtml([
		components(aegis.components, inject),
		postcss([autoprefixer()], {
			from: undefined
		}),
		htmlnano({
			collapseWhitespace: 'all'
		})
	]).process(page);

	return html;
}
export default async function build(aegis) {
	await Promise.all(
		Array.from(aegis.strategies).map(async ([name, { template }], i) => {
			const html = buildFromTemplate(aegis, template);
			await aegis.deploy.add(`${i === 0 ? 'index' : name}.html`, html);
		})
	);

	// Collect deps
	const inject = {};

	const { html } = await posthtml([
		components(aegis.components, inject)
	]).process(
		{
			tag: 'form',
			attrs: {
				action: '/signup',
				method: 'post'
			},
			content: aegis.signup.map(step => {
				const { component, params } = aegis.signupSteps.get(step);

				return {
					...params,
					tag: component
				};
			})
		},
		{ skipParse: true }
	);

	const page = await buildFromTemplate(aegis, html, inject);

	await aegis.deploy.add('signup.html', page);

	await aegis.deploy.end();
}
