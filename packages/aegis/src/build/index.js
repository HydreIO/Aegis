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
		Array.from(aegis.strategies).map(
			async ([name, { template, body, head }], i) => {
				const html = buildFromTemplate(aegis, template, {
					bodies: new Set([body]),
					heads: new Set([head])
				});
				await aegis.deploy.add(`${i === 0 ? 'index' : name}.html`, html);
			}
		)
	);

	const steps = aegis.signup.map(step => aegis.signupSteps.get(step));
	const bodies = new Set(steps.map(({ body }) => body));
	const heads = new Set(steps.map(({ head }) => head));

	const html = await buildFromTemplate(
		aegis,
		`<form action="/signup" method="POST">
			${steps.map(({ template }) => template).join('')}
		</form>`,
		{
			bodies,
			heads
		}
	);

	await aegis.deploy.add('signup.html', html);

	await aegis.deploy.end();
}
