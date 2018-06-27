import template from './template';
import LocalStrategy from 'passport-local';
import { callbackify } from 'util';

export default aegis => {
	aegis.registerAuthStrategy('password', {
		passport: new LocalStrategy({}, callbackify((username, password) => {})),
		template
	});
};
