import connect from 'connect';
import logger from 'morgan';
import { urlencoded, json } from 'body-parser';
import { connect as cookies } from 'cookies';
import { Passport } from 'passport';
import { createServer } from 'http';
import serveStatic from 'serve-static';
import { parse } from 'url';

export default async function serve(aegis, port = 3000) {
	const app = connect();
	const passport = new Passport();

	app.use(logger('dev'));
	app.use(urlencoded({ extended: false }));
	app.use(json());
	app.use(cookies());
	app.use(passport.initialize());

	const strategies = [];

	for (const [name, { passport: strategy, routes }] of aegis.strategies) {
		console.log('Loading', name, 'with strategy', strategy.name, '...');
		passport.use(strategy);
		for (const [method, path] of routes) {
			strategies.push([method, path, strategy.name]);
		}
	}

	const steps = aegis.signup.map(step => aegis.signupSteps.get(step));

	app.use((req, res, next) => {
		const { pathname } = parse(req.url);

		// User without javascript
		switch (pathname) {
			case '/flash':
				res.cookies.set('flash');
				res.end(req.cookies.get('flash'), 'text/html');
				break;
			case '/signup':
				if (req.method === 'POST') {
					Promise.all(steps.map(({ handle }) => handle(req.body)))
						.then(results => results.reduce((c, v) => Object.assign(c, v), {}))
						.then(result => aegis.storage.add(result))
						.then(_ => {
							res.writeHead(301, { Location: '/' });
							res.end();
						}, next);
				} else next();
				break;
			default:
				const strategy = strategies.find(
					([method, path]) => method === req.method && path === pathname
				);

				if (strategy) {
					const [, , name] = strategy;
					console.log('Using strategy', name);

					passport.authenticate(name, (err, user, info, status) => {
						if (err) return next(err);
						else {
							if (user === false) {
								info && res.cookies.set('flash', JSON.stringify(info));
								res.writeHead(301, { Location: '/' });
								res.end();
							} else {
								console.log(err, user, info, status);
								res.end();
							}
						}
					})(req, res, next);
				} else next();
				break;
		}
	});

	app.use(
		serveStatic('dist', {
			extensions: ['html']
		})
	);

	const server = createServer(app);
	server.listen(port, _ =>
		console.log(`Listening on ${server.address().port}`)
	);
}
