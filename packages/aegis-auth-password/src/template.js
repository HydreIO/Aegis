import html from 'html-template-tag';

export default html`
<form action="/password" method="post">
	<Input type="text" id="username" name="username" required>Username</Input>
	<Input type="password" id="password" name="password" required>Password</Input>
	<div style="text-align: right">
		<Button type="submit">Login</Button>
	</div>
</form>
`;
