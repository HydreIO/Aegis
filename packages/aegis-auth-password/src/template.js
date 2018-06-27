import html from 'html-template-tag';

export default data => html`
<form action="#/login" method="post">
	<Input type="text" id="username" name="username" label="Username" required></Input>
	<Input type="password" id="password" name="password" label="Password" required></Input>
	<div style="text-align: right">
		<Button type="submit">Login</Button>
	</div>
</form>
`;
