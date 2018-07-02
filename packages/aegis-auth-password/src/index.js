import template from './template';
import LocalStrategy from 'passport-local';
import { callbackify } from './utils';

export default aegis => {
	aegis.registerStrategy('password', {
		passport: new LocalStrategy(
			{},
			callbackify(async (username, password) => {
				const user = await aegis.storage.findByUsername(username);

				// TODO: Use hash like bcrypt and argon
				if (user && user.password === password) return user;
				else
					return [
						false,
						{
							error: true,
							text: 'Invalid user or password'
						}
					];
			})
		),
		routes: [['POST', '/password']],
		template
	});
};
