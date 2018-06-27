export default class Aegis {
	constructor() {
		this.strategies = new Map();
		this.components = new Map();
	}

	async loadModule(name) {
		const module = await import(name);
		(module.default || module)(this);
		return module;
	}

	registerAuthStrategy(name, { template, passport }) {
		this.strategies.set(name, { template, passport });
	}

	registerComponent(tag, fn, { head = '', body = '' } = {}) {
		this.components.set(tag, { fn, head, body });
	}
}
