const priceEl = document.querySelectorAll('.dashboard__card-price input');
const bar = document.querySelectorAll('svg rect:last-child');
const max = 600;

priceEl.forEach((e, i) => {
	e.addEventListener("input", () => {
		const value = parseInt(e.value.replace('$', ''));
		const percent = Math.min((value / max) * 100, 100);
		bar[i].setAttribute('width', `${percent}%`);
	})
})
