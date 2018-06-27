function createElement(tag, attrs, ...content) {
	return { tag, attrs, content };
}

export default function(components) {
	return (tree, cb) => {
		const heads = new Set();
		for (const [tag, { fn, head }] of components) {
			tree.match({ tag }, node => {
				heads.add(head);
				return fn(createElement, node);
			});
		}

		tree.match({ tag: 'head' }, node => {
			if (!node.content) node.content = [];
			else if (!Array.isArray(node.content)) node.content = [node.content];
			node.content.push(...heads);
			return node;
		});

		cb(null, tree);
	};
}
