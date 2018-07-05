import template from './template';
import LocalStrategy from 'passport-local';
import { callbackify } from './utils';
import html from 'html-template-tag';
import { hash, verify } from 'argon2';

export default (aegis, { confirm_password: confirmPassword }) => {
	aegis.registerStrategy('password', {
		passport: new LocalStrategy(
			{},
			callbackify(async (username, password) => {
				const user = await aegis.storage.findByUsername(username);

				if (user && (await verify(user.password, password))) return user;
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

	const extraStep = confirmPassword
		? html`<Input id="confirm_password" name="confirmPassword" type="password" required>Confirm Password</Input>`
		: '';

	aegis.registerSignupStep('password', {
		template: html`
			<Input id="password" name="password" type="password" required>Password</Input>
			$${extraStep}`,
		body: html`
			<script>
				(function (){
					var password = document.getElementById("password");
					var confirm_password = document.getElementById("confirm_password");

					function validatePassword(){
						console.log(password.value, confirm_password.value)
						confirm_password.setCustomValidity(
							password.value !== confirm_password.value
							? "Passwords Don't Match"
							: ''
						);
					}

					password.addEventListener('change', validatePassword);
					confirm_password.addEventListener('keyup', validatePassword);
				})();
			</script>`,
		async handle({ password, confirmPassword }) {
			if (confirmPassword && password === confirmPassword)
				return {
					password: await hash(password)
				};
			else throw "Password Don't Match";
		}
	});
};
