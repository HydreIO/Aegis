import html from 'html-template-tag';

export const render = (h, { attrs, content }) => (
	<fieldset class="material">
		<input {...attrs} placeholder={content.toString()} />
		<label for={attrs.id}>{content}</label>
		<div />
	</fieldset>
);

export const head = html`
<style>
	fieldset.material {
		position: relative;
		border: none;
		padding: 0;
		margin-bottom: 16px;
	}

	fieldset.material > label {
		position: absolute;  
		top: 18px;
		left: 0;
		color: rgba(0, 0, 0, .42);
		transform-origin: left;
		transition: 0.3s ease;
		pointer-events: none;
	}

	fieldset.material > input::placeholder {
		color: transparent;
	}

	fieldset.material > input:focus ~ label {
		color: var(--mainColor);
	}

	fieldset.material > input:focus ~ label,
	fieldset.material > input:valid ~ label,
	fieldset.material > input:not(:placeholder-shown) ~ label {
		transform: scale(0.75) translateY(-18px);
	}

	fieldset.material > input {
		font-size: 18px;
		width: 100%;
		border: none;  
		margin-top: 15px;
		background: none;
	}

	fieldset.material > input:focus {
		outline: none;
	}

	fieldset.material > div {
		width: 100%;
		height: 2px;
	}

	fieldset.material > div:before,
	fieldset.material > div:after {
		content: "";
		position: absolute;
		bottom: 0;
		transition: .3s cubic-bezier(.4,0,.2,1);
		width: 100%;
	}

	fieldset.material > div:before {
		height: 1px;
		background-color: black;
		opacity: 0.42;
	}

	fieldset.material > div:after {
		height: 2px;
		transform-origin: center center 0;
		background-color: var(--mainColor);
		transform: scaleX(0);
	}

	input:focus ~ div:after {
		transform: scaleX(1);
	}

	fieldset:hover > input:not(:focus) ~ div:before {
		opacity: 0.87
	}
</style>
`;
