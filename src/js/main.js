"use strict";

import swiperFeedback from "./modules/swiper.js";
import Header from "./modules/header.js";
import Dashboard from "./modules/dashboardMeter.js";

window.addEventListener("DOMContentLoaded", () => {
  new Header();
  new Dashboard();
  swiperFeedback.init();
});
