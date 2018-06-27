import html from 'html-template-tag';

export default data => html`
<form action="/login" method="post">
	<Input type="text" id="username" name="username" label="Username" required></Input>
	<Input type="password" id="password" name="password" label="Password" required></Input>
	<Button type="submit">Login</Button>
</form>
`;
