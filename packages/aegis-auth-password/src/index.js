import template from './template';
import LocalStrategy from 'passport-local';
import { callbackify } from 'util';

export default aegis => {
	aegis.registerStrategy('password', {
		passport: new LocalStrategy(
			{},
			callbackify(async (username, password) => {
				console.log(username, password);
			})
		),
		routes: [['POST', '/password']],
		template
	});
};
