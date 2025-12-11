class Header {
  // Селекторы DOM-элементов, которые нужны для работы хедера
  selectors = {
    root: "[data-js-header-nav]", // Основной контейнер навигации
    burgerButton: "[data-js-close]", // Кнопка-бургер
  };

  // Имена атрибутов, которые будут переключаться
  attributes = {
    isActive: "data-active",
  };

  constructor() {
    // Получаем DOM-элементы по указанным селекторам
    this.rootElement = document.querySelector(this.selectors.root);
    this.burgerButtonElement = document.querySelector(
      this.selectors.burgerButton,
    );

    // Привязываем обработчики событий
    this.bindEvents();
  }

  // Обработчик клика по бургер-кнопке
  onBurgerButtonClick = () => {
    // Переключаем атрибут "active" на кнопке
    this.burgerButtonElement.toggleAttribute(this.attributes.isActive);

    // Переключаем атрибут "active" на навигации
    this.rootElement.toggleAttribute(this.attributes.isActive);

    if (this.rootElement.hasAttribute(this.attributes.isActive)) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  };

  // Метод для подключения всех событий
  bindEvents() {
    // Вешаем событие клика на бургер-кнопку
    this.burgerButtonElement.addEventListener(
      "click",
      this.onBurgerButtonClick,
    );
  }
}

export default Header;
