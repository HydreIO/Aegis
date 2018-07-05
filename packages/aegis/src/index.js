import { join, resolve, dirname } from 'path';

export default class Aegis {
	constructor(importRoot, signup) {
		this.importRoot = importRoot;
		this.signup = signup;
		this.strategies = new Map();
		this.components = new Map();
		this.signupSteps = new Map();
		this.deploy = null;
		this.storage = null;
		this.theme = null;

		// Defaults
		this.registerSignupStep('username', {
			template: `<Input id="username" name="username" type="text" required>Username</Input>`,
			handle: ({ username }) => ({ username })
		});

		this.registerSignupStep('confirm', {
			template: `<div style="text-align: right"><Button type="submit">SignUp</Button></div>`,
			handle: () => ({})
		});
	}

	async loadModule(name, settings) {
		const module = await import(resolve(this.importRoot, name));
		return (module.default || module)(this, settings);
	}

	registerStrategy(name, { template, passport, routes, body = '', head = '' }) {
		this.strategies.set(name, { template, passport, routes, body, head });
	}

	registerComponent(tag, fn, { head = '', body = '' } = {}) {
		this.components.set(tag, { fn, head, body });
	}

	registerSignupStep(name, { template, handle, body = '', head = '' }) {
		this.signupSteps.set(name, { template, handle, body, head });
	}

	static async fromConfig(
		path,
		{ loadTheme = true, loadDeploy = true, loadStorage = true } = {}
	) {
		const fullPath = resolve(path);
		const {
			strategies,
			theme: themeName,
			storage: storageName,
			deploy: deployName,
			settings: {
				theme: themeSettings,
				storage: storageSettings,
				strategies: strategiesSettings = {},
				deploy: deploySettings
			} = {},
			signup
		} = await import(fullPath);

		const aegis = new Aegis(join(dirname(fullPath), 'node_modules'), signup);

		if (strategies)
			for (const name of strategies)
				await aegis.loadModule(name, strategiesSettings[name]);

		if (loadStorage)
			aegis.storage = await aegis.loadModule(storageName, storageSettings);

		if (loadDeploy)
			aegis.deploy = await aegis.loadModule(deployName, deploySettings);

		if (loadTheme)
			aegis.theme = await aegis.loadModule(themeName, themeSettings);

		return aegis;
	}
}
