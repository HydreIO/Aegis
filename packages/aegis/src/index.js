import { join, resolve, dirname } from 'path';

export default class Aegis {
	constructor(importRoot) {
		this.importRoot = importRoot;
		this.strategies = new Map();
		this.components = new Map();
		this.deployer = null;
		this.theme = null;
	}

	async loadModule(name, settings) {
		const module = await import(resolve(this.importRoot, name));
		return (module.default || module)(this, settings);
	}

	registerStrategy(name, { template, passport }) {
		this.strategies.set(name, { template, passport });
	}

	registerComponent(tag, fn, { head = '', body = '' } = {}) {
		this.components.set(tag, { fn, head, body });
	}

	static async fromConfig(path, { loadTheme = true, loadDeploy = true } = {}) {
		const fullPath = resolve(process.cwd(), path);
		const aegis = new Aegis(join(dirname(fullPath), 'node_modules'));
		const {
			strategies,
			theme: themeName,
			deploy: deployName,
			settings: {
				theme: themeSettings,
				strategies: strategiesSettings = {},
				deploy: deploySettings
			} = {}
		} = await import(fullPath);

		if (strategies)
			for (const name of strategies)
				await aegis.loadModule(name, strategiesSettings[name]);

		if (loadDeploy)
			aegis.deploy = await aegis.loadModule(deployName, deploySettings);

		if (loadTheme)
			aegis.theme = await aegis.loadModule(themeName, themeSettings);

		return aegis;
	}
}
