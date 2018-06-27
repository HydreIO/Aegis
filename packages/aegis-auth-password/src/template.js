import html from 'html-template-tag';

export default data => html`
<form action="/login" method="post">
	<Input type="text" id="username" name="username" label="Username" required/>
	<Input type="password" id="password" name="password" label="Password" required/>
	<input type="submit" value="Login"/>
</form>
`;
