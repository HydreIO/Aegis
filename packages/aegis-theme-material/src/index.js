import html from 'html-template-tag';
import components from './components';

export default (aegis, settings) => {
	for (const [name, { render, head, body }] of Object.entries(components)) {
		aegis.registerComponent(name, render, { head, body });
	}

	return boilerplate(settings);
};

function boilerplate({ logo, color = 'red' }) {
	return template => html`
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

					input, textarea, select, button {
						font: inherit;
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
