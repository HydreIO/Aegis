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
		console.log('Loading', name, '...');
		passport.use(strategy);
		for (const [method, path] of routes) {
			strategies.push([method, path, strategy.name]);
		}
	}

	app.use((req, res, next) => {
		const { pathname } = parse(req.url);

		// User without javascript
		if (pathname === '/flash')
			return res.end(req.cookies.get('flash'), 'text/html');

		const strategy = strategies.find(
			([method, path]) => method === req.method && path === pathname
		);

		if (strategy) {
			const [, , name] = strategy;
			console.log(name);

			passport.authenticate(name, (err, user, info, status) => {
				if (err) return next(err);
				else {
					res.cookies.set('flash', 'lol');
					console.log(err, user, info, status);
					res.end();
				}
			})(req, res, next);
		} else next();
	});

	app.use(serveStatic('dist'));

	const server = createServer(app);
	server.listen(port, _ =>
		console.log(`Listening on ${server.address().port}`)
	);
}
