import parser from "posthtml-parser"

function createElement(tag, attrs, ...content) {
	return { tag, attrs, content };
}

export default function(components) {
	return (tree, cb) => {
		const heads = new Set();
		const bodies = new Set();
		for (const [tag, { fn, head, body }] of components) {
			tree.match({ tag }, node => {
				heads.add(head);
				bodies.add(body);
				return fn(createElement, node);
			});
		}

		function pushToDom(tag, elements) {
			tree.match({ tag }, node => {
				if (!node.content) node.content = [];
				else if (!Array.isArray(node.content)) node.content = [node.content];
				node.content.push(...elements);
				return node;
			});
		}


		pushToDom('head', [...heads].map(e => e.trim()).map(parser))
		pushToDom('body', [...bodies].map(e => e.trim()).map(parser))

		cb(null, tree);
	};
}
