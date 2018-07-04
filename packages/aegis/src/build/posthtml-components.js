import parser from 'posthtml-parser';

function createElement(tag, attrs, ...content) {
	return { tag, attrs, content };
}

export default function(components, inject = {}) {
	return (tree, cb) => {
		const heads = (inject.heads = inject.heads || new Set());
		const bodies = (inject.bodies = inject.bodies || new Set());
		const deps = new Set(components.keys());

		const depsProxy = new Proxy(
			{},
			{
				get(_, prop) {
					if (components.has(prop)) {
						deps.add(prop);
						return prop;
					}
				}
			}
		);

		while (deps.size > 0) {
			const cDeps = Array.from(deps);
			deps.clear();
			for (const tag of cDeps) {
				const { fn, head, body } = components.get(tag);
				tree.match({ tag }, node => {
					heads.add(head);
					bodies.add(body);
					return fn(createElement, node, depsProxy);
				});
			}
		}

		function pushToDom(tag, elements) {
			tree.match({ tag }, node => {
				if (!node.content) node.content = [];
				else if (!Array.isArray(node.content)) node.content = [node.content];
				node.content.push(...elements);
				return node;
			});
		}

		pushToDom('head', [...heads].map(e => e.trim()).map(parser));
		pushToDom('body', [...bodies].map(e => e.trim()).map(parser));

		cb(null, tree);
	};
}
