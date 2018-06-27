import html from 'html-template-tag';

export const render = (h, { attrs }) => (
	<fieldset class="material">
		<input {...attrs} label={undefined} />
		<label for={attrs.id}>{attrs.label}</label>
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
		transition: all 0.3s ease;
		pointer-events: none;
	}
	fieldset.material > input:focus ~ label {
		color: var(--mainColor);
	}

	fieldset.material > input:focus ~ label,
	fieldset.material > input:valid ~ label {
		top: 0;
		transform: scale(0.75);
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
		height: 1px;
	}

	fieldset.material > div:before,
	fieldset.material > div:after {
		content: "";
		position: absolute;
		width: 100%;
		height: 1px;
		transition: .3s cubic-bezier(.4,0,.2,1);
	}

	fieldset.material > div:before {
		z-index: 0;
		background-color: rgba(0,0,0,.42);
	}

	fieldset.material > div:after {
		z-index: 1;
		transform-origin: center center 0;
		background-color: var(--mainColor);
		transform: scaleX(0);
	}

	input:focus ~ div:after {
		transform: scaleX(1);
	}

	input:focus ~ div:before {
		background-color: none;
	}

	fieldset:hover > div:before {
		background-color: rgba(0,0,0,.87);
	}
</style>
`;
