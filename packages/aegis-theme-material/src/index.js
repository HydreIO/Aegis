import html from 'html-template-tag';

export default aegis => {
	aegis.registerComponent(
		'Input',
		(h, { attrs }) => (
			<fieldset class="material">
				<input {...attrs} label={undefined} />
				<label for={attrs.id}>{attrs.label}</label>
				<div />
			</fieldset>
		),
		html`
			<style>
				fieldset.material {
					position: relative;
 					border: none;
					padding: 0;
					margin-bottom: 16px;
				}
				fieldset.material > label {
					position: absolute;  
					top: 12px;
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
		`
	);
};

export function boilerplate(template, { logo, color = 'red' }) {
	return html`
		<!DOCTYPE html>
		<html>
			<head>
				<title>Aegis</title>
				<link href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700' rel="stylesheet">
				<style>
					:root {
						--mainColor: ${color};
					}

					body {
						font-family: Roboto,sans-serif;
						line-height: 1.5;
						background-image: url("https://source.unsplash.com/1920x1080/daily?desktop wallpaper");
						background-attachment: fixed;
						background-position: 50%;
						background-repeat: no-repeat;
						background-size: cover;
					}

					#step {
						background-color: hsla(0,0%,100%,.7);
						position: absolute;
						left: 50%;
						top: 50%;
						transform: translate(-50%,-50%);
						min-width: 300px;
						padding: 12px 48px;
					}

					#step > .logo {
						text-align: center;
						margin-bottom: 16px;
					}

					#step > .logo > img {
						border-radius: 50%;
						width: 150px;
						height: 150px;
					}
				</style>
			</head>
			<body>
				<div id="step">
					<div class="logo">
						<img src="${logo}">
					</div>
					$${template}
				</div>
			</body>
		</html>
	`;
}
