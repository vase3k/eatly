class Dashboard {
  selectors = {
    root: ".dashboard__card-price input",
    bar: "svg rect:last-child",
  };

  max = 600;

  constructor() {
    this.rootElements = document.querySelectorAll(this.selectors.root);
    this.svgSelectors = document.querySelectorAll(this.selectors.bar);

    this.updateBar();
  }

  updateBar() {
    this.rootElements.forEach((rootInput, index) => {
      rootInput.addEventListener("input", (event) => {
        let value = parseInt(event.target.value.replace(/\D/g, ""));
        if (isNaN(value)) value = 0;
        const percent = Math.min((value / this.max) * 100, 100);
        this.svgSelectors[index].setAttribute("width", `${percent}%`);
      });
    });
  }
}

export default Dashboard;
