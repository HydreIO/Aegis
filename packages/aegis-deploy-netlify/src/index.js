import fetch from 'node-fetch';
import { createHash } from 'crypto';

function sha1(value) {
	const generator = createHash('sha1');
	generator.update(value);
	return generator.digest('hex');
}

export default async (aegis, { site, token = process.env.NETLIFY_TOKEN }) => {
	const { status } = await fetch(
		`https://api.netlify.com/api/v1/sites/${site}.netlify.com`,
		{
			headers: {
				authorization: `Bearer ${token}`
			}
		}
	);

	if (status === 404) {
		console.log('Site not found, creating ...');
		await fetch(`https://api.netlify.com/api/v1/sites`, {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
				authorization: `Bearer ${token}`
			},
			body: JSON.stringify({
				name: site
			})
		});
	}

	const files = new Map();
	return {
		add(name, content) {
			files.set(name, content);
		},
		async end() {
			const hashs = {};

			for (const [name, content] of files) {
				hashs[`/${name}`] = sha1(content);
			}

			const { id, deploy_ssl_url } = await fetch(
				`https://api.netlify.com/api/v1/sites/${site}.netlify.com/deploys`,
				{
					method: 'POST',
					headers: {
						'content-type': 'application/json',
						authorization: `Bearer ${token}`
					},
					body: JSON.stringify({
						files: hashs
					})
				}
			).then(res => res.json());

			await Promise.all(
				[...files].map(async ([name, content]) => {
					await fetch(
						`https://api.netlify.com/api/v1/deploys/${id}/files/${name}`,
						{
							method: 'PUT',
							headers: {
								'content-type': 'application/octet-stream',
								authorization: `Bearer ${token}`
							},
							body: content
						}
					);
				})
			);

			console.log('Deployed at', deploy_ssl_url);
		}
	};
};
