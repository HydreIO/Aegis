import html from 'html-template-tag';

export default aegis => {
	aegis.registerComponent(
		'Input',
		(h, { attrs }) => (
			<fieldset class="material">
				<input {...attrs} label={undefined} />
				<label for={attrs.id}>{attrs.label}</label>
				<span />
			</fieldset>
		),
		html`
			<style>
				fieldset.material {
					position: relative;
 					border: none;
					padding: 0;
				}
				fieldset.material > label {
					position: absolute;  
  					top: 15px;
					left: 0;
  					color: rgba(0, 0, 0, 0.3);
  					transform-origin: left;
  					transition: all 0.3s ease;
				}
				fieldset.material > input:focus ~ label {
					color: red;
				}

				fieldset.material > input:focus ~ label,
				fieldset.material > input:valid ~ label {
					top: 0;
					transform: scale(0.6, 0.6);
				}

				fieldset.material > input {
					font-size: 20px;  
					width: 100%;
					border: none;  
					margin-top: 10px;
				}

				fieldset.material > input:focus {
					outline: none;
				}

				fieldset.material > span {
					display: block;
					width: 100%;
					height: 2px;
					background: linear-gradient(to right, red 50%, transparent 50%);
					background-color: rgba(0, 0, 0, 0.3);
					background-size: 200% 100%;
					background-position: 100% 0;
					transition: all 0.6s ease;
				}

				input:focus ~ span {
					background-position: 0 0;
				}
			</style>
		`
	);
};
