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
		this.registerSignupStep('username', 'Input', {
			attrs: {
				id: 'username',
				label: 'User Name',
				type: 'text',
				required: true
			}
		});

		const confirmSignup = Symbol('confirmSignup');

		this.registerComponent(confirmSignup, (h, _, { Button }) => (
			<div style="text-align: right">
				<Button type="submit">SignUp</Button>
			</div>
		));

		this.registerSignupStep('confirm', confirmSignup);
	}

	async loadModule(name, settings) {
		const module = await import(resolve(this.importRoot, name));
		return (module.default || module)(this, settings);
	}

	registerStrategy(name, { template, passport, routes }) {
		this.strategies.set(name, { template, passport, routes });
	}

	registerComponent(tag, fn, { head = '', body = '' } = {}) {
		this.components.set(tag, { fn, head, body });
	}

	registerSignupStep(name, component, params = {}) {
		this.signupSteps.set(name, { component, params });
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
