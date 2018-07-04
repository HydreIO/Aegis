import template from './template';
import LocalStrategy from 'passport-local';
import { callbackify } from './utils';
import html from 'html-template-tag';

export default (aegis, { confirm_password: confirmPassword }) => {
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

	const passwordSignup = Symbol('passwordSignup');

	aegis.registerComponent(
		passwordSignup,
		(h, _, { Input }) => {
			const step = (
				<Input id="password" label="Password" type="password" required />
			);
			if (confirmPassword)
				return [
					step,
					<Input
						id="confirm_password"
						label="Configrm Password"
						type="password"
						required
					/>
				];
			else return step;
		},
		{
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
			</script>
		`
		}
	);

	aegis.registerSignupStep(
		'password',
		passwordSignup,
		({ password, confirm_password }) => password === confirm_password
	);
};
