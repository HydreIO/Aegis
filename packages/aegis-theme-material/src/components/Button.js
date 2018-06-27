import html from 'html-template-tag';

export const render = (h, { attrs, content }) => (
	<button {...attrs} class="material">
		{content}
	</button>
);

export const head = html`
<style>
button.material {
	box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);
	border-radius: 2px;
	height: 36px;
	background-color: var(--mainColor);
	border: none;
	min-width: 88px;
    text-transform: uppercase;
	text-align: center;
	color: white;
	font-weight: 500;
	margin: 6px;

	/* For ripple */
	position: relative;
	overflow: hidden;
}

.ripple {
	width: 5px;
	height: 5px;
	background-color: white;
	opacity: 0.5;
	border-radius: 50%;
	position: absolute;
	animation: ripple 1s normal forwards cubic-bezier(0, 0, 0.2, 1)
}

@keyframes ripple {
  0% {
	transform: scale(1);
  }
  90% {
	transform: scale(50);
  }
  100% {
    transform: scale(50);
	opacity: 0;
  }
}
</style>
`;

export const body = html`
<script>
(function () {
	function ripple(ev) {
		var el = this;
		var offset = el.getBoundingClientRect();
		var x = ev.pageX - offset.left;
        var y = ev.pageY - offset.top;
        var span = document.createElement('span');
        span.className = 'ripple';
        span.style.left = x + 'px';
        span.style.top = y + 'px';

		el.appendChild(span);
		setTimeout(el.removeChild.bind(el, span), 1000);
	}

	var elements = document.querySelectorAll('button.material');
	for (var i = 0; i < elements.length; i++) {
		elements[i].addEventListener('click', ripple);
	}
})()
</script>
`;
